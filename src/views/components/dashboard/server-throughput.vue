<template>
<rk-panel class="rk-server-throughput" title="Server Throughputs">
  <div class="mb15" v-for="i in fiveData" :key="i.key">
    <div>
      <span class="r sm">{{i.value}} calls/ m</span>
      <div class="mb5">
        <Tooltip :content="i" max-width="300" placement="top" class="ell" style="max-width: 300px;">
          <span class="cp link-hover" @click="appChange(i)">{{i.name}}</span>
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
  @State('options') stateOptions;
  changeApp = appChange;
  appChange(i) {
    const temp = { key: `${i.key}`, label: i.label };
    this.changeApp(temp);
  }
  get fiveData() {
    return [...this.stateOptions.serversThroughput];
  }
  get maxValue() {
    const temp:Number[] = this.fiveData.map(i => i.value);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
</style>
