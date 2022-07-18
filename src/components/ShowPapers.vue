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
</template>

<script>
import ObjectImage from './ObjectImage.vue'
import {get_m_from_name, ele_j, obj_img, obj_j, get_reagent_number, atom_str} from '../misc.js'

export default {
  name: 'ShowPapers',
  props: ['notes', 'papers', 'materials'],
  emit: [],
  components: {ObjectImage},
  data() {
    return {
      onPaper: "",
      showing: null
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    open_paper(paper){
      console.log(JSON.stringify(paper))
      this.showing = paper
    },
    write_paper(note,type){
      this.$emit("write_paper",note,type)
    },
    is_submitted(p) {
      if(p.submitted){return "提出済"}
      else{return "未提出"}
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