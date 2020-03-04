/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div class="rk-profile-task">
    <label>{{ this.$t('service') }}</label>
    <RkSelect
      class="mb-5"
      :current="newTaskFields.service"
      :data="taskFieldSource.serviceSource"
      @onChoose="(item) => changeOption(item, updateTaskOpt.Service)"
    />
    <label>{{ this.$t('endpointName') }}</label>
    <input type="text" class="rk-profile-input" @change="changeOption($event, updateTaskOpt.EndpointName)" />
    <label>{{ this.$t('monitorTime') }}</label>
    <RkRadio
      class="mb-5"
      :current="newTaskFields.monitorTime"
      :data="taskFieldSource.monitorTime"
      @onChoose="(item) => changeOption(item, updateTaskOpt.MonitorTime)"
    />
    <div v-if="setMonitorTime">
      <!-- <RkCalendar /> -->
    </div>
    <label>{{ this.$t('monitorDuration') }}</label>
    <RkRadio
      class="mb-5"
      :current="newTaskFields.monitorDuration"
      :data="taskFieldSource.monitorDuration"
      @onChoose="(item) => changeOption(item, updateTaskOpt.MonitorDuration)"
    />
    <label>{{ this.$t('minThreshold') }} (ms)</label>
    <input
      type="text"
      class="rk-profile-input"
      :value="newTaskFields.minThreshold"
      @change="changeOption($event, updateTaskOpt.MinThreshold)"
    />
    <label>{{ this.$t('dumpPeriod') }}</label>
    <RkRadio
      class="mb-5"
      :current="newTaskFields.dumpPeriod"
      :data="taskFieldSource.dumpPeriod"
      @onChoose="(item) => changeOption(item, updateTaskOpt.DumpPeriod)"
    />
    <label>{{ this.$t('maxSamplingCount') }}</label>
    <RkSelect
      class="mb-5"
      :current="newTaskFields.maxSamplingCount"
      :data="taskFieldSource.maxSamplingCount"
      @onChoose="(item) => changeOption(item, updateTaskOpt.MaxSamplingCount)"
    />
    <div @click="createTask">
      <a class="rk-create-task-btn bg-blue r">
        <span class="mr-5 vm">{{ this.$t('createTask') }}</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';

  @Component
  export default class ProfileTask extends Vue {
    private setMonitorTime: boolean = false;
    private time!: Date[];
    @Prop() private newTaskFields: any;
    @Prop() private taskFieldSource: any;
    @Getter('profileStore/updateTaskOpt') private updateTaskOpt: any;

    private changeOption(item: any, type: string) {
      if (type === this.updateTaskOpt.MonitorTime && item.key === '1') {
        this.setMonitorTime = true;
      }
      if ([this.updateTaskOpt.MinThreshold, this.updateTaskOpt.EndpointName].includes(type)) {
        item = {
          label: type,
          key: item.target.value,
        };
      }
      this.$store.commit('profileStore/SET_TASK_OPTIONS', { item, type });
    }

    private createTask() {
      this.$store.dispatch('profileStore/CREATE_PROFILE_TASK');
    }
  }
</script>

<style lang="scss">
  .rk-profile-task {
    margin: 20px;
  }
  label {
    display: inline-block;
    margin: 10px 0;
    font-weight: bold;
    font-size: 14px;
  }
  .rk-profile-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
    display: block;
    width: 100%;
  }
  .rk-create-task-btn {
    color: #fff;
    padding: 10px 9px;
    border-radius: 4px;
    margin-top: 40px;
    width: 100%;
    text-align: center;
  }
</style>
