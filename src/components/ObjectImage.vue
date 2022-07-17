<template>
  <img :src="obj_img(material)" class="material">
  <span v-if="mat_know">
    <img :src="atom_img(material.ele[0])" class="atom">
    <img :src="atom_img(material.ele[1])" class="atom">
  </span>
  <span v-else>?</span>
</template>

<script>
import {get_m_from_name, obj_img, obj_j, get_reagent_number, atom_str} from '../misc.js'

export default {
  name: 'ObjectImage',
  props: ['material'],
  data() {
    return {
    }
  },
  computed: {
    mat_know(){
      if(this.material.known){return true}
      else if(this.material.otype === "reagent"){return true}
      else{return false}
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