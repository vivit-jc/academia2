<template>
  <div class="row space">
    <h2>素材</h2>
    <div>
      <button type="button" @click="click_place('all')">全て</button>
      <button type="button" @click="click_place('f')">森</button>
      <button type="button" @click="click_place('m')">山</button>
      <button type="button" @click="click_place('l')">湖</button>
      <button type="button" @click="click_place('c')">洞窟</button>
      <button type="button" @click="click_place('o')">その他</button>
    </div>
    <div class="row">
      <div class="col-3 relative" v-for="(m, key) in filtered" :key="key" v-show="m.num>0" :class="[{hover:onMaterial===m.name},{}]" @mouseover="onMaterial=m.name" @mouseout="onMaterial=''" @click="click_material(m)">
        <ObjectImage :material="m"></ObjectImage>
        {{m.name}} x{{m.num}}
      </div>
    </div>
  </div>
  <div class="row space" v-if="showing">
    <div>
      <ObjectImage :material="showing"></ObjectImage>
      {{showing.name}}
    </div>
    <div>
    所持数: {{showing.num}}
    これまで集めた数: {{showing.num_past}}
    </div>
    <div>
      採集地: {{place_j(showing.place)}}
    </div>
    <div>
      <button type="button">ノートを検索</button>
      <button type="button">論文を検索</button>
    </div>
  </div>
</template>


<script>
import ObjectImage from "./ObjectImage.vue"
import {get_m_from_name, ele_j, obj_img, obj_j, place_j, atom_str} from '../misc.js'

export default {
  name: 'ShowMaterials',
  props: ['materials'],
  emit: ['write_paper'],
  components: {ObjectImage},
  data() {
    return {
      onMaterial: "",
      showing: null,
      filtered: this.materials
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    click_place(place){
      if(place === 'all'){
        this.filtered = this.materials
      } else {
        this.filtered = this.materials.filter(m=>m.place===place)
      }
    },
    click_material(mat){
      this.showing = mat
    },
    place_j(place){
      return place_j(place)
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
    atom_img(m){
      let t = atom_str(m)
      return require("../assets/img/"+t+".png")
    },
  }
}



</script>