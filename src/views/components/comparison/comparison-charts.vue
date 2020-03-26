/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */
<template>
  <div class="rk-comparison-charts">
    <div class="component-item" v-for="item of Object.keys(chartSource)" :key="item">
      <div class="title">{{ item }}</div>
      <div class="chart-item">
        <ChartLine
          v-if="Array.isArray(chartSource[item])"
          :intervalTime="intervalTime"
          :data="{ [item]: chartSource[item] }"
        />
        <ChartLine v-else :intervalTime="intervalTime" :data="chartSource[item]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';

  import ChartLine from './chart-line.vue';

  @Component({
    components: { ChartLine },
  })
  export default class ComparisonCharts extends Vue {
    @Prop() private chartSource: any;
    @Getter('intervalTime') private intervalTime: any;
  }
</script>

<style lang="scss">
  .rk-comparison-charts {
    flex-grow: 5;
    height: 100%;
    padding: 20px;
    overflow: auto;
    .chart-item {
      width: 100%;
      height: 200px;
    }
    .component-item {
      width: 100%;
      .title {
        height: 30px;
        line-height: 30px;
        margin: 10px 0;
        padding-left: 10px;
        background-color: rgba(196, 200, 225, 0.2);
        color: #9da5b2;
      }
    }
  }
</style>
