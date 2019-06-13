<template>
  <RkEcharts ref="chart" :option="option" :autoResize="true"/>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Request extends Vue {
    public resize() {
      const chart: any = this.$refs.chart;
      chart.myChart.resize();
    }
    get option() {
      const w: any = window;
      return {
        color: [
          '#3f96e3',
          '#6be6c1',
          '#626c91',
          '#a0a7e6',
          '#96dee8',
        ],
        grid: {
          top: 15,
          left: 0,
          right: 15,
          bottom: 5,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgb(50,50,50)',
          textStyle: {
            fontSize: 13,
          },
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
          data: ['2012', '2013', '2014', '2015', '2016', '2017'],
        },
        yAxis: [{
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#c1c5ca41', type: 'dashed'} },
          axisLabel: { color: '#9da5b2', fontSize: '11' },
        }],
        series: [
          {
            name: '成功数（次）',
            data: [41.1, 30.4, 65.1, 53.3, 83.8, 28.7],
            type: 'line',
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
<style lang="scss">
</style>
