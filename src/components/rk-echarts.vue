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
  <div class="echarts" :style="`height:${height};width:${width};`"></div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import * as echarts from 'echarts/lib/echarts';
  import 'echarts/lib/component/legendScroll';
  import { Action } from 'vuex-class';
  @Component
  export default class RkEcharts extends Vue {
    @Prop() private option: any;
    @Prop() private clickEvent: any;
    @Prop({ default: false }) private uncombine!: boolean;
    @Prop({ default: '100%' }) private height!: string;
    @Prop({ default: '100%' }) private width!: string;
    @Action('CLEAR_CHARTS') private CLEAR_CHARTS: any;
    private myChart: any = {};
    private mounted(): void {
      this.drawEcharts();
      window.addEventListener('resize', this.myChart.resize);
    }
    private beforeDestroy(): void {
      if (this.myChart.dispose) {
        this.myChart.dispose();
      }
      window.removeEventListener('resize', this.myChart.resize);
    }
    @Watch('option', { deep: true })
    private onoptionChanged(newVal: any, oldVal: any): void {
      if (this.myChart) {
        if (newVal) {
          this.myChart.setOption(newVal, true); // clear cache
        } else {
          this.myChart.setOption(oldVal, true);
        }
      } else {
        this.drawEcharts();
      }
    }
    private drawEcharts(): void {
      const el: any = this.$el;
      this.myChart = echarts.init(el, '');
      this.myChart.setOption(this.option);
      this.myChart.on('click', (params: any) => {
        if (!this.clickEvent) {
          return;
        }
        this.clickEvent(params);
      });
    }
  }
</script>
<style></style>
