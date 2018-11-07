<template>
<rk-panel title="Slow Trace">
  <div class="mb15" v-for="i in stateDashboard.slowTrace" :key="i.key">
    <div>
      <span class="r sm">{{i.duration}} ms</span>
      <div class="blue cp mb5" @click="$router.push({ path:'/trace/link', query:{traces:i.traceIds.join('&')}})">
        <Tooltip :content="`${moment(parseInt(i.start)).format('YYYY-MM-DD HH:mm:ss')}\n${i.operationNames[0]}`" placement="top" max-width="200" class="ell" style="max-width: 200px;">
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
import moment from 'dayjs';
import { Component } from 'vue-property-decorator';

@Component({})
export default class RkChartBox extends Vue {
  @State('dashboard') stateDashboard;
  moment = moment;
  get maxDuration() {
    const temp:Number[] = [...this.stateDashboard.slowTrace].map(i => i.duration);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
</style>
