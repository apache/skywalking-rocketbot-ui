<template>
<rk-panel class="rk-traces-slow clear" title="Top 20 Slow Traces">
  <div class="mb-15 g-sm-6" v-for="i in fiveData" :key="i.key">
    <div class="mb-5">
      <span class="calls sm mr-10">{{i.duration}} ms</span>
      <span class="cp link-hover" @click="appChange(i)">{{i.endpointNames[0]}}</span>
    </div>
    <RkProgress :precent="i.duration/maxValue*100"/>
  </div>
</rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class RkTopThroughput extends Vue {
  @State('rocketDashboard') public stateDashboard!: any;
  private appChange(i: any) {
    const temp = { key: `${i.key}`, label: i.label };
    // this.changeApp(temp);
  }
  get fiveData() {
    return this.stateDashboard.endpointInfo.queryBasicTraces.length < 11
    ?
    this.stateDashboard.endpointInfo.queryBasicTraces
    :
    this.stateDashboard.endpointInfo.queryBasicTraces.splice(0, 10);
  }
  get maxValue() {
    const temp: number[] = this.fiveData.map((i: any) => i.duration);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
.rk-traces-slow{
  .calls{
    padding: 0 5px;
    display: inline-block;
    background-color: #40454e;
    color: #eee;
    border-radius: 4px;
  }
}
</style>
