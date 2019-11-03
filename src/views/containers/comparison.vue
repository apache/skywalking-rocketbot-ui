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
  <div class="rk-comparison flex-h">
    <ConparisonCharts :chartSource="chartSource" />
    <ConparisonConfig :currentOptions="currentOptions" :optSource="optSource" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';

  import { ICurrentOptions, DataSourceType, IOption } from '@/types/comparison';
  import { ComparisonType, ComparisonOption, InitSource, ChangeType, MetricsSource } from '../components/comparison/comparison-const';
  import { comparisonStore } from '@/store/modules/comparison';
  import { ConparisonConfig, ConparisonCharts } from '../components/comparison';
  import { DurationTime } from '@/types/global';
  import compareObj from '@/utils/comparison';

  @Component({
    components: {
      ConparisonConfig,
      ConparisonCharts,
    },
  })
  export default class Comparison extends Vue {
    @State('comparisonStore') private comparisonStore: any;
    @Action('GET_SERVICES') private GET_SERVICES: any;
    @Action('GET_SERVICE_ENDPOINTS') private GET_SERVICE_ENDPOINTS: any;
    @Action('SELECT_SERVICE') private SELECT_SERVICE: any;
    @Getter('durationTime') private durationTime: any;
    @Action('comparisonStore/GET_COMPARISON') private GET_COMPARISON: any;

    private changeType = ChangeType;
    private optSource = InitSource as DataSourceType;
    private currentOptions = ComparisonOption as ICurrentOptions;
    private chartSource = {};

    private beforeCreate() {
      this.$store.registerModule('comparisonStore', comparisonStore);
    }

    private created() {
      this.getService();
    }

    private async getService() {
      await this.GET_SERVICES({duration: this.durationTime, isUpdate: true});
      const { services } = this.$store.state.rocketOption;

      this.optSource.preServiceSource = services;
      this.optSource.nextServiceSource = services;
      this.currentOptions.preService = services[0];
      this.currentOptions.nextService = services[0];

      const type = this.currentOptions.preType.key;

      this.optSource.preMetricsSource = MetricsSource[type];
      this.currentOptions.preMetrics = MetricsSource[type][0];
      this.optSource.nextMetricsSource = MetricsSource[type];
      this.currentOptions.nextMetrics = MetricsSource[type][0];
      await this.GET_SERVICE_ENDPOINTS({duration: this.durationTime});
  
      const { endpoints } = this.$store.state.rocketOption;

      this.optSource.preObjectSource = endpoints;
      this.optSource.nextObjectSource = endpoints;
      this.currentOptions.preObject = endpoints[0];
      this.currentOptions.nextObject = endpoints[0];
      await this.$store.commit('comparisonStore/UPDATESOURCE', {
        currentOptions: this.currentOptions,
        dataSource: this.optSource,
      });
      this.GET_COMPARISON({
        serviceId: this.currentOptions.preService.key || '',
        endpointId: this.currentOptions.preObject.key || '',
        endpointName: this.currentOptions.preObject.label || '',
        // instanceId: this.currentOptions.currentInstance.key || '',
        // databaseId: this.currentOptions.currentDatabase.key || '',
        duration: this.durationTime,
      })
      .then((data: any) => {
        const value = (Object as any).values(data)[0].values.map((d: {value: number}) => d.value);
        const obj = {
          [Object.keys(data)[0]]: value,
        };
        this.chartSource = obj;
      });
    }

    @Watch('durationTime')
    private watchDurationTime(newValue: DurationTime, oldValue: DurationTime) {
      if (compareObj(newValue, oldValue)) {
        // this.GET_SERVICES({durationTime: this.durationTime});
      }
    }

    private beforeDestroy() {
      this.$store.unregisterModule('comparisonStore');
    }
  }
</script>

<style lang="scss">
  .rk-comparison {
    height: 100%;
  }
</style>
