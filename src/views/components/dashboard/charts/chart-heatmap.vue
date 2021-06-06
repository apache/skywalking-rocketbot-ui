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
  <RkEcharts ref="chart" :option="option" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import 'echarts/lib/component/visualMap';
  @Component
  export default class ChartHeatmap extends Vue {
    @Prop() private title!: string;
    @Prop() private type!: string;
    @Prop() private data!: any;
    @Prop() private intervalTime!: any;
    @Prop() private item!: any;
    public resize() {
      const chart: any = this.$refs.chart;
      chart.myChart.resize();
    }
    get option() {
      const source = (this.data.nodes || []).map((d: number[]) => d[2]);
      const maxItem = Math.max(...source);
      const minItem = Math.min(...source);
      const colorBox = [
        '#fff',
        '#FDF0F0',
        '#FAE2E2',
        '#F8D3D3',
        '#F6C4C4',
        '#F4B5B5',
        '#F1A7A7',
        '#EF9898',
        '#E86C6C',
        '#E44E4E',
        '#E23F3F',
        '#DF3131',
        '#DD2222',
        '#CE2020',
        '#C01D1D',
        '#B11B1B',
        '#A21919',
        '#851414',
        '#761212',
        '#671010',
      ];
      return {
        tooltip: {
          position: 'top',
          formatter: (a: any) => `${a.data[1] * 100}${this.item.unit}  [ ${a.data[2]} ]`,
          textStyle: {
            fontSize: 13,
            color: '#ccc',
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
            min: minItem,
            max: maxItem,
            show: false,
            type: 'piecewise',
            calculable: true,
            pieces: this.generatePieces(maxItem, colorBox, minItem),
          },
        ],
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#c1c5ca', type: 'dashed' } },
          axisLabel: { color: '#9da5b2', fontSize: '11' },
          data: this.data.buckets,
        },
        series: [
          {
            type: 'heatmap',
            data: this.data.nodes || [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    }
    private generatePieces(maxValue: number, colorBox: string[], minItem: number) {
      if (maxValue < minItem) {
        return [];
      }
      const pieces = [];
      let quotient = 1;
      let temp = {} as { min: number; max: number; color: string };
      temp.max = minItem;
      temp.min = minItem;
      temp.color = colorBox[0];
      pieces.push(temp);
      if (maxValue && maxValue >= 19) {
        quotient = Math.floor(maxValue / 19);
        for (let i = 1; i < 20; i++) {
          temp = {} as any;
          if (i === 1) {
            temp.min = minItem;
          } else {
            temp.min = quotient * (i - 1);
          }
          temp.max = quotient * i;
          temp.color = colorBox[i];
          pieces.push(temp);
        }
      }
      const length = pieces.length;
      if (length) {
        const item = pieces[length - 1];
        item.max = maxValue;
      }
      return pieces;
    }
  }
</script>
