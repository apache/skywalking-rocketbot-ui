<template>
<rk-panel title="Slow Traces">
  <div class="rk-slow-trace-item mb15" v-for="i in stateDashboard.slowTrace" :key="i.key">
    <div>
      <span class="r sm">{{i.duration}} ms</span>
      <!-- <span class="r sm grey mr15">{{parseInt(i.start) | dateformat}}</span> -->
      <div class="mb5">
        <Tooltip :content="`${moment(parseInt(i.start)).format('YYYY-MM-DD HH:mm:ss')}\n${i.operationNames[0]}`" placement="top" max-width="200" class="ell" style="max-width: 200px;">
          <span class="link-hover cp" @click="$router.push({ path:'/trace/link', query:{traces:i.traceIds.join('&')}})">{{i.operationNames[0]}}</span>
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
.rk-slow-trace-item{
  width: 50%;
  float: left;
  padding: 0 10px;
}
</style>
