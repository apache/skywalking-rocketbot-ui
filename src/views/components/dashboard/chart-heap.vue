<template>
  <rk-panel title="Heap MB">
    <RkEcharts height="220px" :option="throughputConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Heap extends Vue {
  @State('dashboard') stateDashboard;
  @State('global') stateGlobal;
  @Getter('durationTime') durationTime;
  get throughputConfig() {
    return {
      color: ['#75a8ff', '#f7b32b'],
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: 13,
        },
      },
      legend: {
        data: ['free', 'value'],
        icon: 'circle',
        top: 10,
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
          data: this.stateDashboard.memory.heap.map((i, index) => [this.durationTime[index], i]),
          name: 'free',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
        {
          data: this.stateDashboard.memory.maxHeap.map((i, index) => [this.durationTime[index], i]),
          name: 'value',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
      ],
    };
  }
}
</script>
