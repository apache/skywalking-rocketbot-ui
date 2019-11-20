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
  <RkEcharts ref="chart" :option="option"/>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import 'echarts/lib/component/visualMap';
import moment from 'dayjs';
@Component
export default class ChartHeatmap extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private data!: any;
  @Prop() private intervalTime!: any;
  public resize() {
    const chart: any = this.$refs.chart;
    chart.myChart.resize();
  }
  get option() {
    const w: any = window;
    const source = this.data.map((d: any) => d[2]);
    const maxSource = Math.max(...source);
    const minSource = Math.min(...source);

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
        top: 15,
        left: 0,
        right: 10,
        bottom: 5,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.intervalTime,
        axisTick: {
          lineStyle: { color: '#c1c5ca' },
          alignWithLabel: true,
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: 'rgba(0,0,0,0)' } },
        axisLabel: { color: '#9da5b2', fontSize: '11' },
      },
      visualMap: [
        {
          min: minSource,
          max: maxSource,
          show: false,
          calculable: true,
          realtime: false,
          orient: 'horizontal',
          left: 'center',
          bottom: '0',
          inRange: {
            color: ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf',
            '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
          },
        },
      ],
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#c1c5ca', type: 'dashed' } },
        axisLabel: { color: '#9da5b2', fontSize: '11', formatter: (a: number) => `${a * 100}ms`},
      },
      series: [
        {
          type: 'heatmap',
          data: this.data,
          symbolSize: (d: any) => d[2] ? 7 : 0,
        },
      ],
    };
  }
}
</script>
