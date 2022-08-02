<template>
  <div class="row space">
    <h2>ノート</h2>
    <div v-if="!search_mat">
      絞り込み：
      <button v-for="(str,index) in toggleStr" :key="str" :class="{'btn-secondary':!toggleStatus[index]}" @click="toggle(index)">{{str}}</button>
    </div>
    <div class="col-6" v-for="(n, key) in narrow_notes" :key="key" :class="[{hover:onNote===n},{}]" @mouseover="onNote=n" @mouseout="onNote=''" @click="open_note(n)">
      <NoteSummary :materials="materials" :note="n"></NoteSummary>
    </div>
  </div>
  <NoteView v-if="showing" :showing="showing" :notes="notes" :materials="materials" @open_note="open_note" @write_paper="write_paper"></NoteView>
</template>

<script>
import NoteView from './NoteView.vue'
import NoteSummary from './NoteSummary.vue'

import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, atom_str} from '../misc.js'

export default {
  name: 'ShowNotes',
  props: ['notes', 'materials', 'search_mat'],
  emit: ['write_paper'],
  components: {NoteView, NoteSummary},
  data() {
    return {
      onNote: "",
      showing: null,
      noteMsg: [],
      toggleStr: ["実験","考察","ポーション","試薬","結晶","消失"],
      toggleStatus: [1,1,1,1,1,1]
    }
  },
  computed: {
    narrow_notes(){
      if(this.search_mat){
        return this.notes.filter(n=>{
          if(n.theme==="exp"){
            return n.materials.find(m=>m===this.search_mat.name)
          } else {
            return n.name === this.search_mat.name
          }
        })
      } else {
        return this.notes.filter(n=>{
          return ((n.theme==="exp" && this.toggleStatus[0]) && (
            (n.otype==="potion" && this.toggleStatus[2]) || 
            (n.otype==="reagent" && this.toggleStatus[3]) || 
            (n.otype==="crystal" && this.toggleStatus[4]) || 
            (n.otype===false && this.toggleStatus[5]))) ||
            (n.ntype==="discussion" && this.toggleStatus[1])
        })
      }
    }
  },
  mounted() {

  },
  methods: {
    open_note(note){
      this.showing = note
    },
    write_paper(note,type){
      this.$emit("write_paper",note,type)
    },
    toggle(type){
      this.toggleStatus[type] = 1 - this.toggleStatus[type]
    },
    obj_img(i){
      return obj_img(i)
    },
    obj_j(i){
      return obj_j(i)
    },
    ele_j(m){
      return ele_j(m)
    },
    get_m_from_name(name){
      return get_m_from_name(this.materials,name)
    },
    get_reagent_number(mat){
      let n = get_reagent_number(this.notes, mat)
      if(n){return "#"+n}
      else{return ""}
    },
    atom_img(m){
      let t = atom_str(m)
      return require("../assets/img/"+t+".png")
    },
  }
}
</script>