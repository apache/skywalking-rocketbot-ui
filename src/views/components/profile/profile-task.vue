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
  <div class="rk-profile-task">
    <label>{{ $t('service') }}</label>
    <RkSelect
      class="mb-5"
      :current="newTaskFields.service"
      :data="taskFieldSource.serviceSource"
      @onChoose="(item) => changeOption(item, updateTaskOpt.Service)"
    />
    <label>{{ $t('endpointName') }}</label>
    <input type="text" class="rk-profile-input" @change="changeOption($event, updateTaskOpt.EndpointName)" />
    <div>
      <label>{{ $t('monitorTime') }}</label>
      <div>
        <RkRadio
          class="mb-5 monitor-time-radio"
          :current="newTaskFields.monitorTime"
          :data="locale === 'en' ? taskFieldSource.monitorTimeEn : taskFieldSource.monitorTimeCn"
          @onChoose="(item) => changeOption(item, updateTaskOpt.MonitorTime)"
        />
        <span>
          <RkDate class="sm" v-model="time" position="bottom" format="YYYY-MM-DD HH:mm:ss" />
        </span>
      </div>
    </div>
    <label>{{ $t('monitorDuration') }}</label>
    <RkRadio
      class="mb-5"
      :current="newTaskFields.monitorDuration"
      :data="taskFieldSource.monitorDuration"
      @onChoose="(item) => changeOption(item, updateTaskOpt.MonitorDuration)"
    />
    <label>{{ $t('minThreshold') }} (ms)</label>
    <input
      type="text"
      class="rk-profile-input"
      :value="newTaskFields.minThreshold"
      @change="changeOption($event, updateTaskOpt.MinThreshold)"
    />
    <label>{{ $t('dumpPeriod') }}</label>
    <RkRadio
      class="mb-5"
      :current="newTaskFields.dumpPeriod"
      :data="taskFieldSource.dumpPeriod"
      @onChoose="(item) => changeOption(item, updateTaskOpt.DumpPeriod)"
    />
    <label>{{ $t('maxSamplingCount') }}</label>
    <RkSelect
      class="mb-5"
      :current="newTaskFields.maxSamplingCount"
      :data="taskFieldSource.maxSamplingCount"
      @onChoose="(item) => changeOption(item, updateTaskOpt.MaxSamplingCount)"
    />
    <div v-if="this.message" class="message-tip">{{ this.message }}</div>
    <div @click="createTask">
      <a class="rk-create-task-btn bg-blue r">
        <span class="mr-5 vm">{{ $t('createTask') }}</span>
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
    private time!: Date;
    private message: string = '';
    private locale: string = 'en';
    @Prop() private newTaskFields: any;
    @Prop() private taskFieldSource: any;
    @Getter('profileStore/updateTaskOpt') private updateTaskOpt: any;
    @Action('profileStore/CREATE_PROFILE_TASK') private CREATE_PROFILE_TASK: any;
    @Mutation('profileStore/SET_TASK_OPTIONS') private SET_TASK_OPTIONS: any;
    @State('rocketbot') private rocketbotGlobal: any;

    private changeOption(item: any, type: string) {
      if ([this.updateTaskOpt.MinThreshold, this.updateTaskOpt.EndpointName].includes(type)) {
        item = {
          label: type,
          key: item.target.value,
        };
      }
      this.SET_TASK_OPTIONS({ item, type });
    }

    private createTask() {
      this.CREATE_PROFILE_TASK({ startTime: this.time.getTime() }).then((res: any) => {
        if (res.errorReason) {
          this.message = res.errorReason;
          return;
        } else {
          this.$emit('closeSidebox');
        }
      });
    }

    @Watch('rocketbotGlobal.durationRow')
    private durationRowWatch(value: Duration) {
      this.time = value.start;
    }

    private created() {
      this.locale = this.$i18n.locale;
      this.time = this.rocketbotGlobal.durationRow.start;
    }
  }
</script>

<style lang="scss" scoped>
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
    height: 30px;
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
  .message-tip {
    font-size: 14px;
    color: red;
    margin-top: 10px;
  }
  .monitor-time-radio {
    display: inline;
  }
</style>
