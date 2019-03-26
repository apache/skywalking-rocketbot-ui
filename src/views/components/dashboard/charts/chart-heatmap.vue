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
import 'echarts/lib/component/visualMap';
import moment from 'dayjs';
@Component
export default class Heatmap extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
  @Prop() private intervalTime!: any;
  get responseConfig() {
    const w: any = window;
    return {
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
      visualMap: [
        {
          min: 0,
          max: 25,
          show: false,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '0',
          inRange: {
            color: ['#4ff1ea', '#3f96e3'],
          },
        },
      ],
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
