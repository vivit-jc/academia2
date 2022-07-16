<template>
  <div class="row space">
    <div>実験 #{{note.number}}</div>
    <div>
      <img :src="obj_img(get_m_from_name(note.materials[0]))" class="material">
      {{obj_j(get_m_from_name(note.materials[0]))}}
      {{get_reagent_number(note.materials[0])}}
      +
      <img :src="obj_img(get_m_from_name(note.materials[1]))" class="material">
      {{obj_j(get_m_from_name(note.materials[1]))}}
      {{get_reagent_number(note.materials[1])}}
      →
      <img :src="obj_img(note)" class="material">{{obj_j(note)}}
    </div>
    <p v-for="(m, key) in noteMsg" :key="key">{{m}}</p>
    <div>
      <button v-if="get_reagent_number(note.materials[0])" @click="JumpToNote(0)">
        ノート{{get_reagent_number(note.materials[0])}}を見る
      </button>
      <button v-if="get_reagent_number(note.materials[1])" @click="JumpToNote(1)">
        ノート{{get_reagent_number(note.materials[1])}}を見る
      </button>
    </div>
  </div>
</template>

<script>
import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, show_report} from '../misc.js'

export default {
  name: 'NoteView',
  props: ['notes', 'materials', 'showing'],
  components: {},
  data() {
    return {
      noteMsg: [],
      note: this.showing
    }
  },
  computed: {

  },
  watch: {
    showing() {
      this.note = this.showing
      this.setNote()
    }
  },
  mounted() {
    this.setNote()
  },
  methods: {
    setNote() {
      this.noteMsg = show_report(this.note.ele)
      this.noteMsg.push(this.note.materials)
    },
    JumpToNote(num){
      let n = (this.notes.find(n => n.number == get_reagent_number(this.notes, this.note.materials[num])))
      this.$emit("open_note",n)
      this.setNote()
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