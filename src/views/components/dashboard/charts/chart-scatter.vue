<template>
  <rk-panel :title="title">
    <RkEcharts height="215px" :option="responseConfig"/>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import moment from 'dayjs';
@Component
export default class Response extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
  @Prop() private intervalTime!: any;
  get responseConfig() {
    const w: any = window;
    return {
      color: [
        '#3f96e3',
        '#6be6c1',
      ],
      tooltip: {
        position: 'top',
        formatter: (a: any) => `${a.data[1] * 100}ms  [ ${a.data[2]} ]`,
        backgroundColor: 'rgb(50,50,50)',
        textStyle: {
          fontSize: 13,
        },
      },
      grid: {
        top: 20,
        left: 0,
        right: 18,
        bottom: 15,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.intervalTime,
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
        axisLabel: { color: '#9da5b2', fontSize: '11', formatter: (a: number) => `${a * 100}ms`},
      },
      series: [
        {
          type: 'scatter',
          data: this.stateDashboard[this.type].getThermodynamic,
          symbolSize: (d: any) => d[2] ? 7 : 0,
        },
      ],
    };
  }
}
</script>
