<template>
  <rk-panel title="Endpoint Response Time">
    <RkEcharts height="200px" :option="responseConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Response extends Vue {
  @State('dashboard')
  stateDashboard;
  @Getter('durationTime')
  durationTime;
  get responseConfig() {
    return {
      color: [
        '#75a8ff',
        '#9a7fd1',
        '#ff6464',
        '#97b552',
        '#588dd5',
        '#f5994e',
        '#c05050',
        '#59678c',
        '#c9ab00',
        '#7eb00a',
        '#6f5553',
        '#c14089',
      ],
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontSize: 13,
        },
      },
      legend: {
        icon: 'circle',
        top: 0,
        left: 0,
        itemGap: 11,
        itemWidth: 12,
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
          data: this.stateDashboard.responseTime.map((i, index) => [this.durationTime[index], i]),
          name: 'avg',
          type: 'line',
          symbol: 'none',
          // lineStyle: {
          //   type: 'dotted',
          // },
        },
        {
          data: this.stateDashboard.endpointP.p50.map((i, index) => [
            this.durationTime[index],
            i,
          ]),
          name: this.stateDashboard.endpointP.p50.length ? 'p50' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            type: 'dotted',
          },
        },
        {
          data: this.stateDashboard.endpointP.p75.map((i, index) => [
            this.durationTime[index],
            i,
          ]),
          name: this.stateDashboard.endpointP.p75.length ? 'p75' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            type: 'dotted',
          },
        },
        {
          data: this.stateDashboard.endpointP.p90.map((i, index) => [
            this.durationTime[index],
            i,
          ]),
          name: this.stateDashboard.endpointP.p90.length ? 'p90' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            type: 'dotted',
          },
        },
        {
          data: this.stateDashboard.endpointP.p95.map((i, index) => [
            this.durationTime[index],
            i,
          ]),
          name: this.stateDashboard.endpointP.p95.length ? 'p95' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            type: 'dotted',
          },
        },
        {
          data: this.stateDashboard.endpointP.p99.map((i, index) => [
            this.durationTime[index],
            i,
          ]),
          name: this.stateDashboard.endpointP.p99.length ? 'p99' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            type: 'dotted',
          },
        },
      ],
    };
  }
}
</script>
