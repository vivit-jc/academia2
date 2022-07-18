<template>
  <div class="row space" v-if="note.theme==='exp'">
    <div>実験 #{{note.number}}</div>
    <div>
      <ObjectImage :material="get_m_from_name(note.materials[0])"></ObjectImage>
      {{obj_j(get_m_from_name(note.materials[0]))}}
      {{get_reagent_number(note.materials[0])}}
      +
      <ObjectImage :material="get_m_from_name(note.materials[1])"></ObjectImage>
      {{obj_j(get_m_from_name(note.materials[1]))}}
      {{get_reagent_number(note.materials[1])}}
      →
      <img :src="obj_img(note)" class="material">{{obj_j(note)}}
    </div>
    <p v-for="(m, key) in noteMsg" :key="key">{{m}}</p>
    <div>
      <button v-if="get_reagent_number(note.materials[0])" @click="jump_to_note(0)">
        ノート{{get_reagent_number(note.materials[0])}}を見る
      </button>
      <button v-if="get_reagent_number(note.materials[1])" @click="jump_to_note(1)">
        ノート{{get_reagent_number(note.materials[1])}}を見る
      </button>
    </div>
    <div>
      <button v-if="get_writable_paper(note).ntype=='paper'" @click="write_paper">このノートを基に論文を書く</button>
      <button v-if="get_writable_paper(note).ntype=='discussion'" @click="write_paper">このノートの考察を書く</button>
    </div>
  </div>
  <div class="row space" v-else>
    <div>考察 #{{note.number}}</div>
    <p>
      実験 #{{note.ref}}の結果より、
      <ObjectImage :material="get_m_from_name(note.name)"></ObjectImage>は
      <span v-if="note.candidate">
      <img v-for="atom in note.candidate[0]" :key="atom.id" :src="atom_img(atom)"> か
      <img v-for="atom in note.candidate[1]" :key="atom.id" :src="atom_img(atom)"> であると思われる。
      </span>
      <span v-if="note.contain">
        <img :src="atom_img(note.contain[0])"> か
        <img :src="atom_img(note.contain[1])"> を含むと思われる。
      </span>
    </p>
    <div>
      <button @click="jump_to_note_by_num(note.ref)">参照元のノートを見る</button>
    </div>
  </div>
</template>

<script>
import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, show_report, atom_str, get_writable_paper} from '../misc.js'
import ObjectImage from "./ObjectImage.vue"

export default {
  name: 'NoteView',
  props: ['notes', 'materials', 'showing'],
  emit: ['open_note','write_paper'],
  components: {ObjectImage},
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
      this.set_note()
    }
  },
  mounted() {
    this.set_note()
  },
  methods: {
    set_note() {
      if(this.note.theme==="exp"){
        this.noteMsg = show_report(this.note.ele)
        this.noteMsg.push(this.note.materials)
      }
    },
    jump_to_note(num){
      let n = (this.notes.find(n => n.number == get_reagent_number(this.notes, this.note.materials[num])))
      this.$emit("open_note",n)
      this.set_note()
    },
    jump_to_note_by_num(num){
      this.$emit("open_note",this.notes.find(n=>n.number === num))
      this.set_note()
    },
    get_writable_paper(note){
      return get_writable_paper(this.materials, this.notes, note)
    },
    write_paper(){
      this.$emit("write_paper",this.note)
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