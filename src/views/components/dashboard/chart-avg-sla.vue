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
        barMaxWidth: 10,
        name: this.stateDashboard[this.type].getSLATrend.length ? 'Avg Response' : null,
        type: 'bar',
        itemStyle: {
          normal: {
              barBorderRadius: 2,
          },
        },
      }] : [];
  }
  get responseConfig() {
    return {
      color: [
        '#3f96e3',
      ],
      grid: {
        top: 30,
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