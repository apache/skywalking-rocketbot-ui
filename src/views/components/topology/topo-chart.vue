<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->
<template>
  <div>
    <div class="grey sm mb-5">{{ title }}</div>
    <h5 class="grey mt-0 mb-0">{{ content.toFixed(2) }} {{ unit }}</h5>
    <RkEcharts height="100px" :option="responseConfig" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class TopoChart extends Vue {
    @Prop() private title!: string;
    @Prop() private data!: any;
    @Prop() private unit!: string;
    @Prop() private intervalTime!: number[];
    @Prop() private precent!: boolean;
    get content() {
      if (!this.data.length) {
        return 0;
      }
      const noZero = this.data.filter((i: any) => i);
      const sum = noZero.length
        ? noZero.reduce((preValue: number, curValue: number, index: number, array: number[]) => preValue + curValue) /
          noZero.length
        : 0;
      return this.precent ? sum / 100 : sum;
    }
    get responseConfig() {
      return {
        color: ['#3f96e3ee', '#6be6c1'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#333844',
          textStyle: {
            fontSize: 13,
          },
        },
        grid: {
          top: 4,
          left: 0,
          right: 0,
          bottom: 7,
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
          {
            data: this.data.map((i: any, index: number) => [this.intervalTime[index], this.precent ? i / 100 : i]),
            // type: this.precent ? 'bar' : 'line',
            type: 'line',
            symbol: 'none',
            barMaxWidth: 5,
            lineStyle: {
              width: 1,
            },
          },
        ],
      };
    }
  }
</script>
