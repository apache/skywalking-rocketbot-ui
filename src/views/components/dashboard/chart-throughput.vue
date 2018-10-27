<template>
  <rk-panel title="Throughput">
    <RkEcharts height="220px" :option="throughputConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Throughput extends Vue {
  @State('dashboard') stateDashboard;
  @State('global') stateGlobal;
  @Getter('durationTime') durationTime;
  get throughputConfig() {
    return {
      color: ['#75a8ff', '#F44336'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['server', 'service'],
        icon: 'circle',
        top: 0,
        left: 10,
        itemGap: 15,
        itemWidth: 15,
        itemHeight: 12,
      },
      grid: {
        top: 50,
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
          data: this.stateDashboard.serverThroughput.map((i, index) => [this.durationTime[index], i]),
          name: 'server',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
        {
          data: this.stateDashboard.throughput.map((i, index) => [this.durationTime[index], i]),
          name: 'service',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
      ],
    };
  }
}
</script>
