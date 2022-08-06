<template>
  <img :src="obj_img(material)" v-if="!atom" class="material">
  <span v-if="mat_know && !cut && material.ele.length==1">
    <img :src="atom_img(material.ele[0])" class="crystal">
  </span>
  <span v-else-if="mat_know && !cut && material.ele.length>1">
    <img :src="atom_img(material.ele[2])" class="crystal" v-if="material.otype === 'potion'">
    <img :src="atom_img(material.ele[0])" class="atom">
    <img :src="atom_img(material.ele[1])" class="atom">
  </span>
  <span v-else-if="!cut">?</span>
</template>

<script>
import {get_m_from_name, obj_img, obj_j, get_reagent_number, atom_str} from '../misc.js'

export default {
  name: 'ObjectImage',
  props: ['material', 'cut', 'atom'], // cut: 素材のみ表示, atom: 元素記号のみ表示
  data() {
    return {
    }
  },
  computed: {
    mat_know(){
      console.log("mat_know",JSON.stringify(this.material),this.material.known)
      if(this.material.known){return true}
      else{return false}
    },
    object_type(){
      let length = this.material.length
      if(length == 1){return "crystal"}
      else if(length == 2){return "reagent"}
      else if(length == 3){return "potion"}
      return false
    }
  },
  mounted(){
    
  },
  methods: {
    obj_img(item){
      return obj_img(item)
    },
    obj_j(item){
      return obj_j(item)
    },
    atom_img(m){
      let t = atom_str(m)
      if(!t){return false}
      return require("../assets/img/"+t+".png")
    },
    get_m_from_name(name){
      return get_m_from_name(this.materials,name)
    },
    get_reagent_number(item){
      return get_reagent_number(this.notes, item.materials)
    }
  }
}
</script>