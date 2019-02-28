<template>
  <rk-panel :title="title">
    <RkEcharts height="215px" :option="responseConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Response extends Vue {
  @Prop() private title!: string;
  @State('rocketDashboard') private stateDashboard!: any;
  @Getter('intervalTime') private intervalTime: any;
  get responseConfig() {
    return {
      color: [
        '#E3BE2B',
        '#3f96e3',
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
        axisLine: { lineStyle: { color: '#c1c5ca41' } },
        axisLabel: { color: '#9da5b2', fontSize: '11' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#c1c5ca41' } },
        axisLabel: { color: '#9da5b2', fontSize: '11' },
      },
      series: [
        {
          data: this.stateDashboard.instanceInfo.oldGCTime.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard.instanceInfo.oldGCTime.length ? 'oldGC' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 1.5,
          },
        },
        {
          data: this.stateDashboard.instanceInfo.youngGCTime.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard.instanceInfo.youngGCTime.length ? 'youngGC' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 1.5,
          },
        },
      ],
    };
  }
}
</script>
