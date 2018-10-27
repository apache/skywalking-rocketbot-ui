<template>
  <rk-panel title="SLA">
    <RkEcharts height="220px" :option="slaConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Sla extends Vue {
  @State('dashboard') stateDashboard;
  @Getter('durationTime') durationTime;
  get sla() {
    return this.stateDashboard.sla.map(i => (10000 - i) / 100);
  }
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
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisTick: {
          lineStyle: { color: 'rgba(0,0,0,.1)' },
          alignWithLabel: true,
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: 'rgba(0,0,0,.1)' } },
        axisLabel: { color: '#333', fontSize: '11' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,.1)' } },
        axisLabel: { color: '#333', fontSize: '11' },
      },
      series: [
        {
          data: this.sla.map((i, index) => [this.durationTime[index], 100 - i]),
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
