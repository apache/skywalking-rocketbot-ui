<template>
  <div class="topology">
    <TopoChart :datas="stateTopo" refs="topo"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { getTopo } from '@/store/dispatch/topo.ts';
import TopoChart from '../components/topology/topo.vue';

@Component({ components: { TopoChart } })
export default class Topology extends Vue {
  @State('topo') stateTopo;
  getTopo = getTopo;
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
