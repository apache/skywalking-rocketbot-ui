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
  <nav class="rk-event-tool flex-h">
    <div class="flex-h event-selector">
      <CommonSelector
        :hasSearch="true"
        :title="$t('currentService')"
        @input="selectService"
        :value="rocketOption.currentService"
        :data="rocketOption.services"
        icon="package"
      />
      <CommonSelector
        :hasSearch="true"
        :title="$t('currentInstance')"
        :value="rocketOption.currentInstance"
        :data="rocketOption.instances"
        @input="selectInstance"
        icon="disk"
      />
      <CommonSelector
        :hasSearch="true"
        :title="$t('currentEndpoint')"
        @input="selectEndpoint"
        :value="rocketOption.currentEndpoint"
        :data="rocketOption.endpoints"
        icon="code"
      />
      <CommonSelector
        :title="$t('eventsType')"
        :value="eventType"
        @input="chooseStatus"
        :data="[
          { label: 'All', key: '' },
          { label: 'Normal', key: 'Normal' },
          { label: 'Error', key: 'Error' },
        ]"
        icon="equalizer"
      />
    </div>
    <div class="flex-h rk-right">
      <a class="rk-event-search-btn bg-blue" @click="queryEvents">
        <rk-icon icon="search" class="mr-5" />
        <span class="vm">{{ $t('search') }}</span>
      </a>
      <RkPage :currentSize="pageSize" :currentPage="pageNum" @changePage="updatePage" :total="rocketEvent.totalSize" />
    </div>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import { Option, DurationTime } from '@/types/global';
  import { CommonSelector } from '../common/index';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as EventState } from '@/store/modules/event';
  import { PageTypes } from '@/constants/constant';

  @Component({ components: { CommonSelector } })
  export default class EventSearch extends Vue {
    @Action('SELECT_SERVICE') private SELECT_SERVICE: any;
    @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Getter('durationTime') private durationTime!: DurationTime;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @State('rocketOption') private rocketOption!: optionState;
    @State('rocketEvent') private rocketEvent!: EventState;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('FETCH_EVENTS') private FETCH_EVENTS: any;

    private eventType: Option = { label: 'All', key: '' };
    private pageSize: number = 20;
    private pageNum: number = 1;

    private beforeMount() {
      this.MIXHANDLE_GET_OPTION({
        compType: 'service',
        duration: this.durationTime,
        pageType: PageTypes.EVENT,
      }).then(() => {
        this.queryEvents();
      });
      this.SET_EVENTS([
        () => {
          this.queryEvents();
        },
      ]);
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

    private chooseStatus(i: Option) {
      this.eventType = i;
    }

    private updatePage(pageNum: string) {
      this.pageNum = Number(pageNum);
      this.queryEvents();
    }

    private queryEvents() {
      const { currentService, currentEndpoint, currentInstance } = this.rocketOption;

      this.FETCH_EVENTS({
        condition: {
          time: this.durationTime,
          paging: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            needTotal: true,
          },
          source: {
            service: currentService.key ? currentService.label : '',
            endpoint: currentEndpoint.key ? currentEndpoint.label : '',
            serviceInstance: currentInstance.key ? currentInstance.label : '',
          },
          type: this.eventType.key || undefined,
        },
      });
    }
    private beforeDestroy() {
      this.SET_EVENTS([]);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-event-tool {
    flex-shrink: 0;
    background-color: #333840;
    color: #eee;
    width: 100%;
    height: 52px;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .event-selector {
    height: 52px;
  }
  .rk-event-search-btn {
    padding: 2px 9px;
    background-color: #484b55;
    border-radius: 4px;
    margin-right: 20px;
    &.bg-blue {
      background-color: #448dfe;
    }
  }
  .rk-event-tool-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
  }
  .event-conditions {
    height: 100%;
  }
</style>
