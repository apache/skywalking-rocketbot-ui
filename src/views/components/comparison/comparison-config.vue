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
    <!-- <a class="rk-btn mr ghost">数据查询</a> -->
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';
  import { IOption } from '@/types/comparison';

  @Component
  export default class ComparisonConfig extends Vue {
    @Prop() private currentOptions: any;
    @Prop() private optSource: any;
    @Getter('durationTime') private durationTime: any;
    @Getter('comparisonStore/ChangeType') private changeType: any;

    private changOption(item: IOption, key: string) {
      this.$store.dispatch('comparisonStore/SELECT_CONFIG', {
        duration: this.durationTime,
        type: key,
        option: item,
      });
    }
  }
</script>

<style lang='scss'>
  .rk-comparison-config {
    width: 380px;
    height: 100%;
    padding: 20px;
    border: 1px solid #ddd;
    overflow: auto;
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
