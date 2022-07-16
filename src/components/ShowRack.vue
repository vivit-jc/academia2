<template>
  <div class="row space">
    <h2>薬棚・使い魔</h2>
    <div>
      <button type="button" @click="filter('all')">すべて({{count('all')}})</button>
      <button type="button" @click="filter('reagent')">試薬({{count('reagent')}})</button>
      <button type="button" @click="filter('potion')">ポーション({{count('potion')}})</button>
      <button type="button" @click="filter('crystal')">結晶({{count('crystal')}})</button>
    </div>
    
    <div class="col-6" v-for="(i, key) in rackFiltered" :key="key" :class="[{hover:onItem===i},{}]" @mouseover="onItem=i" @mouseout="onItem=''" @click="openNote(notes.find(n=>n.number==i.number))">
      <ReactionProduct :materials="materials" :item="i" :notes="notes"></ReactionProduct>
    </div>
  </div>
  <NoteView v-if="showing" :showing="showing" :notes="notes" :materials="materials" @open_note="openNote"></NoteView>
</template>

<script>
import ReactionProduct from './ReactionProduct.vue'
import NoteView from './NoteView.vue'

export default {
  name: 'ShowRack',
  props: ['rack', 'notes', 'materials'],
  components: {ReactionProduct, NoteView},
  data() {
    return {
      onItem: "",
      rackFiltered: this.rack,
      showing: null
    }
  },
  computed: {

  },
  mounted() {
  },
  methods: {
    openNote(note){
      this.showing = note
    },
    count(t){
      if(t === "all") return this.rack.length
      else return this.rack.filter(e=>e.otype===t).length
    },
    filter(t){
      if(t === "all") this.rackFiltered = this.rack
      else this.rackFiltered = this.rack.filter(e=>e.otype===t)
    },
  }
}
</script>