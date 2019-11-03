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
  <div class="rk-comparison-charts">
    <ChartLine :intervalTime="intervalTime" :data="chartSource" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';

  import ChartLine from '../dashboard/charts/chart-line.vue';

  @Component({
    components: { ChartLine },
  })
  export default class ComparisonCharts extends Vue {
    // @Prop() private currentOptions: any;
    @Prop() private chartSource: any;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    // @Action('comparisonStore/GET_COMPARISON') private GET_COMPARISON: any;

    // private async queryChart() {
    //   console.log(this.currentOptions);
    //   await this.$store.commit('comparisonStore/UPDATESOURCE', {
    //     currentOptions: this.currentOptions,
    //     dataSource: this.optSource,
    //   });
    //   this.GET_COMPARISON({
    //     serviceId: this.currentOptions.preService.key || '',
    //     endpointId: this.currentOptions.preObject.key || '',
    //     endpointName: this.currentOptions.preObject.label || '',
    //     // instanceId: this.currentOptions.currentInstance.key || '',
    //     // databaseId: this.currentOptions.currentDatabase.key || '',
    //     duration: this.durationTime,
    //   });
    // }
  }
</script>

<style lang="scss">
  .rk-comparison-charts {
    flex-grow: 5;
    height: 100%;
    padding: 20px;
  }
</style>
