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
    <div><button @click="start_new_paper">新しく論文を書く</button></div>
    <div class="row" v-if="new_paper">
      <div class="col-4">
        <select class="form-select" aria-label="Default select example" v-model="themeMaterial">
          <option selected>素材を選択してください</option>
          <option v-for="m in theme_materials()" :key="m.name" :value="m.name">{{m.name}}</option>
        </select>
      </div>
      <div class="col-4">
        <select class="form-select" aria-label="Default select example" v-model="expectAtom">
          <option selected>元素を選択してください</option>
          <option v-for="a in get_atom_sets()" :key="a.s" :value="a.s">{{a.j}}</option>
        </select>
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
      themeMaterial: "素材を選択してください",
      expectAtom: "元素を選択してください"

    }
  },
  computed: {

  },
  watch: {
    themeMaterial(){
      console.log(this.themeMaterial, this.expectAtom)

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
    },
    is_submitted(p) {
      if(p.submitted){return "提出済"}
      else{return "未提出"}
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