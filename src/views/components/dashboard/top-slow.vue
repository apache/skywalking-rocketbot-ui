<template>
<rk-panel title="Slow Trace">
  <div class="mb15" v-for="i in stateDashboard.slowTrace" :key="i.key">
    <div>
      <span class="r sm">{{i.duration}} ms</span>
      <div class="blue cp mb5" @click="$router.push({ path:'/trace/link', query:{traces:i.traceIds.join('&')}})">
        <Tooltip :content="i.operationNames[0]" placement="top" class="ell" style="max-width: 160px;">
          <span>{{i.operationNames[0]}}</span>
        </Tooltip>
      </div>
    </div>
    <RkProgress :precent="i.duration/maxDuration*100"/>
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
  get maxDuration() {
    const temp:Number[] = [...this.stateDashboard.slowTrace].map(i => i.duration);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
</style>
