<template>
  <div class="row space">
    <div class="col-3">
      <img src="../assets/img/cauldron.png"><br>
      <button type="button" class="rounded-pill btn-sm" v-show="cauldron.length==2" @click="make_potion">調合</button>
      <p class="warn" v-show="search_notes">この組み合わせで調合したことがあります</p>
    </div>
    <div class="col-3">
      <ul class="list-group">
        <li class="list-group-item cauldron" v-for="(m, key) in cauldron" :key="key">
          <img :src="mat_img(m)" class="material">
          {{ele_j(m.ele)}}
          <button type="button" class="btn-close" aria-label="Close" @click="cancelMaterial(m)"></button>
        </li>
      </ul>
    </div>
  </div>
  <div class="row space">
    <div class="col-6" v-for="(m, key) in materials" :key="key" v-show="m.num>0" :class="[{hover:onMaterial===m.name},{}]" @mouseover="onMaterial=m.name" @mouseout="onMaterial=''">
      <img :src=mat_img(m) class="material">
      {{m.name}}({{ele_j(m.ele)}}) x{{m.num}}
      <button type="button" class="rounded-pill btn-sm" :class="{'btn-secondary':!settable(m)}" @click="clickMaterialCommand(m)">入れる</button>
      <button type="button" class="rounded-pill btn-sm">ノート</button>
    </div>
  </div>
</template>

<script>
import {mat_img, ele_j, search_notes} from '../misc.js'

export default {
  name: 'MakePotion',
  props: ['notes','materials'],
  data() {
    return {
      onMaterial: "",
      cauldron: []
    }
  },
  computed: {
    search_notes(){
      return search_notes(this.notes, this.cauldron)
    }
  },
  mounted() {

  },
  methods: {
    clickMaterialCommand(m) {
      if(!this.settable(m)){return false}
      this.cauldron.push(m)
    },
    cancelMaterial(m){
      this.cauldron = this.cauldron.filter(e => e!=m)
    },
    make_potion(){
      this.$emit("make_potion",this.cauldron)
      this.cauldron = []
    },
    mat_img(m){
      return mat_img(m)
    },
    ele_j(m){
      return ele_j(m)
    },
    settable(m) {
      if(this.cauldron.length === 1 && this.cauldron === m){return false}
      if(this.cauldron.length === 2){return false}
      return true
    },
  }
}
</script>