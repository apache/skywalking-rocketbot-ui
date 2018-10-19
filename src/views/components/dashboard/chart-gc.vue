<template>
  <rk-panel title="GC ms">
    <RkEcharts height="200px" :option="throughputConfig"/>
    <div class="tc">
      <span class="sm mr10"><span class="grey mr10">Young GC</span>{{young}}</span>
      <span class="sm"><span class="grey mr10">Old GC</span>{{old}}</span>
    </div>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Gc extends Vue {
  @State('dashboard') stateDashboard;
  @State('global') stateGlobal;
  @Getter('durationTime') durationTime;
  get young() {
    if (!this.stateDashboard.gc.youngGCCount) return 0;
    return this.stateDashboard.gc.youngGCCount.length ? this.stateDashboard.gc.youngGCCount.reduce((num, item) => num + item) : 0;
  }
  get old() {
    if (!this.stateDashboard.gc.oldGCCount) return 0;
    return this.stateDashboard.gc.oldGCCount.length ? this.stateDashboard.gc.oldGCCount.reduce((num, item) => num + item) : 0;
  }
  get throughputConfig() {
    return {
      color: ['#75a8ff', '#f7b32b'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Young GC Time', 'Old GC Time'],
        icon: 'circle',
        top: 10,
        left: 10,
        itemGap: 15,
        itemWidth: 15,
        itemHeight: 12,
      },
      grid: {
        top: 50,
        left: 0,
        right: 18,
        bottom: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisTick: {
          lineStyle: { color: 'rgba(0,0,0,.1)' },
          alignWithLabel: true,
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: 'rgba(0,0,0,.1)' } },
        axisLabel: { color: '#333', fontSize: '11' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,.1)' } },
        axisLabel: { color: '#333', fontSize: '11' },
      },
      series: [
        {
          data: this.stateDashboard.gc.youngGCTime.map((i, index) => [this.durationTime[index], i]),
          name: 'Young GC Time',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
        {
          data: this.stateDashboard.gc.oldGCTime.map((i, index) => [this.durationTime[index], i]),
          name: 'Old GC Time',
          type: 'line',
          symbol: 'none',
          // smooth: 'true',
        },
      ],
    };
  }
}
</script>
