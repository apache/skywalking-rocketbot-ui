<template>
  <rk-panel :title="title">
    <RkEcharts height="215px" :option="responseConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Response extends Vue {
  @Prop() private title!: string;
  @Prop() private stateDashboard!: any;
  @Prop() private intervalTime!: any;
  get responseConfig() {
    return {
      color: [
        '#a3a0e6',
        '#a0b1e6',
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgb(50,50,50)',
        textStyle: {
          fontSize: 13,
        },
      },
      legend: {
        icon: 'circle',
        top: 0,
        left: 0,
        itemWidth: 12,
      },
      grid: {
        top: 55,
        left: 0,
        right: 18,
        bottom: 15,
        containLabel: true,
      },
       xAxis: {
        type: 'time',
        axisTick: {
          lineStyle: { color: '#c1c5ca41' },
          alignWithLabel: true,
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: 'rgba(0,0,0,0)' } },
        axisLabel: { color: '#9da5b2', fontSize: '11' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#c1c5ca41', type: 'dashed' } },
        axisLabel: { color: '#9da5b2', fontSize: '11' },
      },
      series: [
        {
          data: this.stateDashboard.instanceInfo.noheap.map((i: any, index: number) => [
            this.intervalTime[index],
            (i.value / 1048576).toFixed(2),
          ]),
          name: this.stateDashboard.instanceInfo.noheap.length ? 'Value' : null,
          type: 'line',
          symbol: 'none',
          areaStyle: {},
          lineStyle: {
            width: 1.5,
          },
        },
        {
          data: this.stateDashboard.instanceInfo.maxNoheap.map((i: any, index: number) => [
            this.intervalTime[index],
            ((i.value - this.stateDashboard.instanceInfo.maxNoheap[index].value) / 1048576).toFixed(2),
          ]),
          name: this.stateDashboard.instanceInfo.noheap.length ? 'Free' : null,
          type: 'line',
          symbol: 'none',
          areaStyle: {},
          lineStyle: {
            width: 1.5,
          },
        },
      ],
    };
  }
}
</script>
