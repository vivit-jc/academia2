<template>
  <div class="row space">
    <h2>論文</h2>
    <div class="col-6 papers" v-for="(p, key) in papers" :key="key" :class="[{hover:onPaper===p},{}]" @mouseover="onPaper=p" @mouseout="onPaper=''" @click="open_paper(p)">
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
          <option v-for="m in theme_materials()" :key="m.name" :value="m.name">{{m.name}}</option>
        </select>
      </div>
    </div>
    <div class="row" v-if="new_paper">
      <div>どの元素だと考えられますか？</div>
      <div class="col-2" v-for="a in get_atom_sets()" :key="a.j" @click="click_atom(a)" @mouseover="onMaterial=a.j" @mouseout="onMaterial=''" :class="[{hover:onMaterial===a.j},{selected:expectAtom===a.j}]">
        <img :src="atom_img(a.e[0])" class="atom">
        <img :src="atom_img(a.e[1])" class="atom">
      </div>
    </div>
    <div class="row" v-if="new_paper">
      <div>根拠となる考察</div>
      <div class="col-6" v-for="n in search_theme_notes" :key="n">
      <span v-if="n.candidate2">
        考察 #{{n.number}}：
        <ObjectImage :material="get_m_from_name(n.name)"></ObjectImage>=
        <img v-for="atom in n.candidate2[0]" :key="atom.id" :src="atom_img(atom)" class="atom"> or 
        <img v-for="atom in n.candidate2[1]" :key="atom.id" :src="atom_img(atom)" class="atom">
      </span>
      <span v-else-if="n.candidate4">
        考察 #{{n.number}}：
        <ObjectImage :material="get_m_from_name(n.name)"></ObjectImage>=
        (<img :src="atom_img(n.candidate4[0])" class="atom"> or 
        <img :src="atom_img(n.candidate4[1])" class="atom">) - 
        (<img :src="atom_img(n.candidate4[2])" class="atom"> or 
        <img :src="atom_img(n.candidate4[3])" class="atom">) 
      </span>
      </div>
    </div>
  </div>
</template>

<script>
import ObjectImage from './ObjectImage.vue'
import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, atom_str, get_atom_sets} from '../misc.js'

export default {
  name: 'ShowPapers',
  props: ['notes', 'papers', 'materials'],
  emit: [],
  components: {ObjectImage},
  data() {
    return {
      onPaper: "",
      showing: null,
      new_paper: false,
      onMaterial: '',
      themeMaterial: "",
      expectAtom: ""

    }
  },
  computed: {
    search_theme_notes(){
      return this.notes.filter(n=>n.ntype==="discussion")
    }
  },
  watch: {
    themeMaterial(){
    },
    onMaterial(){
    }
  },
  mounted() {

  },
  methods: {
    open_paper(paper){
      this.showing = paper
    },
    write_paper(note,type){
      this.$emit("write_paper",note,type)
    },
    start_new_paper(){
      this.new_paper = true
      this.themeMaterial = "素材を選択してください"
    },
    cancel_new_paper(){

    },
    is_submitted(p) {
      if(p.submitted){return "提出済"}
      else{return "未提出"}
    },
    click_atom(atom){
      this.expectAtom = atom.j
    },
    theme_materials(){
      return this.materials.filter(m=>!m.known)
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