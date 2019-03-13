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
export default class EnvoyCollections extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
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
          data: this.stateDashboard.instanceInfo.envoyParent.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard[this.type].envoyParent.length ? 'Parent' : null,
          type: 'line',
          areaStyle: {},
          symbol: 'none',
          lineStyle: {
            width: 1.5,
          },
        },
         {
          data: this.stateDashboard.instanceInfo.envoyTotal.map((i: any, index: number) => [
            this.intervalTime[index],
            i.value,
          ]),
          name: this.stateDashboard[this.type].envoyTotal.length ? 'Total' : null,
          type: 'line',
          areaStyle: {},
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
