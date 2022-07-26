<template>
  <div class="row space">
    <h2>外出</h2>
    <div class="row">
      <div class="col-4" v-for="place in places" :key="place" :class="[{hover:onPlace===place.str},{}]" @mouseover="onPlace=place.str" @mouseout="onPlace=''">
        <img :src="place_img(place.str)">
        {{place.j}}
      </div>
    </div>
  </div>
 
</template>

<script>

import {} from '../misc.js'

export default {
  name: 'ChangePlace',
  props: ['materials'],
  emit: [],
  components: {},
  data() {
    return {
      onPlace: "",
      showing: null,
      places: [{str:"academy",j:"アカデミー"},{str:"library",j:"図書館"},{str:"store",j:"薬屋"},{str:"forest",j:"森"},{str:"mountain",j:"山"},{str:"lake",j:"湖"},{str:"cave",j:"洞窟"}]
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    place_img(p){
      return require("../assets/img/"+p+".png")
    },
  }
}
</script>