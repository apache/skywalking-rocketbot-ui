<template>
  <div>
    <div class="grey sm mb-5">{{title}}</div>
    <h5 class="mt-0 mb-0">{{content.toFixed(2)}} {{unit}}</h5>
    <RkEcharts height="32px" :option="responseConfig"/>
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
    if (!this.data.length) {return 0; }
    const sum = this.data.
    reduce((preValue: number, curValue: number, index: number, array: number[]) => preValue + curValue)
    / this.data.length;
    return this.precent ? sum / 100 : sum;
  }
  get responseConfig() {
    return {
      color: [
        '#3f96e3ee',
        '#6be6c1',
      ],
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
        type: 'time',
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#c1c5ca08', type: 'dashed' } },
        axisLabel: { show: false },
      },
      series: [
        {
          data: this.data.map((i: any, index: number) => [
            this.intervalTime[index],
            i,
          ]),
          type: this.precent ? 'bar' : 'line',
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
