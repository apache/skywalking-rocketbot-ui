<template>
<rk-panel class="rk-application-throughput" title="Global Service Throughputs">
  <div class="mb15" v-for="i in fiveData" :key="i.key">
    <div>
      <span style="width:60px" class="r sm">{{i.value}} calls/ m</span>
      <div style="width:calc(100% - 65px)" class="mb5">
        <Tooltip :content="i.label" max-width="200" placement="top" class="ell" style="max-width: 100%;">
          <span class="cp link-hover" @click="appChange(i)">{{i.label}}</span>
        </Tooltip>
      </div>
    </div>
    <RkProgress :precent="i.value/maxValue*100" color="#bf99f8"/>
  </div>
</rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import { appChange } from '@/store/dispatch/dashboard.ts';

@Component({})
export default class RkChartBox extends Vue {
  @State('dashboard') stateDashboard;
  changeApp = appChange;
  appChange(i) {
    const temp = { key: `${i.key}`, label: i.label };
    this.changeApp(temp);
  }
  get fiveData() {
    return [...this.stateDashboard.applicationThroughput].splice(0, 4);
  }
  get maxValue() {
    const temp:Number[] = this.fiveData.map(i => i.value);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
</style>
