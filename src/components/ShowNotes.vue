<template>
  <div class="row space">
    <h2>ノート</h2>
    <div class="col-6" v-for="(n, key) in notes" :key="key" :class="[{hover:onNote===n},{}]" @mouseover="onNote=n" @mouseout="onNote=''" @click="openNote(n)">
      実験 #{{n.number}}：
      <ObjectImage :material="get_m_from_name(n.materials[0])"></ObjectImage>
      +
      <ObjectImage :material="get_m_from_name(n.materials[1])"></ObjectImage>
      →
      <img :src="obj_img(n)" class="material">
    </div>
  </div>
  <NoteView v-if="showing" :showing="showing" :notes="notes" :materials="materials" @open_note="openNote"></NoteView>
</template>

<script>
import NoteView from './NoteView.vue'
import ObjectImage from './ObjectImage.vue'

import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number} from '../misc.js'

export default {
  name: 'ShowNotes',
  props: ['notes', 'materials'],
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
    openNote(note){
      this.showing = note
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
    }
  }
}
</script>