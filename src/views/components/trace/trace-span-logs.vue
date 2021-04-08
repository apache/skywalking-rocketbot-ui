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
    <div class="rk-trace-detail">
      <h5 class="mb-15">{{ $t('tags') }}.</h5>
      <div class="mb-10 clear">
        <span class="g-sm-4 grey">{{ $t('service') }}:</span>
        <span class="g-sm-8 wba">{{ this.currentSpan.serviceCode }}</span>
      </div>
      <div class="mb-10 clear">
        <span class="g-sm-4 grey">{{ $t('serviceinstance') }}:</span>
        <span class="g-sm-8 wba">{{ this.currentSpan.serviceInstanceName }}</span>
      </div>
      <div class="mb-10 clear">
        <span class="g-sm-4 grey">{{ $t('endpoint') }}:</span>
        <span class="g-sm-8 wba">{{ this.currentSpan.label }}</span>
      </div>
      <div class="mb-10 clear">
        <span class="g-sm-4 grey">{{ $t('spanType') }}:</span>
        <span class="g-sm-8 wba">{{ this.currentSpan.type }}</span>
      </div>
      <div class="mb-10 clear">
        <span class="g-sm-4 grey">{{ $t('component') }}:</span>
        <span class="g-sm-8 wba">{{ this.currentSpan.component }}</span>
      </div>
      <div class="mb-10 clear">
        <span class="g-sm-4 grey">Peer:</span>
        <span class="g-sm-8 wba">{{ this.currentSpan.peer || 'No Peer' }}</span>
      </div>
      <div class="mb-10 clear">
        <span class="g-sm-4 grey">{{ $t('error') }}:</span>
        <span class="g-sm-8 wba">{{ this.currentSpan.isError }}</span>
      </div>
      <div class="mb-10 clear" v-for="i in this.currentSpan.tags" :key="i.key">
        <span class="g-sm-4 grey">{{ i.key }}:</span>
        <span class="g-sm-8 wba">
          {{ i.value }}
          <svg v-if="i.key === 'db.statement'" class="icon vm grey link-hover cp ml-5" @click="copy(i.value)">
            <use xlink:href="#review-list"></use>
          </svg>
        </span>
      </div>
      <h5 class="mb-10" v-if="this.currentSpan.logs" v-show="this.currentSpan.logs.length">{{ $t('logs') }}.</h5>
      <div v-for="(i, index) in this.currentSpan.logs" :key="index">
        <div class="mb-10 sm">
          <span class="mr-10">{{ $t('time') }}:</span><span class="grey">{{ i.time | dateformat }}</span>
        </div>
        <div class="mb-15 clear" v-for="(_i, _index) in i.data" :key="_index">
          <div class="mb-10">
            {{ _i.key }}:<span
              v-if="_i.key === 'stack'"
              class="r rk-sidebox-magnify"
              @click="showCurrentSpanDetail(_i.key, _i.value)"
            >
              <svg class="icon">
                <use xlink:href="#magnify"></use>
              </svg>
            </span>
          </div>
          <pre class="pl-15 mt-0 mb-0 sm oa">{{ _i.value }}</pre>
        </div>
      </div>
      <div @click="getTaceLogs()">
        <a class="rk-popup-btn bg-blue r">
          <span class="mr-5 vm">
            {{ $t('relatedTraceLogs') }}
          </span>
        </a>
      </div>
    </div>
    <rk-sidebox :width="'100%'" :show.sync="showRelatedLogs" :title="$t('relatedTraceLogs')">
      <div>
        <RkPage
          :currentSize="pageSize"
          :currentPage="pageNum"
          @changePage="turnPage"
          :total="rocketTrace.traceSpanLogsTotal"
        />
        <LogServiceDetail :data="rocketTrace.traceSpanLogs || []" :loading="false" :noLink="true" />
      </div>
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import LogServiceDetail from '../log/log-service-detail.vue';
  import { Action, State } from 'vuex-class';
  import copy from '@/utils/copy';
  import { State as traceState } from '@/store/modules/trace/index';

  @Component({
    components: { LogServiceDetail },
  })
  export default class TraceSpanLogs extends Vue {
    @State('rocketTrace') private rocketTrace!: traceState;
    @Action('rocketTrace/GET_TRACE_SPAN_LOGS') private GET_TRACE_SPAN_LOGS: any;
    @Prop() private currentSpan: any;
    private showRelatedLogs: boolean = false;
    private copy = copy;
    private pageNum: number = 1;
    private pageSize: number = 10;

    private getTaceLogs() {
      this.showRelatedLogs = true;
      this.GET_TRACE_SPAN_LOGS({
        condition: {
          relatedTrace: {
            traceId: this.currentSpan.traceId,
            segmentId: this.currentSpan.segmentId,
            spanId: this.currentSpan.spanId,
          },
          paging: { pageNum: this.pageNum, pageSize: this.pageSize, needTotal: true },
        },
      });
    }
    private turnPage(pageNum: number) {
      this.pageNum = pageNum;
      this.getTaceLogs();
    }
    private showCurrentSpanDetail(title: string, text: string) {
      const textLineNumber = text.split('\n').length;
      let textHeight = textLineNumber * 20.2 + 10;
      const tmpHeight = window.innerHeight * 0.9;
      textHeight = textHeight >= tmpHeight ? tmpHeight : textHeight;
      this.$modal.show('dialog', {
        title,
        text: `<div style="height:${textHeight}px">${text}</div>`,
        buttons: [
          {
            title: 'Copy',
            handler: () => {
              this.copy(text);
            },
          },
          {
            title: 'Close',
          },
        ],
      });
    }
  }
</script>
