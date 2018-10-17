<template>
  <div class="topology">
    <TopoChart :datas="stateTopo"/>
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
}
</script>

<style lang="scss">
.topology{
  background-color: #303640;
}
.topology > svg {
  display: block;
}
</style>
