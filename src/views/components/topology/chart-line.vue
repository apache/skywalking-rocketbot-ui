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
    <RkEcharts height="120px" :option="option" />
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartLine extends Vue {
    @Prop() private data!: any;
    @Prop() private title!: string;
    @Prop() private intervalTime!: any;

    get option() {
      const keys = Object.keys(this.data || {}).filter((i: any) => Array.isArray(this.data[i]) && this.data[i].length);
      const temp = keys.map((i: string, index: number) => {
        return {
          data: this.data[i].map((item: any, itemIndex: number) => [this.intervalTime[itemIndex], item]),
          name: i,
          type: 'line',
          symbol: 'none',
          barMaxWidth: 10,
          lineStyle: {
            width: 1.5,
            type: 'solid',
          },
        };
      });
      const color: string[] = [
        '#30A4EB',
        '#45BFC0',
        '#FFCC55',
        '#FF6A84',
        '#a0a7e6',
        '#6be6c1',
        '#626c91',
        '#96dee8',
        '#3f96e3',
      ];

      return {
        color,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgb(50,50,50)',
          textStyle: {
            fontSize: 13,
          },
        },
        legend: {
          show: false,
        },
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
        series: temp,
      };
    }
  }
</script>
