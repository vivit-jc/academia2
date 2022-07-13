<template>
  <div class="col-3">
    <img src="../assets/img/cauldron.png"><br>
    <button type="button" class="rounded-pill btn-sm" v-show="cauldron.length==2" @click="$emit('make_potion')">調合</button>
    <p class="warn" v-show="$emit('search_notes')">この組み合わせで調合したことがあります</p>
  </div>
  <div class="col-3">
    <ul class="list-group">
      <li class="list-group-item cauldron" v-for="(m, key) in cauldron" :key="key">
        <img :src="$emit('mat_img(m)')" class="material">
        {{$emit('ele_j(m.ele)')}}
        <button type="button" class="btn-close" aria-label="Close" @click="deleteCauldron(m)"></button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MakePotion',
  props: {
    'cauldron' : {}
  },
  methods: {
    deleteCauldron(m) {
      console.log("del")
      this.$emit("deleteCauldron",m)
    }
  }
}
</script>