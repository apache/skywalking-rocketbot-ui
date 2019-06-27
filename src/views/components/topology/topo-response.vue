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
  <div>
    <div class="grey sm mb-5">{{title}}</div>
    <RkEcharts height="120px" :option="responseConfig"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Response extends Vue {
  @Prop() private title!: string;
  @Prop() private data!: any;
  @Prop() private intervalTime!: any;
  get p50() {
     return this.data.p50 ?
      [{
          data: this.data.p50.map((i: any, index: number) => [
            this.intervalTime[index],
            i,
          ]),
          name: this.data.p50.length ? 'p50' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get p75() {
     return this.data.p75 ?
      [{
          data: this.data.p75.map((i: any, index: number) => [
            this.intervalTime[index],
            i,
          ]),
          name: this.data.p75.length ? 'p75' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get p90() {
     return this.data.p90 ?
      [{
          data: this.data.p90.map((i: any, index: number) => [
            this.intervalTime[index],
            i,
          ]),
          name: this.data.p90.length ? 'p90' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get p95() {
    return this.data.p95 ?
    [{
        data: this.data.p95.map((i: any, index: number) => [
          this.intervalTime[index],
          i,
        ]),
        name: this.data.p95.length ? 'p95' : null,
        type: 'line',
        symbol: 'none',
        lineStyle: {
          width: 1.5,
          type: 'dotted',
        },
    }] : [];
  }
  get p99() {
     return this.data.p99 ?
      [{
          data: this.data.p99.map((i: any, index: number) => [
            this.intervalTime[index],
            i,
          ]),
          name: this.data.p99.length ? 'p99' : null,
          type: 'line',
          symbol: 'none',
          lineStyle: {
            width: 1.5,
            type: 'dotted',
          },
      }] : [];
  }
  get responseConfig() {
    return {
      color: [
        '#6be6c1',
        '#626c91',
        '#a0a7e6',
        '#96dee8',
        '#3f96e3',
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgb(50,50,50)',
        textStyle: {
          fontSize: 13,
        },
      },
      // legend: {
      //   icon: 'circle',
      //   top: 0,
      //   left: 0,
      //   itemWidth: 12,
      // },
      grid: {
        top: 5,
        left: 0,
        right: 18,
        bottom: 5,
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