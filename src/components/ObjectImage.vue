<template>
  <img :src="obj_img(material)" class="material">
  <span v-if="mat_know">
    <img :src="atom_img(material.ele[0])" class="atom">
    <img :src="atom_img(material.ele[1])" class="atom">
  </span>
  <span v-else>?</span>
</template>

<script>
import {get_m_from_name, obj_img, obj_j, get_reagent_number} from '../misc.js'

export default {
  name: 'ObjectImage',
  props: ['material'],
  data() {
    return {
    }
  },
  computed: {
    mat_know(){
      console.log(JSON.stringify(this.material))
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
      let t
      if(m === "f"){t = "fire"}
      else if(m === "t"){t = "water"}
      else if(m === "e"){t = "earth"}
      else if(m === "w"){t = "wind"}
      else if(m === "s"){t = "shine"}
      else if(m === "d"){t = "dark"}
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