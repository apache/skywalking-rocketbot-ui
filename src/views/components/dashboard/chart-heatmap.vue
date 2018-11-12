<template>
  <rk-panel title="Calls HeatMap">
    <RkEcharts height="220px" :option="responseConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Response extends Vue {
  @State('dashboard') stateDashboard;
  @Getter('durationTime') durationTime;
  get responseConfig() {
    return {
      color: ['#75a8ff', '#F44336'],
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: 13,
        },
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
          data: this.stateDashboard.responseTime.map((i, index) => [this.durationTime[index], i]),
          name: 'server',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
        {
          data: this.stateDashboard.serverResponseTime.map((i, index) => [this.durationTime[index], i]),
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
