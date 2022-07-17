<template>
  <div class="row space">
    <h2>ノート</h2>
    <div class="col-6" v-for="(n, key) in notes" :key="key" :class="[{hover:onNote===n},{}]" @mouseover="onNote=n" @mouseout="onNote=''" @click="open_note(n)">
      <span v-if="n.theme==='exp'">
        実験 #{{n.number}}：
        <ObjectImage :material="get_m_from_name(n.materials[0])"></ObjectImage>
        +
        <ObjectImage :material="get_m_from_name(n.materials[1])"></ObjectImage>
        →
        <img :src="obj_img(n)" class="material">
      </span>
      <span v-if="n.theme==='candidate'">
        考察 #{{n.number}}:
        <ObjectImage :material="get_m_from_name(n.name)"></ObjectImage>→
        <img v-for="atom in n.candidate[0]" :key="atom.id" :src="atom_img(atom)"> or 
        <img v-for="atom in n.candidate[1]" :key="atom.id" :src="atom_img(atom)">
      </span>
    </div>
  </div>
  <NoteView v-if="showing" :showing="showing" :notes="notes" :materials="materials" @open_note="open_note" @write_paper="write_paper"></NoteView>
</template>

<script>
import NoteView from './NoteView.vue'
import ObjectImage from './ObjectImage.vue'

import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, atom_str} from '../misc.js'

export default {
  name: 'ShowNotes',
  props: ['notes', 'materials'],
  emit: ['write_paper'],
  components: {NoteView, ObjectImage},
  data() {
    return {
      onNote: "",
      showing: null,
      noteMsg: []
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    open_note(note){
      this.showing = note
      console.log(JSON.stringify(note))
    },
    write_paper(note,type){
      this.$emit("write_paper",note,type)
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