<template>
  <rk-panel title="Trace Line">
    <RkEcharts height="120px" :option="slaConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Throughput extends Vue {
  @State('dashboard') stateDashboard;
  get sla() {
    return this.stateDashboard.sla.map(i => 10000 - i);
  }
  /* eslint-disable */
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
        top: 10,
        left: 15,
        right: 15,
        bottom: 5,
        containLabel: true,
      },
      xAxis: {
        position:'top',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,.1)' } },
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
          symbolSize: 8,
          data: [
            [10.0, 8.04],
            [8.0, 6.95],
            [13.0, 7.58],
            [9.0, 8.81],
            [11.0, 8.33],
            [14.0, 9.96],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68],
          ],
          type: 'scatter',
        },
      ],
    };
  }
}
</script>
