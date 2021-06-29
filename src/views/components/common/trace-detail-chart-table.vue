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
  <div class="trace-detail-chart-table">
    <div class="rk-trace-t-loading" v-show="loading">
      <svg class="icon loading">
        <use xlink:href="#spinner"></use>
      </svg>
    </div>
    <TraceContainer :tableData="tableData" :type="HeaderType">
      <div class="trace-tips" v-if="!tableData.length">{{ $t('noData') }}</div>
    </TraceContainer>
    <rk-sidebox :width="'50%'" :show.sync="showDetail" :title="$t('spanInfo')">
      <TraceSpanLogs :currentSpan="currentSpan" />
    </rk-sidebox>
  </div>
</template>
<style lang="scss">
  .rk-tooltip-popper.trace-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
  .trace-detail-chart-table {
    position: relative;
    min-height: 300px;
    border-bottom: 1px solid #ccc;
  }
</style>

<script lang="js">
  import copy from '@/utils/copy';
  import TraceContainer from './trace-chart-table/trace-container';
  import TraceUtil from '../trace/trace-util';
  import TraceSpanLogs from '../trace/trace-span-logs.vue';

  export default {
    components: {
      TraceContainer,
      TraceSpanLogs,
    },
    props: ['data', 'traceId', 'showBtnDetail', 'HeaderType'],
    watch: {
      data(val, oldVal) {
        if (!this.data.length) {
          this.tableData = [];
          return;
        }
        this.tableData = this.formatData(TraceUtil.changeTree(this.data, this.traceId));
        this.loading = false;
      },
    },
    data() {
      return {
        tableData: [],
        diaplay: true,
        // segmentId: [],
        showDetail: false,
        list: [],
        currentSpan: [],
        loading: true,
      };
    },
    methods: {
      copy,
      // 给增加层级关系
      formatData(arr, level = 1, totalExec = null) {
        for (const item of arr) {
          item.level = level;
          totalExec = totalExec || (item.endTime - item.startTime);
          item.totalExec = totalExec;
          if (item.children && item.children.length > 0) {
            this.formatData(item.children, level + 1, totalExec);
          }
        }
        return arr;
      },
      handleSelectSpan(data) {
        this.currentSpan = data;
        if (!this.showBtnDetail) {
          this.showDetail = true;
        }
        this.$emit('selectSpan', data);
      },
      showCurrentSpanDetail(title, text) {
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
      },
      handleViewSpan(data) {
        this.showDetail = true;
      },
    },
    created() {
      this.loading = true;
    },
    mounted() {
      this.tableData = this.formatData(TraceUtil.changeTree(this.data, this.traceId));
      this.loading = false;
      this.$eventBus.$on('HANDLE-SELECT-SPAN', this, this.handleSelectSpan);
      this.$eventBus.$on('HANDLE-VIEW-SPAN', this, this.handleViewSpan);
      this.$eventBus.$on('TRACE-TABLE-LOADING', this, () => { this.loading = true; });
    },
  };
</script>
<style>
  .dialog-c-text {
    white-space: pre;
    overflow: auto;
    font-family: monospace;
  }
  .trace-tips {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
</style>
