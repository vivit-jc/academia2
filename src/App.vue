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
          <MakePotion v-if="gameStatus==='make_potion'" :materials="materials" :notes="notes" v-on:make_potion="make_potion">
          </MakePotion>
          <ShowNotes v-if="gameStatus==='notes'" :notes="notes" :materials="materials">
          </ShowNotes>
          <div class="row message space">
            <p v-for="(m, key) in msg" :key="key">{{m}}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import MakePotion from './components/MakePotion.vue'
import ShowNotes from './components/ShowNotes.vue'
import {get_crystal_num, get_cauldron_mat_name, mat_img, search_notes, calc_potion, show_report} from './misc.js'
import './assets/css/main.css';

export default {
  name: 'App',
  components: {
    MakePotion, ShowNotes
  },
  data() {
    return {
      viewStatus: "game",
      gameStatus: "make_potion",
      onMaterial: "",
      onCommand: "",
      onNote: "",
      commands: ["調合","外出","ノート","論文","素材","薬棚・使い魔","ヘルプ"],
      cauldron: [],
      materials: [
        //f,t,e,w,s,d
        {name: "キノコ",src: "mushroom", known: "?", num: 4, ele: ["t","w"]},
        {name: "カエル",src: "frog", known: "?", num: 4, ele: ["f","d"]},
        {name: "枝",src: "branches", known: "?", num: 4, ele: ["e","f"]},
        {name: "葉っぱ",src: "leaves", known: "?", num: 4, ele: ["e","s"]},
        {name: "ミミズ",src: "worm", known: "?", num: 5, ele: ["e","d"]},
        {name: "ベリー",src: "berries", known: "?", num: 5, ele: ["e","d"]}
      ],
      notes: [
        {materials:["キノコ","カエル"]},
        {materials:["キノコ","枝"]},
        {materials:["キノコ","ミミズ"]},
        {materials:["ベリー","カエル"]}
      ],
      rack: [],
      msg: [],
    }
  },

  computed: {

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
    make_potion(cauldron){
      cauldron.forEach(e => {e.num -= 1})
      let potion = calc_potion(this.materials,[cauldron[0].name,cauldron[1].name])
      this.msg = show_report(potion)
      this.msg.push(this.msg_get_potion(potion))
      if(!search_notes(this.notes, cauldron)) {
        this.add_note(cauldron);
        this.msg.push("結果をノートに書き残した")
      }
      this.add_rack(potion)
    },

    add_note(c){
      this.notes.push({
        materials: get_cauldron_mat_name(c)
      })
    },
    add_rack(result){
      let type = this.get_object_type(result)
      if(result.length == 0){
        return false;
      } else if(type == "duplicate"){
        // 2個分増やす
        this.rack.unshift({materials: this.get_cauldron_mat_name, otype: "reagent"})
        this.rack.unshift({materials: this.get_cauldron_mat_name, otype: "reagent"})
      } else {
        this.rack.unshift({materials: this.get_cauldron_mat_name, otype: type})
      }
    },

    msg_get_potion(result){
      let type = this.get_object_type(result)

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
    get_object_type(result){
      let crystal = get_crystal_num(result)
      if(crystal == 2){
        return "duplicate"
      } else if(crystal == 1 && result.length == 3){
        return "potion"
      } else if(crystal == 1){
        return "crystal"
      } else if(result.length == 2){
        return "reagent"
      }
    },
    get_m_from_name(name){
      return this.materials.filter(m => m.name === name)[0]
    },
    mat_img(m){
      return mat_img(m)
    }
  }
}
</script>

<style>

</style>
