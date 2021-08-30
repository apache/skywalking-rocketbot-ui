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
  <div class="flex-h">
    <div class="field">
      <label>{{ $t('service') }}</label>
      <RkSelect
        class="mb-5"
        :current="logState.selectedService"
        :data="logState.services"
        @onChoose="(item) => changeLogAnaOptions(item, logTestConstants.Service)"
      />
    </div>
    <div class="field">
      <label>{{ $t('serviceinstance') }}</label>
      <RkSelect
        class="mb-5"
        :current="logState.selectedInstance"
        :data="logState.instances"
        @onChoose="(item) => changeLogAnaOptions(item, logTestConstants.ServiceInstance)"
      />
    </div>
    <div class="field">
      <label>{{ $t('endpoint') }}</label>
      <RkSelect
        class="mb-5"
        :current="logState.selectedEndpoint"
        :data="logState.endpoints"
        @onChoose="(item) => changeLogAnaOptions(item, logTestConstants.Endpoint)"
      />
    </div>
    <div class="field">
      <label>{{ $t('time') }}</label>
      <div>
        <span>
          <RkDate class="sm" v-model="time" position="bottom" format="YYYY-MM-DD HH:mm:ss" />
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { State as rocketLogState } from '@/store/modules/log/index';
  import { State as rocketLogAnaState } from '@/store/modules/log/log-ana';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { LogTestConstants } from './log-constant';
  import { Option } from '@/types/global';

  @Component
  export default class LogAna extends Vue {
    @State('rocketLog') private logState!: rocketLogState & rocketLogAnaState;
    @State('rocketOption') private rocketOption!: optionState;
    @State('rocketbot') private rocketbotGlobal: any;
    @Getter('durationTime') private durationTime: any;
    @Mutation('SET_SELECTED_SERVICE') private SET_SELECTED_SERVICE: any;
    @Mutation('SET_SELECTED_ENDPOINT') private SET_SELECTED_ENDPOINT: any;
    @Mutation('SET_SELECTED_INSTANCE') private SET_SELECTED_INSTANCE: any;
    @Action('GET_LOG_ANA_ENDPOINTS') private GET_LOG_ANA_ENDPOINTS: any;
    @Action('GET_LOG_ANA_INSTANCES') private GET_LOG_ANA_INSTANCES: any;

    private logTestConstants = LogTestConstants;
    private time!: Date;

    private created() {
      this.time = this.rocketbotGlobal.durationRow.start;
    }

    private changeLogAnaOptions(item: Option, type: string) {
      if (type === this.logTestConstants.Service) {
        this.SET_SELECTED_SERVICE(item);
        this.GET_LOG_ANA_INSTANCES({ duration: this.durationTime });
        this.GET_LOG_ANA_ENDPOINTS({ duration: this.durationTime });
        return;
      }
      if (type === this.logTestConstants.ServiceInstance) {
        this.SET_SELECTED_INSTANCE(item);
        return;
      }
      if (type === this.logTestConstants.Endpoint) {
        this.SET_SELECTED_ENDPOINT(item);
        return;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .field {
    width: 50%;
    margin-right: 10px;
  }
</style>
