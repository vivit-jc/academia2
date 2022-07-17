<template>
  <div class="row space">
    <h2>調合</h2>
    <div class="col-4">
      <img src="../assets/img/cauldron.png">
      <button type="button" v-show="cauldron.length==2" @click="make_potion">調合</button>
      <p class="warn" v-show="search_notes">この組み合わせで調合したことがあります</p>
    </div>
    <div class="col-5">
      <ul class="list-group">
        <li class="list-group-item cauldron" v-for="(m, key) in cauldron" :key="key">
          <span v-if="m.otype==='reagent'">
            <ReactionProduct :materials="materials" :item="m" :notes="notes"></ReactionProduct>
            <button type="button" class="btn-close" aria-label="Close" @click="cancel_material(m)"></button>
          </span>
          <span v-else>
            <img :src="obj_img(m)" class="material">
            {{ele_j(m.ele)}}
            <button type="button" class="btn-close" aria-label="Close" @click="cancel_material(m)"></button>
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
        <ObjectImage :material="m"></ObjectImage>
        {{m.name}}({{ele_j(m.ele)}}) x{{m.num}}
        <button type="button" :class="{'btn-secondary':!settable(m)}" @click="click_material_command(m)">入れる</button>
        <button type="button">ノート</button>
      </div>
    </div>
    <div class="row" v-if="table==='reagents'">
      <div class="col-6" v-for="(i, key) in rack.filter(e=>e.otype==='reagent')" :key="key" @mouseover="onMaterial=i" @mouseout="onMaterial=''" :class="[{hover:onMaterial===i},{}]">
        <ReactionProduct :materials="materials" :item="i" :notes="notes"></ReactionProduct>
        <button type="button" :class="{'btn-secondary':!settable(i)}" @click="enter_reagent(i)">入れる</button>
        <button @click="open_note(notes.find(n=>n.number==i.number))">ノート</button>
      </div>
    </div>
  </div>
  <NoteView v-if="showing" :showing="showing" :notes="notes" :materials="materials" @open_note="open_note" @write_paper="write_paper"></NoteView>
</template>

<script>
import {obj_img, ele_j, search_notes} from '../misc.js'
import ReactionProduct from './ReactionProduct.vue'
import NoteView from './NoteView.vue'
import ObjectImage from './ObjectImage.vue'

export default {
  name: 'MakePotionView',
  props: ['notes', 'materials', 'reagents', 'rack'],
  emits: ['make_potion','write_paper'],
  components: {ReactionProduct, NoteView, ObjectImage},
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
    click_material_command(m) {
      if(!this.settable(m)){return false}
      this.cauldron.push(m)
    },
    enter_reagent(i){
      this.cauldron.push(i)
    },
    show_materials(){
      this.table = "materials"
    },
    show_reagents(){
      this.table = "reagents"
    },
    cancel_material(m){
      this.cauldron = this.cauldron.filter(e => e!=m)
    },
    make_potion(){
      this.$emit("make_potion",this.cauldron)
      this.showing = search_notes(this.notes, this.cauldron)
      this.cauldron = []
    },
    open_note(note){
      this.showing = note
    },
    write_paper(note,type){
      this.$emit("write_paper",note,type)
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