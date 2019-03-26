/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div class="rk-service-response">
    <div class="grey">{{title}}</div>
    <div class="title b">
      <span>{{this.stateDashboard[this.type].getResponseTimeTrend.length ? content.toFixed(2) : 0}}</span>
      <span class="unit"> ms</span>
    </div>
    <RkEcharts height="180px" :option="responseConfig"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Num from './chart-num.vue';

interface NumBoxData {
  value: number;
}
@Component({components: {Num}})
export default class Response extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
  @Prop() private intervalTime!: any;
  get content() {
    const temp = this.stateDashboard[this.type].getResponseTimeTrend
    .map((i: NumBoxData) => i.value).filter((i: any) => i);
    const sum = temp.length ? temp
    .reduce((preValue: number, curValue: number, index: number, array: number[]) => preValue + curValue)
    / this.stateDashboard[this.type].getResponseTimeTrend.length : 0;
    return sum;
  }
  get avg() {
     return this.stateDashboard[this.type].getResponseTimeTrend ?
      [{
        data: this.stateDashboard[this.type].getResponseTimeTrend.map((i: any, index: number) => [
          this.intervalTime[index],
          i.value,
        ]),
        name: this.stateDashboard[this.type].getResponseTimeTrend.length ? 'Avg Response' : null,
        type: 'line',
        symbol: 'none',
        lineStyle: {
          width: 1.5,
        },
      }] : [];
  }
  get responseConfig() {
    return {
      color: [
        '#3f96e3',
        '#6be6c1',
        '#626c91',
        '#a0a7e6',
        '#96dee8',
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
        type: 'category',
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
        splitLine: { lineStyle: { color: '#c1c5ca41', type: 'dashed'} },
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
.rk-service-response{
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