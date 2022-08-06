<template>
  <span v-if="note.theme==='exp'">
    実験 #{{note.number}}：
    <ObjectImage :material="get_m_from_name(note.materials[0])"></ObjectImage>
    +
    <ObjectImage :material="get_m_from_name(note.materials[1])"></ObjectImage>
    →
    <ObjectImage :material="note"></ObjectImage>
  </span>
  <span v-else-if="note.candidate2">
    考察 #{{note.number}}：
    <ObjectImage :material="get_m_from_name(note.name)"></ObjectImage>=
    <img v-for="atom in note.candidate2[0]" :key="atom.id" :src="atom_img(atom)" class="atom"> or 
    <img v-for="atom in note.candidate2[1]" :key="atom.id" :src="atom_img(atom)" class="atom">
  </span>
  <span v-else-if="note.candidate4">
    考察 #{{note.number}}：
    <ObjectImage :material="get_m_from_name(note.name)"></ObjectImage>=
    (<img :src="atom_img(note.candidate4[0])" class="atom"> or 
    <img :src="atom_img(note.candidate4[1])" class="atom">) - 
    (<img :src="atom_img(note.candidate4[2])" class="atom"> or 
    <img :src="atom_img(note.candidate4[3])" class="atom">) 
  </span>
</template>

<script>
import ObjectImage from './ObjectImage.vue'

import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, atom_str} from '../misc.js'

export default {
  name: 'NoteSummary',
  props: ['materials','note'],
  emit: [],
  components: {ObjectImage},
  data() {
    return {
      onNote: "",
      showing: null,
      noteMsg: [],
      toggleStatus: [1,1,1,1,1,1]
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    open_note(note){
      this.showing = note
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