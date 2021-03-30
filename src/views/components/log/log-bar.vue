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
          :title="$t('logCategory')"
          :current="logState.type"
          :data="logState.logCategories"
          icon="chart"
        />
        <ToolBarSelect
          @onChoose="selectService"
          :title="$t('service')"
          :current="rocketOption.currentService"
          :data="rocketOption.services"
          icon="package"
        />
        <ToolBarSelect
          @onChoose="selectInstance"
          :title="logState.type.key === cateGoryBrowser ? $t('version') : $t('currentInstance')"
          :current="rocketOption.currentInstance"
          :data="rocketOption.instances"
          icon="disk"
        />
        <ToolBarSelect
          @onChoose="selectEndpoint"
          :title="logState.type.key === cateGoryBrowser ? $t('page') : $t('currentEndpoint')"
          :current="rocketOption.currentEndpoint"
          :data="rocketOption.endpoints"
          icon="code"
        />
        <ToolBarSelect
          v-if="logState.type.key === cateGoryBrowser"
          @onChoose="SELECT_ERROR_CATALOG"
          :title="$t('errorCatalog')"
          :current="logState.category"
          :data="logState.categories"
          icon="epic"
        />
      </div>
      <span class="flex-h rk-right">
        <a class="rk-log-search-btn bg-blue mr-10" @click="openConditionsBox">
          <rk-icon icon="settings" class="mr-5" />
          <span class="vm">{{ $t('setConditions') }}</span>
        </a>
        <a class="rk-log-search-btn bg-blue mr-10" @click="queryLogs">
          <rk-icon icon="search" class="mr-5" />
          <span class="vm">{{ $t('search') }}</span>
        </a>
        <a class="rk-log-clear-btn r mr-10" @click="clearSearch">
          <rk-icon icon="clear" class="mr-5" />
          <span class="vm">{{ $t('clear') }}</span>
        </a>

        <RkPage :currentSize="pageSize" :currentPage="pageNum" @changePage="handleRefresh" :total="logState.total" />
      </span>
    </div>
    <div class="flex-h" v-show="showConditionsBox">
      <LogConditions />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import TraceSelect from '../common/trace-select.vue';
  import ToolBarSelect from '../dashboard/tool-bar/tool-bar-select.vue';
  import ToolBarEndpointSelect from '../dashboard/tool-bar/tool-bar-endpoint-select.vue';
  import LogConditions from './log-conditions.vue';
  import { State as logState } from '@/store/modules/log/index';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { PageTypes } from '@/constants/constant';

  @Component({
    components: { TraceSelect, ToolBarSelect, ToolBarEndpointSelect, LogConditions },
  })
  export default class Bar extends Vue {
    @State('rocketLog') private logState!: logState;
    @State('rocketOption') private rocketOption!: optionState;
    @Mutation('SELECT_LOG_TYPE') private SELECT_LOG_TYPE: any;
    @Mutation('SELECT_ERROR_CATALOG') private SELECT_ERROR_CATALOG: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Mutation('CLEAR_LOG_CONDITIONS') private CLEAR_LOG_CONDITIONS: any;
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
    private pageSize = 20;

    private beforeMount() {
      this.MIXHANDLE_GET_OPTION({
        compType: this.logState.type.key,
        duration: this.durationTime,
        pageType: PageTypes.LOG,
      })
        .then(() => {
          this.QUERY_LOGS_BYKEYWORDS();
        })
        .then(() => {
          this.queryLogs();
        });
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
        pageType: PageTypes.LOG,
      }).then(() => {
        this.queryLogs();
      });
    }

    private clearSearch() {
      this.SELECT_SERVICE({ service: { label: 'All', key: '' }, duration: this.durationTime });
      this.SELECT_ERROR_CATALOG({ label: 'All', key: 'ALL' });
      this.CLEAR_LOG_CONDITIONS();
      this.queryLogs();
    }

    private queryLogs() {
      const { category, conditions, type, supportQueryLogsByKeywords } = this.logState;
      const { currentService, currentInstance, currentEndpoint } = this.rocketOption;

      this.QUERY_LOGS({
        condition:
          type.key === this.cateGoryBrowser
            ? {
                serviceId: currentService.key,
                serviceVersionId: currentInstance.key,
                pagePathId: currentEndpoint.key,
                category: category.key,
                paging: { pageNum: this.pageNum, pageSize: this.pageSize, needTotal: true },
                queryDuration: conditions.date,
              }
            : {
                serviceId: currentService.key || undefined,
                serviceInstanceId: currentInstance.key || undefined,
                endpointId: currentEndpoint.key || undefined,
                keywordsOfContent:
                  supportQueryLogsByKeywords && conditions.keywordsOfContent ? conditions.keywordsOfContent : undefined,
                excludingKeywordsOfContent:
                  supportQueryLogsByKeywords && conditions.excludingKeywordsOfContent
                    ? conditions.excludingKeywordsOfContent
                    : undefined,
                relatedTrace: conditions.traceId ? { traceId: conditions.traceId } : undefined,
                tags: conditions.tags,
                paging: { pageNum: this.pageNum, pageSize: this.pageSize, needTotal: true },
                queryDuration: conditions.traceId ? undefined : conditions.date,
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
