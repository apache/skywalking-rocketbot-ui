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
  <div class="rk-log-nav">
    <div class="rk-error-log-bar flex-h">
      <div class="flex-h">
        <ToolBarSelect
          @onChoose="selectCategroy"
          :title="this.$t('logCategory')"
          :current="logState.type"
          :data="logState.logCategories"
          icon="chart"
        />
        <ToolBarSelect
          @onChoose="selectService"
          :title="this.$t('service')"
          :current="rocketOption.currentService"
          :data="rocketOption.services"
          icon="package"
        />
        <ToolBarSelect
          @onChoose="selectInstance"
          :title="logState.type.key === cateGoryBrowser ? this.$t('version') : this.$t('currentInstance')"
          :current="rocketOption.currentInstance"
          :data="rocketOption.instances"
          icon="disk"
        />
        <ToolBarSelect
          @onChoose="selectEndpoint"
          :title="logState.type.key === cateGoryBrowser ? this.$t('page') : this.$t('currentEndpoint')"
          :current="rocketOption.currentEndpoint"
          :data="rocketOption.endpoints"
          icon="code"
        />
        <ToolBarSelect
          @onChoose="SELECT_ERROR_CATALOG"
          :title="this.$t('errorCatalog')"
          :current="logState.category"
          :data="logState.categories"
          icon="epic"
        />
      </div>
      <span class="flex-h rk-right">
        <a
          class="rk-log-search-btn bg-blue mr-10"
          v-if="logState.type.key !== cateGoryBrowser"
          @click="openConditionsBox"
        >
          <rk-icon icon="settings" class="mr-5" />
          <span class="vm">{{ $t('setConditions') }}</span>
        </a>
        <a class="rk-log-search-btn bg-blue mr-10" @click="queryLogs">
          <rk-icon icon="search" class="mr-5" />
          <span class="vm">{{ this.$t('search') }}</span>
        </a>
        <a class="rk-log-clear-btn r mr-10" @click="clearSearch">
          <rk-icon icon="clear" class="mr-5" />
          <span class="vm">{{ this.$t('clear') }}</span>
        </a>

        <RkPage :currentSize="10" :currentPage="pageNum" @changePage="handleRefresh" :total="logState.total" />
      </span>
    </div>
    <div class="flex-h" v-show="showConditionsBox">
      <LogConditions />
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import TraceSelect from '../common/trace-select.vue';
  import ToolBarSelect from '../dashboard/tool-bar-select.vue';
  import ToolBarEndpointSelect from '../dashboard/tool-bar-endpoint-select.vue';
  import LogConditions from './log-conditions.vue';

  @Component({
    components: { TraceSelect, ToolBarSelect, ToolBarEndpointSelect, LogConditions },
  })
  export default class Bar extends Vue {
    @State('rocketLog') private logState: any;
    @State('rocketOption') private rocketOption: any;
    @Mutation('SELECT_LOG_TYPE') private SELECT_LOG_TYPE: any;
    @Mutation('SELECT_ERROR_CATALOG') private SELECT_ERROR_CATALOG: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Mutation('CLEAR_LOG_CONDITIONS') private CLEAR_LOG_CONDITIONS: any;
    @Mutation('SET_TAG_LIST') private SET_TAG_LIST: any;
    @Action('SELECT_SERVICE') private SELECT_SERVICE: any;
    @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('QUERY_LOGS') private QUERY_LOGS: any;
    @Action('QUERY_LOGS_BYKEYWORDS') private QUERY_LOGS_BYKEYWORDS: any;
    @Getter('durationTime') private durationTime: any;

    private pageNum: number = 1;
    private cateGoryBrowser = 'browser';
    private showConditionsBox = true;
    private logPage = 'Log';

    private beforeMount() {
      this.MIXHANDLE_GET_OPTION({
        compType: this.logState.type.key,
        duration: this.durationTime,
        pageType: this.logPage,
      })
        .then(() => {
          this.QUERY_LOGS_BYKEYWORDS();
        })
        .then(() => {
          this.queryLogs();
        });
      this.SET_EVENTS([
        () => {
          this.queryLogs();
        },
      ]);
    }

    private beforeDestroy() {
      this.SET_EVENTS([]);
    }

    private handleRefresh(pageNum: number) {
      this.pageNum = pageNum;
      this.queryLogs();
    }

    private selectService(i: { key: string; label: string }) {
      this.SELECT_SERVICE({ service: i, duration: this.durationTime });
    }

    private selectEndpoint(i: { key: string; label: string }) {
      this.SELECT_ENDPOINT({ endpoint: i, duration: this.durationTime });
    }

    private selectInstance(i: { key: string; label: string }) {
      this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
    }

    private selectCategroy(i: { key: string; label: string }) {
      this.SELECT_LOG_TYPE(i);
      this.MIXHANDLE_GET_OPTION({
        compType: i.key,
        duration: this.durationTime,
        pageType: this.logPage,
      }).then(() => {
        this.queryLogs();
      });
    }

    private clearSearch() {
      this.SELECT_SERVICE({ service: { label: 'All', key: '' }, duration: this.durationTime });
      this.SELECT_ERROR_CATALOG({ label: 'All', key: 'ALL' });
      this.CLEAR_LOG_CONDITIONS();
      this.queryLogs();
      window.localStorage.removeItem('logTags');
      this.SET_TAG_LIST([]);
    }

    private queryLogs() {
      const { category, conditions, type } = this.logState;
      const { currentService, currentInstance, currentEndpoint } = this.rocketOption;

      this.QUERY_LOGS({
        condition:
          type.key === this.cateGoryBrowser
            ? {
                serviceId: currentService.key,
                serviceVersionId: currentInstance.key,
                pagePathId: currentEndpoint.key,
                category: category.key,
                paging: { pageNum: this.pageNum, pageSize: 35, needTotal: true },
                queryDuration: this.durationTime,
              }
            : {
                serviceId: currentService.key || 0,
                serviceInstanceId: currentInstance.key || 0,
                endpointId: currentEndpoint.key || 0,
                state: category.key,
                excludingKeywordsOfContent: this.logState.supportQueryLogsByKeywords
                  ? (conditions.excludingKeywordsOfContent || '').split(',')
                  : undefined,
                keywordsOfContent: this.logState.supportQueryLogsByKeywords
                  ? (conditions.keywordsOfContent || '').split(',')
                  : undefined,
                relatedTrace: conditions.traceId ? { traceId: conditions.traceId } : undefined,
                tags: conditions.tags,
                paging: { pageNum: this.pageNum, pageSize: 35, needTotal: true },
                queryDuration: conditions.traceId ? undefined : this.durationTime,
              },
      });
    }

    private openConditionsBox() {
      this.showConditionsBox = !this.showConditionsBox;
    }
  }
</script>

<style scoped lang="scss">
  .rk-log-nav {
    width: 100%;
    background: #333840;
  }
  .rk-error-log-bar {
    flex-shrink: 0;
    background-color: #333840;
    color: #eee;
    width: 100%;
    height: 52px;
    justify-content: space-between;
  }

  .rk-right {
    min-width: 210px;
  }

  .rk-log-search-btn {
    padding: 3px 9px;
    background-color: #484b55;
    border-radius: 4px;
    &.bg-blue {
      background-color: #448dfe;
    }
  }
  .rk-log-clear-btn {
    padding: 3px 9px;
    background-color: #484b55;
    border-radius: 4px;
  }
  .log-condition-box {
    color: #333840;
  }
</style>
