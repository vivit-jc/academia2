<template>
    <ObjectImage :material="item"></ObjectImage>
      {{obj_j(item)}}#{{get_reagent_number(item)}}
      (<img :src="obj_img(get_m_from_name(item.materials[0]))" class="material">+
      <img :src="obj_img(get_m_from_name(item.materials[1]))" class="material">)
</template>

<script>
import ObjectImage from "./ObjectImage.vue"
import {get_m_from_name, obj_img, obj_j, get_reagent_number} from '../misc.js'

export default {
  name: 'ReactionProduct',
  props: ['item', 'notes', 'materials'],
  components: {ObjectImage},
  data() {
    return {
    }
  },
  computed: {

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
    get_m_from_name(name){
      return get_m_from_name(this.materials,name)
    },
    get_reagent_number(item){
      return get_reagent_number(this.notes, item.materials)
    }
  }
}
</script>