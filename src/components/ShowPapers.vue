<template>
  <div class="row space">
    <h2>論文</h2>
    <div class="col-6 papers" v-for="(p, key) in papers" :key="key" :class="[{hover:onItem===p},{}]" @mouseover="onItem=p" @mouseout="onItem=''" @click="open_paper(p)">
      論文 #{{p.number}}：
      <ObjectImage :material="get_m_from_name(p.name)" :cut="true"></ObjectImage>=
      <ObjectImage :material="get_m_from_name(p.name)" :atom="true"></ObjectImage>
      <span class="submitted badge bg-success">{{is_submitted(p)}}</span>
    </div>
  </div>
  <div class="row space" v-if="showing">
   <div>論文 #{{showing.number}}</div>
  </div>
  <div class="row space">
    <div>
      <button @click="start_new_paper" v-if="!new_paper">新しく論文を書く</button>
      <button @click="cancel_new_paper" v-if="new_paper">やめる</button>
    </div>
    <div class="row" v-if="new_paper">
      <div class="col-6">
        どの素材について書きますか？
        <select class="form-select" aria-label="Default select example" v-model="themeMaterial">
          <option>素材を選択してください</option>
          <option v-for="m in theme_materials()" :key="m.name" :value="m.name">{{m.name}}</option>
        </select>
      </div>
      <div class="col-6" v-if="paper_status==='ok'">
        <button @click="write_paper">論文を書く</button>
      </div>
      <div class="col-6" v-else>
        {{paper_status}}
      </div>
    </div>
    <div class="row" v-if="new_paper">
      <div>どの元素だと考えられますか？</div>
      <div class="col-2" v-for="a in get_atom_sets()" :key="a.j" @click="click_atom(a)" @mouseover="onItem=a.j" @mouseout="onItem=''" :class="[{hover:onItem===a.j},{selected:expectAtom===a.j}]">
        <img :src="atom_img(a.e[0])" class="atom">
        <img :src="atom_img(a.e[1])" class="atom">
      </div>
    </div>
    <div class="row" v-if="new_paper">
      <div>根拠となる考察</div>
      <div class="col-6" v-for="n in search_theme_notes" :key="n" @click="click_discussion(n)" @mouseover="onItem=n.number" @mouseout="onItem=''" :class="{hover:onItem===n.number}">
        <NoteSummary :materials="materials" :note="n"></NoteSummary>
      </div>
    </div>
  </div>
  <NoteView v-if="showingNote" :notes="notes" :showing="showingNote" :materials="materials" @open_note="open_note"></NoteView>
</template>

<script>
import ObjectImage from './ObjectImage.vue'
import NoteSummary from './NoteSummary.vue'
import NoteView from './NoteView.vue'

import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, atom_str, get_atom_sets} from '../misc.js'

export default {
  name: 'ShowPapers',
  props: ['notes', 'papers', 'materials'],
  emit: ['write_paper'],
  components: {ObjectImage, NoteSummary, NoteView},
  data() {
    return {
      showingNote: "",
      new_paper: false,
      onItem: '',
      themeMaterial: "",
      expectAtom: ""

    }
  },
  computed: {
    search_theme_notes(){
      return this.notes.filter(n=>n.ntype==="discussion" && n.name === this.themeMaterial)
    },
    enough_basis(){
      return this.search_theme_notes.length >= 2
    },
    paper_status(){
      if(this.themeMaterial === "素材を選択してください"){
        return ""
      } else if(this.enough_basis && this.expectAtom){
        return "ok"
      } else if(this.enough_basis){
        return "元素を選択してください"
      } else if(!this.enough_basis){
        return "根拠となる考察が足りません"
      } else {
        return "error"
      }
    }
  },
  watch: {
    
  },
  mounted() {

  },
  methods: {
    open_paper(paper){
      this.showing = paper
    },
    write_paper(){
      let note = {"theme":"atom","name":this.themeMaterial,"ntype":"paper"}
      this.$emit("write_paper",note,"atom_direct")
      this.new_paper = false
      this.themeMaterial = ""
      this.expectAtom = ""
    },
    start_new_paper(){
      this.new_paper = true
      this.themeMaterial = "素材を選択してください"
    },
    cancel_new_paper(){
      this.new_paper = false
      this.themeMaterial = ""
      this.expectAtom = ""
    },
    is_submitted(p) {
      if(p.submitted){return "提出済"}
      else{return "未提出"}
    },
    click_atom(atom){
      this.expectAtom = atom.j
    },
    click_discussion(n){
      this.showingNote = n
    },
    theme_materials(){
      return this.materials.filter(m=>!m.known)
    },
    open_note(note){
      this.showingNote = note
    },
    get_atom_sets(){
      return get_atom_sets()
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