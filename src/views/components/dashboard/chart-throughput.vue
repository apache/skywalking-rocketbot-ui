<template>
  <rk-panel title="Throughput">
    <RkEcharts height="200px" :option="throughputConfig"/>
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
      color: ['#75a8ff', '#ff6464'],
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: 13,
        },
      },
      legend: {
        icon: 'circle',
        top: 0,
        left: 10,
        itemGap: 15,
        itemWidth: 15,
        itemHeight: 12,
      },
      grid: {
        top: 40,
        left: 0,
        right: 18,
        bottom: 20,
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
          name: 'avg service',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
        {
          data: this.stateDashboard.throughput.map((i, index) => [this.durationTime[index], i]),
          name: 'avg endpoint',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
      ],
    };
  }
}
</script>
