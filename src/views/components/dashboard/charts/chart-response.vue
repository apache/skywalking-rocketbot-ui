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
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
  @Prop() private intervalTime!: any;
  get p50() {
     return this.stateDashboard[this.type].p50 ?
      [{
          data: this.stateDashboard[this.type].p50.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard[this.type].p50.length ? 'p50' : null,
          type: 'bar',
          symbol: 'none',
          barMaxWidth: 10,
          stack: '总量',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get p75() {
     return this.stateDashboard[this.type].p75 ?
      [{
          data: this.stateDashboard[this.type].p75.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard[this.type].p75.length ? 'p75' : null,
          type: 'bar',
          symbol: 'none',
          barMaxWidth: 10,
          stack: '总量',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get p90() {
     return this.stateDashboard[this.type].p90 ?
      [{
          data: this.stateDashboard[this.type].p90.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard[this.type].p90.length ? 'p90' : null,
          type: 'bar',
          symbol: 'none',
          barMaxWidth: 10,
          stack: '总量',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get p95() {
    return this.stateDashboard[this.type].p95 ?
    [{
        data: this.stateDashboard[this.type].p95.map((i: any, index: number) => [
          this.intervalTime[index],
          i.value,
        ]),
        name: this.stateDashboard[this.type].p95.length ? 'p95' : null,
        type: 'bar',
        symbol: 'none',
        barMaxWidth: 10,
        stack: '总量',
        lineStyle: {
          width: 1.5,
          type: 'dotted',
        },
    }] : [];
  }
  get p99() {
     return this.stateDashboard[this.type].p99 ?
      [{
          data: this.stateDashboard[this.type].p99.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard[this.type].p99.length ? 'p99' : null,
          type: 'bar',
          barMaxWidth: 10,
          symbol: 'none',
          stack: '总量',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get responseConfig() {
    return {
      color: [
        '#3fe1da',
        '#3fcfdc',
        '#3fbcde',
        '#3fa9e1',
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
        splitLine: { lineStyle: { color: '#c1c5ca41', type: 'dashed' } },
        axisLabel: { color: '#9da5b2', fontSize: '11' },
      },
      series: [
        ...this.p50,
        ...this.p75,
        ...this.p90,
        ...this.p95,
        ...this.p99,
      ],
    };
  }
}
</script>
