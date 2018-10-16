<template>
<rk-panel title="Slow Service">
  <div class="mb15" v-for="i in fiveData" :key="i.key">
    <div>
      <span class="r sm">{{i.value}} ms</span>
      <div class="ell mb5" style="max-width: 160px;">{{i.service.label}}</div>
    </div>
    <RkProgress :precent="i.value/maxValue*100"/>
  </div>
</rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class RkChartBox extends Vue {
  @State('dashboard') stateDashboard;
  get fiveData() {
    return this.stateDashboard.slowService.splice(0, 5);
  }
  get maxValue() {
    const temp:Number[] = this.fiveData.map(i => i.value);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
</style>
