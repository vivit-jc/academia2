<template>
    <h1 class="center">Academia</h1>
    
    <div class="right">
      制作：vivit_jc
      <a href="https://twitter.com/vivit_jc">Twitter</a>&nbsp;
      <a href="https://github.com/vivit-jc/dicey_farm">GitHub</a>
    </div>
    <div class="buttons">
      <button type="button" @click="showHowToPlay" class="btn btn-secondary btn-sm">遊び方</button>
      <button type="button" @click="showRules" class="btn btn-secondary btn-sm">ルール説明</button>
      <button type="button" @click="showBeta" v-show="beta" class="btn btn-secondary btn-sm">β変更点</button>
      <button type="button" @click="showUpdates" v-show="!beta" class="btn btn-secondary btn-sm">変更履歴</button>
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
          <div>
            花の月 １日
            {{time}}時
          </div>
          <ul class="list-group">
            <li class="list-group-item command" v-for="(command, key) in commands" :key="key" v-bind:class="[{hover:onCommand===command},{}]" @mouseover="onCommand=command" @mouseout="onCommand=''" @click="click_command(command)">
              {{command}}
              <span class="badge rounded-pill bg-info text-dark" v-if="command==='ノート'">{{notes.length}}</span>
              <span class="badge rounded-pill bg-info text-dark" v-if="command==='論文'">{{papers.length}}</span>
              <span class="badge rounded-pill bg-info text-dark" v-if="command==='薬棚・使い魔'">{{rack.length}}</span>
            </li>
          </ul>
        </div>
        <div class="col-lg-10">
          <MakePotionView v-if="gameStatus==='make_potion'" :materials="materials" :notes="notes" :reagents="get_reagents" :rack="rack" @make_potion="make_potion" @write_paper="write_paper" @search_notes_by_mat="search_notes_by_mat">
          </MakePotionView>
          <ChangePlace v-if="gameStatus==='change_place'"></ChangePlace>
          <ShowNotes v-if="gameStatus==='notes'" :notes="notes" :materials="materials" :search_mat="search_mat" @write_paper="write_paper">
          </ShowNotes>
          <ShowRack v-if="gameStatus==='rack'" :rack="rack" :notes="notes" :materials="materials">
          </ShowRack>
          <ShowPapers v-if="gameStatus==='papers'" :papers="papers" :materials="materials" :notes="notes" @write_paper="write_paper"></ShowPapers>
          <ShowMaterials v-if="gameStatus==='materials'" :materials="materials"></ShowMaterials>
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
import ShowPapers from './components/ShowPapers.vue'
import ShowMaterials from './components/ShowMaterials.vue'
import ChangePlace from './components/ChangePlace.vue'

import {get_cauldron_mat, search_notes, calc_potion, get_object_type, get_reagent_number, get_m_from_name, calc_candidate, get_writable_paper} from './misc.js'
import './assets/css/main.css';

export default {
  name: 'App',
  components: {
    MakePotionView, ShowNotes, ShowRack, ShowPapers, ShowMaterials, ChangePlace
  },
  data() {
    return {
      viewStatus: "game",
      gameStatus: "make_potion",
      onMaterial: "",
      onCommand: "",
      onNote: "",
      search_mat: "",
      subjectNumber: 0,
      paperNumber: 0,
      commands: ["調合","外出","ノート","論文","薬棚・使い魔","素材","ヘルプ"],
      cauldron: [],
      materials: [
        //f,t,e,w,s,d
        {name: "キノコ",src: "mushroom", known: true, num: 20, ele: ["t","w"], place:"f"},
        {name: "カエル",src: "frog", known: false, num: 20, ele: ["f","d"], place:"f"},
        {name: "枝",src: "branches", known: false, num: 20, ele: ["f","e"], place:"m"},
        {name: "葉っぱ",src: "leaves", known: false, num: 20, ele: ["e","s"], place:"f"},
        {name: "ミミズ",src: "worm", known: true, num: 20, ele: ["e","d"], place:"f"},
        {name: "ベリー",src: "berries", known: false, num: 20, ele: ["e","d"], place:"m"},
        {name: "トカゲ",src: "lizard", known: false, num: 20, ele: ["f","d"], place:"c"},
        {name: "羽根",src: "feather", known: false, num: 20, ele: ["f","w"], place:"m"},
        {name: "巻き貝",src: "nautilus", known: false, num: 20, ele: ["t","s"], place:"l"},
        {name: "クモ",src: "spider", known: false, num: 20, ele: ["t","e"], place:"f"}
        
      ],
      notes: [],
      rack: [],
      papers: [],
      msg: [],
      time: 8,
    }
  },

  computed: {
    get_reagents(){
      return this.rack.filter(e=>e.otype==="reagent")
    },
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
    click_command(c){
      this.cauldron = []
      this.msg = []
      this.search_mat = ""
      if(c === "調合"){
        this.gameStatus = "make_potion"
        this.msg = ["調合中・・・"]
      } else if(c === "外出"){
        this.gameStatus = "change_place"
      } else if(c === "ノート"){
        this.gameStatus = "notes"
        this.msg = ["見直すノートを選んでください"]
      } else if(c === "論文") {
        this.gameStatus = "papers"
      } else if(c === "素材"){
        this.gameStatus = "materials"
      } else if(c === "薬棚・使い魔"){
        this.gameStatus = "rack"
      }

    },
    make_potion(cauldron){
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
      let note = {
        materials: get_cauldron_mat(c), 
        ele: result, 
        otype: get_object_type(result), 
        number: this.subjectNumber, 
        theme:"exp"
      }
      if(this.get_m_from_name(note.materials[0]).known && this.get_m_from_name(note.materials[1]).known){
        note.known = true
      }
      this.notes.push(note)
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

    write_paper(note,type){
      let paper
      if(type==="atom_direct"){
        paper = note
      } else {
        paper = get_writable_paper(this.materials, this.notes, note)
      }
      console.log(JSON.stringify(paper))
      if(paper.theme === "atom"){
        this.paperNumber += 1
        let m = this.get_m_from_name(paper.name)
        let p = {theme: "atom", name: m.name, number: this.paperNumber, submitted: false}
        m.known = true
        this.papers.push(p)
        this.rewrite_known()
      } else if(paper.theme === "crystal"){
        this.subjectNumber += 1
        let n = {
          theme: "crystal", 
          ntype: "discussion", 
          name: paper.name, 
          sub: paper.sub, 
          ref: paper.ref, 
          candidate2: calc_candidate("crystal",this.get_m_from_name(paper.sub).ele), 
          number: this.subjectNumber
        }
        this.notes.push(n)
      } else if(paper.theme === "potion"){
        this.subjectNumber += 1
        let n = {
          theme: "potion", 
          ntype: "discussion", 
          name: paper.name, 
          sub: paper.sub, 
          ref: paper.ref, 
          candidate4: calc_candidate("potion",this.get_m_from_name(paper.sub).ele), 
          number: this.subjectNumber
        }
        this.notes.push(n)
      } else if(paper.theme === "reagent"){
        this.subjectNumber += 1
        let n = {
          theme: "reagent", 
          ntype: "discussion", 
          name: paper.name, 
          sub: paper.sub, 
          ref: paper.ref, 
          candidate4: calc_candidate("reagent",this.get_m_from_name(paper.sub).ele), 
          number: this.subjectNumber
        }
        this.notes.push(n)
      }
    },
    rewrite_known(){
      let array = [].concat(this.notes,this.rack)
      array.forEach(item=>{
        if(item.otype==="reagent" || item.otype==="duplicate" || item.otype==="potion" || item.otype==="crystal"){
          // 本当は材料を再帰的に全部チェックする必要がある あとで書く
          if(item.materials.flat().length == 2){
            if(this.get_m_from_name(item.materials[0]).known && this.get_m_from_name(item.materials[1]).known){
              item.known = true
            }
          }
        }
      })
    },
    search_notes_by_mat(m){
      console.log(m.name)
      this.gameStatus = "notes"
      this.search_mat = m
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
      this.materials.forEach(e=>{
        e.num_past = 0
      })
    },
    get_m_from_name(name){
      return get_m_from_name(this.materials, name)
    }
  }
}
</script>

<style>

</style>
