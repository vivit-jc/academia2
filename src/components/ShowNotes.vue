<template>
  <div class="row space">
    <p v-for="(m, key) in noteMsg" :key="key">{{m}}</p>
  </div>
  <div class="row space">
    <div class="col-6" v-for="(n, key) in notes" :key="key" :class="[{hover:onNote===n},{}]" @mouseover="onNote=n" @mouseout="onNote=''" @click="clickNote(n)">
      実験：
      <img :src="mat_img(get_m_from_name(n.materials[0]))" class="material">+
      <img :src="mat_img(get_m_from_name(n.materials[1]))" class="material">
    </div>
  </div>
</template>

<script>
import {get_m_from_name, mat_img, ele_j, calc_potion, show_report} from '../misc.js'

export default {
  name: 'ShowNotes',
  props: ['notes', 'materials'],
  data() {
    return {
      onNote: "",
      noteMsg: []
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    clickNote(note){
      this.noteMsg = show_report(calc_potion(this.materials,note.materials))
    },
    mat_img(m){
      return mat_img(m)
    },
    ele_j(m){
      return ele_j(m)
    },
    get_m_from_name(name){
      return get_m_from_name(this.materials,name)
    },
  }
}
</script>