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
          <MakePotion class="row space" v-show="gameStatus==='make_potion'" v-bind:cauldron=cauldron>

          </MakePotion>
          <div class="row space" v-show="gameStatus==='make_potion'">
            <div class="col-6" v-for="(m, key) in materials" :key="key" v-show="m.num>0" v-bind:class="[{hover:onMaterial===m.name},{}]" @mouseover="onMaterial=m.name" @mouseout="onMaterial=''">
              <img :src=mat_img(m) class="material">
              {{m.name}}({{ele_j(m.ele)}}) x{{m.num}}
              <button type="button" class="rounded-pill btn-sm" v-bind:class="{'btn-secondary':!settable(m)}" @click="clickMaterialCommand(m)">入れる</button>
              <button type="button" class="rounded-pill btn-sm">ノート</button>
            </div>
          </div>
          <div class="row space" v-show="gameStatus==='notes'">
            <p v-for="(m, key) in noteMsg" :key="key">{{m}}</p>
          </div>
          <div class="row space" v-show="gameStatus==='notes'">
            <div class="col-6" v-for="(n, key) in notes" :key="key" v-bind:class="[{hover:onNote===n},{}]" @mouseover="onNote=n" @mouseout="onNote=''" @click="clickNote(n)">
              実験：
              <img :src=mat_img(get_m_from_name(n.materials[0])) class="material">+
              <img :src=mat_img(get_m_from_name(n.materials[1])) class="material">
            </div>
          </div>
          <div class="row message space">
            <p v-for="(m, key) in msg" :key="key">{{m}}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import MakePotion from './components/MakePotion.vue'
import './assets/css/main.css';

export default {
  name: 'App',
  components: {
    MakePotion
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
      noteMsg: []
    }
  },

  computed: {
    search_notes(){
      return this.notes.filter(n => {
        let c = this.get_cauldron_mat_name;
        if(!c) return false;
        return c.join() === n.materials.sort().join();
      }).length > 0
    },
    get_cauldron_mat_name(){
      if(this.cauldron.length != 2) return false;
      return [this.cauldron[0].name, this.cauldron[1].name].sort();
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
    clickNote(note){
      this.noteMsg = this.show_report(this.calc_potion(note.materials))
    },
    clickMaterialCommand(m) {
      if(!this.settable(m)){return false}
      this.cauldron.push(m)
    },
    deleteCauldron(m){
      this.cauldron = this.cauldron.filter(e => e!=m)
      console.log("deleteCauldron")
    },
    make_potion(){
      this.cauldron.forEach(e => {e.num -= 1})
      let potion = this.calc_potion([this.cauldron[0].name,this.cauldron[1].name])
      this.msg = this.show_report(potion)
      this.msg.push(this.msg_get_potion(potion))
      if(!this.search_notes) {
        this.add_note();
        this.msg.push("結果をノートに書き残した")
      }
      this.add_rack(potion)
      this.cauldron = []
    },
    calc_potion(mats){
      let elements = [].concat(this.get_ele_from_name(mats[0]),this.get_ele_from_name(mats[1]))
      let atoms = ["f","t","e","w","s","d"]
      let pairs = [["f","t"],["e","w"],["s","d"]]
      let result = elements.sort()
      
      // 対消滅
      pairs.forEach(pair => {
        if(elements.includes(pair[0]) && elements.includes(pair[1])){
          result = result.filter(e => {
            return (e != pair[0] && e != pair[1])
          })
        }
      })

      // 結晶化
      atoms.forEach(a => {
        if(result.filter(e => e==a).length == 2){
          result = result.filter(e => e!=a)
          result.push(a+a)
        }
      })

      return result
    },
    add_note(){
      this.notes.push({
        materials: this.get_cauldron_mat_name
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
    show_report(result){
      let mal = result.join().replace(/,/g,"").length
      let crystal = false
      let same = false
      let msg = []
      if(result.length == 1 && this.get_crystal_num(result) == 1){
        crystal = true;
      } else if(result.filter(e => e.length == 2).length == 2){
        same = true
      }
      msg = [result.join(),`魔力量: ${mal}mal`]
      if(crystal) msg.push("結晶が析出した")
      if(same) msg.push("反応は起きなかった")

      return msg;
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
    settable(m) {
      if(this.cauldron.length === 1 && this.cauldron[0] === m){return false}
      if(this.cauldron.length === 2){return false}
      return true
    },
    get_ele_from_name(name){
      return this.materials.filter(e => e.name === name)[0].ele
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
      let crystal = this.get_crystal_num(result)
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
    get_crystal_num(result){
      return result.filter(e=> e.length==2).length
    },
    ele_j(e) {
      return e[0]+"-"+e[1]
    },
    mat_img(m) {
      return require("./assets/img/"+m.src+".png")
    },
    get_m_from_name(name){
      return this.materials.filter(m => m.name === name)[0]
    }
  }
}
</script>

<style>

</style>
