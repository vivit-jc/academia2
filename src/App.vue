<template>
    <h1 class="center">Academia</h1>
    
    <div class="right">
      制作：vivit_jc
      <a href="https://twitter.com/vivit_jc">Twitter</a>&nbsp;
      <a href="https://github.com/vivit-jc/dicey_farm">GitHub</a>
    </div>
    <transition>
      <div class="alert alert-danger fade show center" id="alertmsg" role="alert" v-show="showAlert">{{alert_str}}</div>
    </transition>
    <div class="center" v-show="viewStatus==='howtoplay'">
      <button type="button" @click="returnGame" class="btn btn-secondary btn-sm">ゲームに戻る</button><br>
      <img src="./assets/img/cauldron.png">
    </div>
    <div class="container main" v-show="viewStatus==='game'">
      <div class="row">
        <div class="col-12 col-lg-2 space" id="commands">
          <button type="button" @click="showHowToPlay" class="btn btn-secondary btn-sm">遊び方</button>
          <button type="button" @click="showRules" class="btn btn-secondary btn-sm">ルール説明</button>
          <button type="button" @click="showBeta" v-show="beta" class="btn btn-secondary btn-sm">β変更点</button>
          <button type="button" @click="showUpdates" v-show="!beta" class="btn btn-secondary btn-sm">変更履歴</button>
          <ul class="list-group">
            <li class="list-group-item command" v-for="(command, key) in commands" :key="key" v-bind:class="[{hover:onCommand===command},{}]" @mouseover="onCommand=command" @mouseout="onCommand=''" @click="clickCommand(command)">
              {{command}}
              <span class="badge rounded-pill bg-info text-dark" v-if="command==='ノート'">{{notes.length}}</span>
              <span class="badge rounded-pill bg-info text-dark" v-if="command==='薬棚・使い魔'">{{rack.length}}</span>
            </li>
          </ul>
        </div>
        <div class="col-lg-10">
          <MakePotionView v-if="gameStatus==='make_potion'" :materials="materials" :notes="notes" :reagents="get_reagents" :rack="rack" @make-potion="makePotion">
          </MakePotionView>
          <ShowNotes v-if="gameStatus==='notes'" :notes="notes" :materials="materials">
          </ShowNotes>
          <ShowRack v-if="gameStatus==='rack'" :rack="rack" :notes="notes" :materials="materials">
          </ShowRack>
          
          <div class="row message space">
            <p v-for="(m, key) in msg" :key="key">{{m}}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import MakePotionView from './components/MakePotionView.vue'
import ShowNotes from './components/ShowNotes.vue'
import ShowRack from './components/ShowRack.vue'

import {get_cauldron_mat, search_notes, calc_potion, get_object_type, get_reagent_number} from './misc.js'
import './assets/css/main.css';

export default {
  name: 'App',
  components: {
    MakePotionView, ShowNotes, ShowRack
  },
  data() {
    return {
      viewStatus: "game",
      gameStatus: "make_potion",
      onMaterial: "",
      onCommand: "",
      onNote: "",
      subjectNumber: 0,
      commands: ["調合","外出","ノート","論文","素材","薬棚・使い魔","ヘルプ"],
      cauldron: [],
      materials: [
        //f,t,e,w,s,d
        {name: "キノコ",src: "mushroom", known: "?", num: 4, ele: ["t","w"]},
        {name: "カエル",src: "frog", known: "?", num: 4, ele: ["f","d"]},
        {name: "枝",src: "branches", known: "?", num: 4, ele: ["e","f"]},
        {name: "葉っぱ",src: "leaves", known: "?", num: 4, ele: ["e","s"]},
        {name: "ミミズ",src: "worm", known: "?", num: 5, ele: ["e","d"]},
        {name: "ベリー",src: "berries", known: "?", num: 5, ele: ["e","d"]},
        {name: "トカゲ",src: "lizard", known: "?", num: 5, ele: ["f","d"]},
        {name: "羽根",src: "feather", known: "?", num: 5, ele: ["w","f"]}
        
      ],
      notes: [

      ],
      rack: [],
      msg: [],
    }
  },

  computed: {
    get_reagents(){
      return this.rack.filter(e=>e.otype==="reagent")
    }
  },

  watch: {
  },

  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    console.log("錬金術アカデミーのやつ ver 0.01")
    this.initGame()
  },

  unmounted() {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    clickCommand(c){
      this.cauldron = []
      this.msg = []
      if(c === "調合"){
        this.gameStatus = "make_potion"
        this.msg = ["調合中・・・"]
      } else if(c === "ノート"){
        this.gameStatus = "notes"
        this.msg = ["見直すノートを選んでください"]
      } else if(c === "薬棚・使い魔"){
        this.gameStatus = "rack"
      }

    },
    makePotion(cauldron){
      let elements = []
      cauldron.forEach(e => {
        if(!e.otype){
          e.num -= 1
        }
        elements.push(e.ele)
      })

      let potion = calc_potion(elements)
      this.msg = [this.msg_get_potion(potion)]
      if(!search_notes(this.notes, cauldron)) {
        this.add_note(cauldron, potion);
        this.msg.push("結果をノートに書き残した")
      }
      this.add_rack(cauldron, potion)
    },

    add_note(c,result){
      this.subjectNumber += 1
      this.notes.push({
        materials: get_cauldron_mat(c), ele: result, otype: get_object_type(result), number: this.subjectNumber
      })
    },

    add_rack(cauldron, result){
      if(result.length == 0) return false;

      let type = get_object_type(result)
      let obj = {
        materials: get_cauldron_mat(cauldron), 
        otype: type, 
        ele: result, 
        number: get_reagent_number(this.notes, get_cauldron_mat(cauldron))
      }

      if(type == "duplicate"){
        obj.otype = "reagent"
        obj.ele = [obj.ele[0][0], obj.ele[1][0]] // ["ee","dd"]などの状態から["e","d"]に書き換える
        this.rack.unshift(JSON.parse(JSON.stringify(obj)))
      } 
      this.rack.unshift(obj)
    },

    msg_get_potion(result){
      let type = get_object_type(result)

      if(type == "duplicate"){
        return "試薬を2つ分得た"
      } else if(type == "potion"){
        return "ポーションを得た"
      } else if(type == "crystal"){
        return "結晶を得た"
      } else if(type == "reagent"){
        return "試薬を得た"
      }
    },
    handleResize() {
      if (window.innerWidth <= 1000) {
          this.small = true
      } else {
          this.small = false
      }
    },
    initGame() {

    },
  }
}
</script>

<style>

</style>
