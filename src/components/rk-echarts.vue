<template>
  <div class="echarts" :style="`height:${height};width:${width};`"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import echarts from 'echarts/lib/echarts';
import { Action } from 'vuex-class';
@Component({})
export default class RkEcharts extends Vue {
  @Prop() option: Object;
  @Prop({ type: String, default: '400px' }) height: String;
  @Prop({ type: String, default: '100%' }) width: String;
  @Action('SET_CHARTS') SET_CHARTS;
  @Action('CLEAR_CHARTS') CLEAR_CHARTS;
  myChart: any = {};
  mounted(): void {
    this.drawEcharts();
    window.addEventListener('resize', this.myChart.resize);
    this.SET_CHARTS(this.myChart);
  }
  beforeDestroy(): void {
    window.removeEventListener('resize', this.myChart.resize);
    this.CLEAR_CHARTS();
  }
  @Watch('option', { deep: true })
  onoptionChanged(newVal: Object, oldVal: Object): void {
    if (this.myChart) {
      if (newVal) {
        this.myChart.setOption(newVal);
      } else {
        this.myChart.setOption(oldVal);
      }
    } else {
      this.drawEcharts();
    }
  }
  drawEcharts(): void {
    this.myChart = echarts.init(<any>this.$el, '');
    this.myChart.setOption(this.option);
  }
}
</script>
<style>
</style>
