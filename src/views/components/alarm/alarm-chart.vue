<template>
<div class="rk-alarm-search-box container">
  <RkEcharts height="60px" :option="slaConfig"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Sla extends Vue {
  @State('dashboard') stateDashboard;
  @Getter('durationTime') durationTime;
  get slaConfig() {
    return {
      color: ['#75a8ff'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        icon: 'circle',
        top: 10,
        left: 10,
      },
      grid: {
        top: 15,
        left: 0,
        right: 18,
        bottom: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } },
        axisLabel: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      series: [
        {
          data: [1, 2, 3, 4, 1, 1, 2,1, 2, 3, 4, 1, 1, 2,1, 2, 3, 4, 1, 1, 2,1, 2, 3, 4, 1, 1, 2,1, 2, 3, 4, 1, 1, 2].map((i, index) => [this.durationTime[index], 100 - i]),
          type: 'bar',
          itemStyle: {
            normal: {
              barBorderRadius: [3, 3, 3, 3],
            },
          },
        },
      ],
    };
  }
}
</script>
<style lang="scss">
.rk-alarm-search-box{
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #333840;
}
</style>

