<template>
  <RkEcharts ref="chart" :option="option" :autoResize="true"/>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Request extends Vue {
    @Prop() private data!: any;
    @Prop() private intervalTime!: any;
    public resize() {
      const chart: any = this.$refs.chart;
      chart.myChart.resize();
    }
  get option() {
    const temp: any = [];
    const keys = Object.keys(this.data || {});
    keys.forEach((i: any, index: number) => {
      const serie: any = {
          data: this.data[i].map((item: any, itemIndex: number) => [
            this.intervalTime[itemIndex],
            item,
          ]),
          name: i,
          type: 'line',
          symbol: 'none',
          barMaxWidth: 10,
          stack: '总量',
          lineStyle: {
            width: 1.5,
            type: keys.length !== 5 ? 'solid' : 'dotted',
          },
      };
      if (keys.length === 2) {
        serie.areaStyle = {};
      }
      temp.push(serie);
    });
    let color: string[] = [];
    switch (keys.length) {
      case 2:
      color = [
        '#a3a0e6',
        '#a0b1e6',
      ];
      break;
      case 1:
      color = [
        '#3f96e3',
      ];
      break;
      default:
        color = [
          '#6be6c1',
          '#626c91',
          '#a0a7e6',
          '#96dee8',
          '#3f96e3',
        ];
        break;
    }
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
        show: keys.length === 1 ? false : true,
        icon: 'circle',
        top: 0,
        left: 0,
        itemWidth: 12,
      },
      grid: {
        top: keys.length === 1 ? 15 : 40,
        left: 0,
        right: 10,
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
