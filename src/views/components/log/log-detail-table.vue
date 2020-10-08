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
    <LogTable :tableData="data" :type="`browser`">
      <div class="trace-tips" v-if="!data.length">{{ $t('noData') }}</div>
    </LogTable>
    <rk-sidebox :width="'50%'" :show.sync="showDetail" :title="$t('logDetail')">
      <div class="rk-trace-detail">
        <div class="mb-10 clear rk-flex" v-for="(value, name) in this.currentSpan">
          <template>
            <span class="g-sm-4 grey">{{ $t(name) }}:</span>
            <span v-if="name === 'message'" class="text" v-html="lineBreak(value)"></span>
            <span v-else-if="name === 'time'" class="g-sm-8 wba">{{ value | dateformat }}</span>
            <span v-else class="g-sm-8 wba">{{ value }}</span>
          </template>
        </div>
      </div>
    </rk-sidebox>

    <v-dialog width="90%" />
  </div>
</template>
<style lang="scss">
  .rk-tooltip-popper.trace-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
  .trace-detail-chart-table {
    position: relative;
    min-height: 300px;
    border-bottom: none;
  }
</style>

<script lang="js">
  import LogTable from './log-table/log-table.vue';
  /* eslint-disable */
  /* tslint:disable */
  export default {
    components: {
      LogTable,
    },
    props: ['data', 'traceId', 'showBtnDetail', 'HeaderType'],
    watch: {
    },
    computed:{

    },
    data() {
      return {
        diaplay: true,
        // segmentId: [],
        showDetail: false,
        list: [],
        currentSpan: {},
        loading: true,
      };
    },
    methods: {
      lineBreak(str = '') {
        let s = str
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br />')
                .replace(/\r\n/g, '<br />');
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
      this.loading = true;
    },
    mounted() {
      this.loading = false;
      this.$eventBus.$on('HANDLE-SELECT-SPAN', this, this.handleSelectSpan);
      this.$eventBus.$on('HANDLE-VIEW-SPAN', this, this.handleViewSpan);
      this.$eventBus.$on('TRACE-TABLE-LOADING', this, ()=>{ this.loading = true });
    },
  };
</script>
<style lang="scss" scoped>
  .rk-trace-t-loading {
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
  .trace-tips {
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
