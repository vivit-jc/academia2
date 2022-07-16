<template>
  <div class="row space">
    <h2>調合</h2>
    <div class="col-3">
      <img src="../assets/img/cauldron.png">
      <button type="button" v-show="cauldron.length==2" @click="makePotion">調合</button>
      <p class="warn" v-show="search_notes">この組み合わせで調合したことがあります</p>
    </div>
    <div class="col-3">
      <ul class="list-group">
        <li class="list-group-item cauldron" v-for="(m, key) in cauldron" :key="key">
          <span v-if="m.otype==='reagent'">
            <ReactionProduct :materials="materials" :item="m" :notes="notes"></ReactionProduct>
            <button type="button" class="btn-close" aria-label="Close" @click="cancelMaterial(m)"></button>
          </span>
          <span v-else>
            <img :src="obj_img(m)" class="material">
            {{ele_j(m.ele)}}
            <button type="button" class="btn-close" aria-label="Close" @click="cancelMaterial(m)"></button>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="row space">
    <div>
      <button type="button" @click="show_materials">素材</button>
      <button type="button" @click="show_reagents">試薬</button>
    </div>
    <div class="row" v-if="table==='materials'">
      <div class="col-6" v-for="(m, key) in materials" :key="key" v-show="m.num>0" :class="[{hover:onMaterial===m.name},{}]" @mouseover="onMaterial=m.name" @mouseout="onMaterial=''">
        <img :src=obj_img(m) class="material">
        {{m.name}}({{ele_j(m.ele)}}) x{{m.num}}
        <button type="button" :class="{'btn-secondary':!settable(m)}" @click="clickMaterialCommand(m)">入れる</button>
        <button type="button">ノート</button>
      </div>
    </div>
    <div class="row" v-if="table==='reagents'">
      <div class="col-6" v-for="(i, key) in rack.filter(e=>e.otype==='reagent')" :key="key" @mouseover="onMaterial=i" @mouseout="onMaterial=''" :class="[{hover:onMaterial===i},{}]">
        <ReactionProduct :materials="materials" :item="i" :notes="notes"></ReactionProduct>
        <button type="button" :class="{'btn-secondary':!settable(i)}" @click="enterReagent(i)">入れる</button>
        <button @click="openNote(notes.find(n=>n.number==i.number))">ノート</button>
      </div>
    </div>
  </div>
  <NoteView v-if="showing" :showing="showing" :notes="notes" :materials="materials" @open_note="openNote"></NoteView>
</template>

<script>
import {obj_img, ele_j, search_notes} from '../misc.js'
import ReactionProduct from './ReactionProduct.vue'
import NoteView from './NoteView.vue'

export default {
  name: 'MakePotionView',
  props: ['notes', 'materials', 'reagents', 'rack'],
  components: {ReactionProduct, NoteView},
  data() {
    return {
      onMaterial: "",
      cauldron: [],
      table: "materials",
      showing: null
    }
  },
  computed: {
    search_notes(){
      return search_notes(this.notes, this.cauldron)
    },
  },
  mounted() {

  },
  methods: {
    clickMaterialCommand(m) {
      if(!this.settable(m)){return false}
      this.cauldron.push(m)
    },
    enterReagent(i){
      this.cauldron.push(i)
    },
    show_materials(){
      this.table = "materials"
    },
    show_reagents(){
      this.table = "reagents"
    },
    cancelMaterial(m){
      this.cauldron = this.cauldron.filter(e => e!=m)
    },
    makePotion(){
      this.$emit("make-potion",this.cauldron)
      this.showing = search_notes(this.notes, this.cauldron)
      this.cauldron = []
    },
    openNote(note){
      this.showing = note
    },
    obj_img(i){
      return obj_img(i)
    },
    ele_j(m){
      return ele_j(m)
    },
    settable(m) {
      if(this.cauldron.length === 1 && this.cauldron[0] === m){return false}
      if(this.cauldron.length === 2){return false}
      return true
    },
  }
}
</script>