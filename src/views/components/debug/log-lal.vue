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
  <div class="log-lal">
    <div class="lal-conditions">
      <div class="flex-v">
        <div>
          <label>{{ $t('service') }}<b class="require"> *</b></label>
          <RkSelect
            class="mb-5"
            :current="rocketLogLAL.selectedService"
            :data="rocketLogLAL.services"
            @onChoose="(item) => changeLogAnaOptions(logTestConstants.Service, item)"
          />
        </div>
        <div>
          <label>{{ $t('serviceinstance') }}</label>
          <RkSelect
            class="mb-5"
            :current="rocketLogLAL.selectedInstance"
            :data="rocketLogLAL.instances"
            @onChoose="(item) => changeLogAnaOptions(logTestConstants.ServiceInstance, item)"
          />
        </div>
        <div>
          <label>{{ $t('endpoint') }}</label>
          <RkSelect
            class="mb-5"
            :current="rocketLogLAL.selectedEndpoint"
            :data="rocketLogLAL.endpoints"
            @onChoose="(item) => changeLogAnaOptions(logTestConstants.Endpoint, item)"
          />
        </div>
        <div>
          <label>{{ $t('time') }}<b class="require"> *</b></label>
          <div>
            <span>
              <RkDate class="sm" v-model="time" position="right" format="YYYY-MM-DD HH:mm:ss" />
            </span>
          </div>
        </div>
        <div>
          <label>{{ $t('tags') }}</label>
          <ConditionTags :theme="'light'" :clearTags="false" @updateTags="updateTags" />
        </div>
        <div>
          <label>{{ $t('logContentType') }}</label>
          <RkSelect
            class="mb-5"
            :current="currentType"
            :data="typeList"
            @onChoose="(item) => changeLogAnaOptions(logTestConstants.Type, item)"
          />
        </div>
        <div class="logDataBody">
          <label>{{ $t('logDataBody') }}<b class="require"> *</b></label>
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
          <label>{{ $t('dsl') }}<b class="require"> *</b></label>
          <div ref="dslContent" id="dsl" contenteditable="true" />
        </div>
      </div>
    </div>
    <div class="log-analysis">
      <div class="error-tips">{{ errorCnt }}</div>
      <div class="log-ana-btn bg-blue" @click="logAnalysis">{{ isLoading ? $t('waitLoading') : $t('analysis') }}</div>
    </div>
    <div class="lal-resp">
      <div class="log-metrics">
        <label>{{ $t('metrics') }}</label>
        <ul>
          <li>
            <span v-for="item of logMetricsHeader" :class="item.value" :key="item.value">
              {{ $t(item.label) }}
            </span>
          </li>
          <li class="no-data" v-show="!rocketLogLAL.logTestResp.metrics.length">{{ $t('noData') }}</li>
          <li v-for="metric in rocketLogLAL.logTestResp.metrics" :key="metric.name">
            <span v-for="(item, index) of logMetricsHeader" :class="item.value" :key="item.value + index">
              <b v-if="item.value === 'tags'">
                <a v-for="t of metric.tags" :key="t.key">{{ `${t.key}=${t.value};` }} </a>
              </b>
              <b v-else-if="item.value === 'timestamp'">{{ metric[item.value] | dateformat }}</b>
              <b v-else>{{ metric[item.value] }}</b>
            </span>
          </li>
        </ul>
      </div>
      <div>
        <label class="log-detail">{{ $t('log') }}</label>
        <LogServiceDetailContent :currentLog="rocketLogLAL.logTestResp.log" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { State as rocketLogAnaState } from '@/store/modules/debug/log-lal';
  import { LogTestConstants, TypeList, LogMetricsHeader } from './debug-constant';
  import { Option } from '@/types/global';
  import { ConditionTags } from '../common/index';
  import LogServiceDetailContent from '../log/log-detail-content.vue';

  @Component({ components: { ConditionTags, LogServiceDetailContent } })
  export default class LogLAL extends Vue {
    @State('rocketDebugLAL') private rocketLogLAL!: rocketLogAnaState;
    @State('rocketbot') private rocketbotGlobal: any;
    @Getter('durationTime') private durationTime: any;
    @Mutation('SET_SELECTED_SERVICE') private SET_SELECTED_SERVICE: any;
    @Mutation('SET_SELECTED_ENDPOINT') private SET_SELECTED_ENDPOINT: any;
    @Mutation('SET_SELECTED_INSTANCE') private SET_SELECTED_INSTANCE: any;
    @Mutation('SET_LOG_TEST_FIELDS') private SET_LOG_TEST_FIELDS: any;
    @Mutation('SET_DSL') private SET_DSL: any;
    @Mutation('SET_LOG_TEST_RESPONSE') private SET_LOG_TEST_RESPONSE: any;
    @Action('GET_LOG_ANA_ENDPOINTS') private GET_LOG_ANA_ENDPOINTS: any;
    @Action('GET_LOG_ANA_INSTANCES') private GET_LOG_ANA_INSTANCES: any;
    @Action('LOG_ANA_QUERY') private LOG_ANA_QUERY: any;
    @Action('GET_LOG_ANA_SERVICES') private GET_LOG_ANA_SERVICES: any;

    private logTestConstants = LogTestConstants;
    private time!: Date;
    private logContent: string = '';
    private traceID: string = '';
    private segmentID: string = '';
    private spanID: string = '';
    private typeList = TypeList;
    private logMetricsHeader = LogMetricsHeader;
    private currentType = {
      label: 'Text',
      value: 'text',
    };
    private logRespContent: string = '';
    private showLALResp: boolean = false;
    private isLoading: boolean = false;
    private monacoInstance: any;
    private errorCnt: string = '';

    private created() {
      this.time = this.rocketbotGlobal.durationRow.start;
      this.GET_LOG_ANA_SERVICES({ duration: this.durationTime }).then(() => {
        this.GET_LOG_ANA_INSTANCES({ duration: this.durationTime });
        this.GET_LOG_ANA_ENDPOINTS({ duration: this.durationTime });
      });
    }

    private mounted() {
      import('monaco-editor/esm/vs/editor/editor.main.js').then((monaco) => {
        this.monacoInstanceGen(monaco);
      });
    }

    private monacoInstanceGen(monaco: any) {
      this.monacoInstance = monaco.editor.create(this.$refs.dslContent, {
        value: '',
        language: 'java',
      });
      this.monacoInstance.onDidChangeModelContent((event: any) => {
        this.SET_DSL(this.monacoInstance.getValue());
      });
    }

    private changeLogAnaOptions(type: string, item: Option | any) {
      if (type === this.logTestConstants.Body) {
        const contentType = this.typeList.filter(
          (d: { value: string; label: string }) => d.value === this.currentType.value,
        )[0];
        const val = {
          [contentType.value]: { [contentType.value]: this.logContent },
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
      if (type === this.logTestConstants.Type) {
        this.currentType = { value: item.key, label: item.label };
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
      this.SET_LOG_TEST_FIELDS({ label: this.logTestConstants.Tags, key: { data: data.tagsMap } });
    }

    private logAnalysis() {
      this.SET_LOG_TEST_RESPONSE({ log: {}, metrics: [] });
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.SET_LOG_TEST_FIELDS({ label: this.logTestConstants.Timestamp, key: this.time.getTime() });
      if (!this.rocketLogLAL.dsl) {
        this.isLoading = false;
        this.errorCnt = this.$t('dslEmpty') as string;
        return;
      }
      if (!this.rocketLogLAL.logTestFields.body) {
        this.isLoading = false;
        this.errorCnt = this.$t('logContentEmpty') as string;
        return;
      }
      this.LOG_ANA_QUERY().then(() => {
        this.showLALResp = true;
        this.isLoading = false;
      });
    }

    private unmounted() {
      this.monacoInstance.dispose();
    }
  }
</script>
<style lang="scss" scoped>
  .log-lal {
    overflow: auto;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  .lal-resp {
    height: 1026px;
    margin: 10px;
  }
  .lal-conditions,
  .lal-resp {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
  }
  .lal-conditions {
    margin: 10px 10px 20px;
  }
  .log-analysis {
    align-self: center;
  }
  input,
  textarea {
    border: 1px solid #ccc;
    width: 100%;
    display: block;
    margin-bottom: 6px;
    outline: none;
  }
  .logDataBody {
    margin-top: 5px;
    textarea {
      height: 200px;
    }
  }
  .log-ana-btn {
    color: #fff;
    width: 150px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    &.bg-blue {
      background-color: #448dfe;
    }
  }
  .logRespContent {
    height: 300px;
  }
  ul {
    max-height: 200px;
    min-height: 100px;
    overflow: auto;
    margin: 5px 0;
    .tags {
      width: 40%;
    }
  }
  li {
    span {
      width: 20%;
      line-height: 20px;
      text-align: center;
      display: inline-block;
      border-bottom: 1px solid #ccc;
    }
  }
  .no-data {
    text-align: center;
  }
  #dsl {
    height: 300px;
    width: 100%;
    border: 1px solid #ccc;
    outline: none;
  }
  b {
    font-weight: normal;
  }
  textarea {
    padding: 5px;
  }
  .log-detail {
    margin-bottom: 10px;
  }
  .require,
  .error-tips {
    color: red;
  }
  .error-tips {
    margin-bottom: 20px;
  }
  label {
    font-size: 14px;
    font-weight: bold;
  }
</style>
