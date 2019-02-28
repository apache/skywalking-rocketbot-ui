<template>
<rk-panel class="rk-service-slow" title="Service Slow Endpoint">
  <div class="mb-15" v-for="i in fiveData" :key="i.key">
    <div class="mb-5">
      <span class="calls sm mr-10">{{i.value}} cpm</span>
      <span class="cp link-hover" @click="appChange(i)">{{i.label}}</span>
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
export default class RkTopThroughput extends Vue {
  @State('rocketDashboard') public stateDashboard!: any;
  private appChange(i: any) {
    const temp = { key: `${i.key}`, label: i.label };
    // this.changeApp(temp);
  }
  get fiveData() {
    return this.stateDashboard.serviceInfo.getSlowEndpoint.length < 6
    ?
    this.stateDashboard.serviceInfo.getSlowEndpoint
    :
    this.stateDashboard.serviceInfo.getSlowEndpoint.splice(0, 4);
  }
  get maxValue() {
    const temp: number[] = this.fiveData.map((i: any) => i.value);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
.rk-service-slow{
  .calls{
    padding: 0 5px;
    display: inline-block;
    background-color: #40454e;
    color: #eee;
    border-radius: 4px;
  }
}
</style>
