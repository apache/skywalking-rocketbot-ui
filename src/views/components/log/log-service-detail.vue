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
  <div class="log-detail-chart-table">
    <div class="rk-log-t-loading" v-show="loading">
      <svg class="icon loading">
        <use xlink:href="#spinner"></use>
      </svg>
    </div>
    <LogTable :tableData="data" :type="`service`" :noLink="noLink">
      <div class="log-tips" v-if="!data.length">{{ $t('noData') }}</div>
    </LogTable>
    <rk-sidebox :width="'800px'" :show.sync="showDetail" :title="$t('logDetail')">
      <div class="rk-log-detail">
        <div class="mb-10 clear rk-flex" v-for="(item, index) in columns" :key="index">
          <template>
            <span class="g-sm-4 grey">{{ $t(item.value) }}:</span>
            <span v-if="item.label === 'timestamp'" class="g-sm-8">{{ currentLog[item.label] | dateformat }}</span>
            <textarea class="content" readonly="readonly" v-else-if="item.label === 'content'" v-model="logContent" />
            <span v-else-if="item.label === 'tags'" class="g-sm-8">
              <div v-for="(d, index) in logTags" :key="index">{{ d }}</div>
            </span>
            <span v-else class="g-sm-8">{{ currentLog[item.label] }}</span>
          </template>
        </div>
      </div>
    </rk-sidebox>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import LogTable from './log-table/log-table.vue';
  import { ServiceLogDetail } from './log-table/log-constant';
  import { formatJson } from '../../../utils/formatJson';

  @Component({
    components: { LogTable },
  })
  export default class LogServiceDetail extends Vue {
    @Prop() private data: any;
    @Prop() private loading!: true;
    @Prop() private noLink!: boolean;

    private columns = ServiceLogDetail;
    private showDetail: boolean = false;
    private list = [];
    private currentLog: any = {};
    private logContent: string = '';
    private logTags: string = '';

    private handleSelectLog(data: any[]) {
      this.currentLog = data;
      this.logTags = this.currentLog.tags.map((d: { key: string; value: string }) => {
        return `${d.key} = ${d.value}`;
      });
      if (this.currentLog.contentType === 'JSON') {
        this.logContent = formatJson(JSON.parse(this.currentLog.content));
      } else {
        this.logContent = this.currentLog.content;
      }
      this.showDetail = true;
    }
    @Watch('data')
    private bindSelect() {
      this.$eventBus.$on('HANDLE-SELECT-LOG', this, this.handleSelectLog);
    }
  }
</script>
<style lang="scss" scoped>
  .rk-log-t-loading {
    text-align: center;
    position: absolute;
    width: 100%;
    height: 70px;
    margin-top: 40px;
    line-height: 88px;
    overflow: hidden;
    .icon {
      width: 30px;
      height: 30px;
    }
  }
  .dialog-c-text {
    white-space: pre;
    overflow: auto;
    font-family: monospace;
  }
  .log-tips {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
  .rk-flex {
    display: flex;
  }
  .g-sm-4.grey {
    flex-shrink: 0;
  }
  .content {
    width: 500px;
    height: 500px;
    border: none;
    outline: none;
    color: #3d444f;
  }
</style>
