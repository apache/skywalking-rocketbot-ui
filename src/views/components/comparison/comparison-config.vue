/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the 'License'); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div class="rk-comparison-config" v-if="currentOptions && optSource">
    <h4>Previous Service</h4>
    <label>Service</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.preService"
      :data="optSource.preServiceSource"
      @onChoose="(item) => changOption(item, changeType.PreService)"
    />
    <label>Type</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.preType"
      :data="optSource.preTypeSource"
      @onChoose="(item) => changOption(item, changeType.PreType)"
    />
    <label>Object</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.preObject"
      :data="optSource.preObjectSource"
      @onChoose="(item) => changOption(item, changeType.PreObject)"
    />
    <label>Metrics</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.preMetrics"
      :data="optSource.preMetricsSource"
      @onChoose="(item) => changOption(item, changeType.PreMetrics)"
    />
    <h4>Next Service</h4>
    <label>Service</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.nextService"
      :data="optSource.nextServiceSource"
      @onChoose="(item) => changOption(item, changeType.NextService)"
    />
    <label>Type</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.nextType"
      :data="optSource.nextTypeSource"
      @onChoose="(item) => changOption(item, changeType.NextType)"
    />
    <label>Object</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.nextObject"
      :data="optSource.nextObjectSource"
      @onChoose="(item) => changOption(item, changeType.NextObject)"
    />
    <label>Metrics</label>
    <RkSelect
      class="mb-5"
      :current="currentOptions.nextMetrics"
      :data="optSource.nextMetricsSource"
      @onChoose="(item) => changOption(item, changeType.NextMetrics)"
    />
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { ActionTree } from 'vuex';
  import Axios, { AxiosResponse, AxiosPromise } from 'axios';

  import { ICurrentOptions, DataSourceType, IOption } from '@/types/comparison';
  import { ComparisonType, ComparisonOption, InitSource, ChangeType } from './comparison-const';
  import { DurationTime } from '@/types/global';
  import compareObj from '@/utils/comparison';

  @Component
  export default class ComparisonConfig extends Vue {
    @Action('GET_SERVICES') private GET_SERVICES: any;
    @Action('GET_SERVICE_ENDPOINTS') private GET_SERVICE_ENDPOINTS: any;
    @Getter('durationTime') private durationTime: any;

    private changeType = ChangeType;
    private optSource = InitSource as DataSourceType;
    private currentOptions = ComparisonOption as ICurrentOptions;

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
      await this.GET_SERVICE_ENDPOINTS({duration: this.durationTime});
      const { endpoints } = this.$store.state.rocketOption;

      this.optSource.preObjectSource = endpoints;
      this.optSource.nextObjectSource = endpoints;
      this.currentOptions.preObject = endpoints[0];
      this.currentOptions.nextObject = endpoints[0];
    }

    @Watch('durationTime')
    private watchDurationTime(newValue: DurationTime, oldValue: DurationTime) {
      if (compareObj(newValue, oldValue)) {
        this.GET_SERVICES({durationTime: this.durationTime});
      }
    }

    private changOption(item: IOption, type: string) {
      if (this.changeType.PreService === type) {
        this.currentOptions.preService = item;
      }
      if (this.changeType.PreType === type) {
        this.currentOptions.preType = item;
      }
      if (this.changeType.PreObject === type) {
        this.currentOptions.preObject = item;
      }
      if (this.changeType.PreObject === type) {
        this.currentOptions.preObject = item;
      }
      if (this.changeType.NextService === type) {
        this.currentOptions.nextService = item;
      }
      if (this.changeType.NextType === type) {
        this.currentOptions.nextType = item;
      }
      if (this.changeType.NextObject === type) {
        this.currentOptions.nextObject = item;
      }
      if (this.changeType.NextObject === type) {
        this.currentOptions.nextObject = item;
      }
    }
  }
</script>

<style lang='scss'>
  .rk-comparison-config {
    width: 380px;
    height: 100%;
    padding: 20px;
    border: 1px solid #ddd;
    h4 {
      margin: 0;
    }
    h4:not(:first-child) {
      margin-top: 50px;
    }
    label {
      display: inline-block;
      margin: 10px 0;
      font-weight: bold;
    }
  }
</style>
