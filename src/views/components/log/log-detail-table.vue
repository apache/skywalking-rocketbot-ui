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
    <LogTable :tableData="data" :type="`browser`">
      <div class="log-tips" v-if="!data.length">{{ $t('noData') }}</div>
    </LogTable>
    <rk-sidebox :width="'50%'" :show.sync="showDetail" :title="$t('logDetail')">
      <div class="rk-log-detail">
        <div class="mb-10 clear rk-flex" v-for="(item, index) in columns">
          <template>
            <span class="g-sm-4 grey">{{ $t(item.value) }}:</span>
            <span
              v-if="['message', 'stack'].includes(item.label)"
              class="text"
              v-html="lineBreak(currentSpan[item.label]) || '-'"
            ></span>
            <span v-else-if="item.label === 'time'" class="g-sm-8 wba">{{ currentSpan[item.label] | dateformat }}</span>
            <span v-else class="g-sm-8 wba">{{ currentSpan[item.label] || '-' }}</span>
          </template>
        </div>
      </div>
    </rk-sidebox>

    <v-dialog width="90%" />
  </div>
</template>
<style lang="scss">
  .rk-tooltip-popper.log-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
  .log-detail-chart-table {
    position: relative;
    min-height: 300px;
    border-bottom: none;
  }
</style>

<script lang="js">
  import LogTable from './log-table/log-table.vue';
  import { BrowserLogConstants } from './log-table/log-constant';
  /* eslint-disable */
  /* tslint:disable */
  export default {
    components: {
      LogTable,
    },
    props: ['data', 'loading', 'showBtnDetail'],
    watch: {
    },
    data() {
      return {
        diaplay: true,
        columns: BrowserLogConstants,
        showDetail: false,
        list: [],
        currentSpan: {},
      };
    },
    methods: {
      lineBreak(str = '') {
        let s = str
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\r\n/g, '<br />')
                .replace(/\n/g, '<br />');
        return s;
      },
      handleSelectSpan(data) {
        this.currentSpan = data;
        if (!this.showBtnDetail) {
          this.showDetail = true;
        }
        this.$emit('selectSpan', data);
      },
      handleViewSpan(data) {
        this.showDetail = true;
      }
    },
    created() {
    },
    mounted() {
      this.$eventBus.$on('HANDLE-SELECT-SPAN', this, this.handleSelectSpan);
      this.$eventBus.$on('HANDLE-VIEW-SPAN', this, this.handleViewSpan);
    },
  };
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
</style>
