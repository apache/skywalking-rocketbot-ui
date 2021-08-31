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
  <div>
    <div class="flex-v">
      <div>
        <label>{{ $t('service') }}</label>
        <RkSelect
          class="mb-5"
          :current="logState.selectedService"
          :data="logState.services"
          @onChoose="(item) => changeLogAnaOptions(logTestConstants.Service, item)"
        />
      </div>
      <div>
        <label>{{ $t('serviceinstance') }}</label>
        <RkSelect
          class="mb-5"
          :current="logState.selectedInstance"
          :data="logState.instances"
          @onChoose="(item) => changeLogAnaOptions(logTestConstants.ServiceInstance, item)"
        />
      </div>
      <div>
        <label>{{ $t('endpoint') }}</label>
        <RkSelect
          class="mb-5"
          :current="logState.selectedEndpoint"
          :data="logState.endpoints"
          @onChoose="(item) => changeLogAnaOptions(logTestConstants.Endpoint, item)"
        />
      </div>
      <div>
        <label>{{ $t('time') }}</label>
        <div>
          <span>
            <RkDate class="sm" v-model="time" position="bottom" format="YYYY-MM-DD HH:mm:ss" />
          </span>
        </div>
      </div>
      <div>
        <label>{{ $t('tags') }}</label>
        <ConditionTags :theme="'light'" :clearTags="clearAllTags" @updateTags="updateTags" />
      </div>
      <div class="logDataBody">
        <label>{{ $t('logDataBody') }}</label>
        <textarea v-model="logContent" @change="changeLogAnaOptions(logTestConstants.Body)" />
      </div>
      <div>
        <label>{{ $t('traceID') }}</label>
        <input
          type="text"
          :placeholder="$t('inputTraceId')"
          v-model="traceID"
          @change="changeLogAnaOptions(logTestConstants.TraceContext)"
        />
      </div>
      <div>
        <label>{{ $t('traceSegmentId') }}</label>
        <input
          type="text"
          :placeholder="$t('inputTraceSegmentId')"
          v-model="segmentID"
          @change="changeLogAnaOptions(logTestConstants.TraceContext)"
        />
      </div>
      <div>
        <label>{{ $t('spanId') }}</label>
        <input
          type="number"
          :placeholder="$t('inputSpanId')"
          v-model="spanID"
          @change="changeLogAnaOptions(logTestConstants.TraceContext)"
        />
      </div>
      <div>
        <label>{{ $t('dsl') }}</label>
        <input type="text" v-model="dslContent" @change="changeLogAnaOptions(logTestConstants.DSL)" />
      </div>
    </div>
    <div>
      <a class="log-ana-btn bg-blue" @click="logAnalysis">
        <span class="vm">Analysis</span>
      </a>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { State as rocketLogState } from '@/store/modules/log/index';
  import { State as rocketLogAnaState } from '@/store/modules/log/log-ana';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { LogTestConstants } from './log-constant';
  import { Option } from '@/types/global';
  import { ConditionTags } from '../common/index';

  @Component({ components: { ConditionTags } })
  export default class LogAna extends Vue {
    @State('rocketLog') private logState!: rocketLogState & rocketLogAnaState;
    @State('rocketOption') private rocketOption!: optionState;
    @State('rocketbot') private rocketbotGlobal: any;
    @Getter('durationTime') private durationTime: any;
    @Mutation('SET_SELECTED_SERVICE') private SET_SELECTED_SERVICE: any;
    @Mutation('SET_SELECTED_ENDPOINT') private SET_SELECTED_ENDPOINT: any;
    @Mutation('SET_SELECTED_INSTANCE') private SET_SELECTED_INSTANCE: any;
    @Mutation('SET_LOG_TEST_FIELDS') private SET_LOG_TEST_FIELDS: any;
    @Mutation('SET_DSL') private SET_DSL: any;
    @Action('GET_LOG_ANA_ENDPOINTS') private GET_LOG_ANA_ENDPOINTS: any;
    @Action('GET_LOG_ANA_INSTANCES') private GET_LOG_ANA_INSTANCES: any;
    @Action('LOG_ANA_QUERY') private LOG_ANA_QUERY: any;

    private logTestConstants = LogTestConstants;
    private time!: Date;
    private clearAllTags: boolean = false;
    private logContent: string = '';
    private traceID: string = '';
    private segmentID: string = '';
    private spanID: string = '';
    private dslContent: string = '';

    private created() {
      this.time = this.rocketbotGlobal.durationRow.start;
    }

    private changeLogAnaOptions(type: string, item: Option) {
      if (type === this.logTestConstants.Body) {
        const val = {
          content: this.logContent,
        };
        this.SET_LOG_TEST_FIELDS({ label: type, key: val });
        return;
      }
      if (type === this.logTestConstants.TraceContext) {
        const val = {
          traceId: this.traceID,
          traceSegmentId: this.segmentID,
          spanId: this.spanID,
        };
        this.SET_LOG_TEST_FIELDS({ label: type, key: val });
        return;
      }
      if (type === this.logTestConstants.DSL) {
        this.SET_DSL(this.dslContent);
        return;
      }
      if (type === this.logTestConstants.Service) {
        this.SET_SELECTED_SERVICE(item);
        this.GET_LOG_ANA_INSTANCES({ duration: this.durationTime });
        this.GET_LOG_ANA_ENDPOINTS({ duration: this.durationTime });
      }
      if (type === this.logTestConstants.ServiceInstance) {
        this.SET_SELECTED_INSTANCE(item);
      }
      if (type === this.logTestConstants.Endpoint) {
        this.SET_SELECTED_ENDPOINT(item);
      }
      this.SET_LOG_TEST_FIELDS({ label: type, key: item.label });
    }

    private updateTags(data: { tagsMap: Array<{ key: string; value: string }>; tagsList: string[] }) {
      this.SET_LOG_TEST_FIELDS({ label: this.logTestConstants.Tags, key: data.tagsMap });
    }

    private logAnalysis() {
      this.SET_LOG_TEST_FIELDS({ label: this.logTestConstants.Timestamp, key: this.time.getTime() });
      this.LOG_ANA_QUERY();
    }

    @Watch('rocketLog.conditions')
    private clearTags() {
      if (!this.logState.conditions.tags) {
        this.clearAllTags = true;
      }
    }
  }
</script>
<style lang="scss" scoped>
  input,
  textarea {
    border: 1px solid #ccc;
    width: 100%;
    display: block;
    margin-bottom: 6px;
  }
  .logDataBody {
    margin-top: 5px;
  }
  .log-ana-btn {
    display: block;
    color: #fff;
    width: 150px;
    line-height: 30px;
    text-align: center;
    background-color: #484b55;
    border-radius: 4px;
    margin-top: 10px;
    &.bg-blue {
      background-color: #448dfe;
    }
  }
</style>
