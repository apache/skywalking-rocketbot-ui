<template>
  <div class="topology">
    <TopoChart :datas="stateTopo" @setCurrentApp="setCurrentApp"/>
    <div class="topology-select">
    </div>
    <div class="topology-board" v-show="Object.keys(current).length">
      <div class="mb15" v-for="(value,key) in current" :key="key"><span class="half">{{key}}:</span><span class="half">{{value}}</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import TopoChart from '../components/topology/topo.vue';

@Component({ components: { TopoChart } })
export default class Topology extends Vue {
  @State('topo') stateTopo;
  current = {};
  setCurrentApp(i) {
    this.current = i;
  }
}
</script>

<style lang="scss">
.topology{
  background-color: #333337;
}
.topology > svg {
  display: block;
}
.topology-board{
  position: absolute;
  top: 75px;
  right: 30px;
  padding: 15px 15px 0;
  width: 300px;
  border-radius: 4px;
  color: #e8e8e8;
  background-color: rgba(130, 140, 160, 0.1)
}
</style>
