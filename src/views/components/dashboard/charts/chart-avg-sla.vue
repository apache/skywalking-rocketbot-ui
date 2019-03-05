<template>
  <div class="rk-service-sla">
    <div class="grey">{{title}}</div>
    <div class="title b">
      <span>{{this.stateDashboard[this.type].getSLATrend.length ? content.toFixed(2) : 0}}</span>
      <span class="unit"> %</span>
    </div>
    <RkEcharts height="180px" :option="responseConfig"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component, Prop } from 'vue-property-decorator';
import Num from './chart-num.vue';

interface NumBoxData {
  value: number;
}
@Component({components: {Num}})
export default class Response extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @State('rocketDashboard') private stateDashboard!: any;
  @Getter('intervalTime') private intervalTime: any;
  get content() {
    const temp = this.stateDashboard[this.type].getSLATrend.map((i: NumBoxData) => i.value);
    const sum = temp.reduce((preValue: number, curValue: number, index: number, array: number[]) => preValue + curValue)
    / this.stateDashboard[this.type].getSLATrend.length;
    return sum / 100;
  }
  get avg() {
     return this.stateDashboard[this.type].getSLATrend ?
      [{
        data: this.stateDashboard[this.type].getSLATrend.map((i: any, index: number) => [
          this.intervalTime[index],
          i.value,
        ]),
        name: this.stateDashboard[this.type].getSLATrend.length ? 'Avg Response' : null,
        type: 'pictorialBar',
        barMaxWidth: 10,
        barCategoryGap: '-70%',
        symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
      }] : [];
  }
  get responseConfig() {
    return {
      color: [
        'rgba(63, 150, 227, 0.8)',
      ],
      grid: {
        top: 35,
        left: 0,
        right: 28,
        bottom: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgb(50,50,50)',
        textStyle: {
          fontSize: 13,
        },
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
        ...this.avg,
      ],
    };
  }
}
</script>
<style lang="scss">
.rk-service-sla{
  padding: 0 10px;
  height: 258px;
  .unit{
    font-size: 16px;
  }
  .title{
    font-size: 24px;
  }
}
</style>