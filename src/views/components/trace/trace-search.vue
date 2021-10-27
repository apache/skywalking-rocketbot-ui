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
  <div class="rk-trace-search">
    <div>
      <a class="rk-trace-clear-btn r" @click="status = !status">
        <span class="mr-5 vm">{{ $t('more') }}</span>
        <svg class="icon trans vm" :style="`transform: rotate(${status ? 180 : 0}deg);`">
          <use xlink:href="#arrow-down"></use>
        </svg>
      </a>
      <a class="rk-trace-search-btn bg-blue r mr-10" @click="getTraceList">
        <svg class="icon mr-5 vm">
          <use xlink:href="#search"></use>
        </svg>
        <span class="vm">{{ $t('search') }}</span>
      </a>
      <a class="rk-trace-clear-btn r mr-10" @click="clearSearch">
        <svg class="icon mr-5 vm">
          <use xlink:href="#clear"></use>
        </svg>
        <span class="vm">{{ $t('clear') }}</span>
      </a>
      <div class="flex-h trace-select">
        <CommonSelector
          :hasSearch="true"
          :title="$t('service')"
          :value="service"
          @input="chooseService"
          :data="rocketTrace.services"
          icon="package"
        />
        <CommonSelector
          :hasSearch="true"
          :title="$t('instance')"
          v-model="instance"
          :data="rocketTrace.instances"
          icon="disk"
        />
        <CommonSelector
          :hasSearch="true"
          :title="$t('endpoint')"
          :value="endpoint"
          @input="chooseEndpoint"
          @search="searchEndpoint"
          :data="rocketTrace.endpoints"
          icon="code"
        />
        <CommonSelector
          :title="$t('status')"
          :value="traceState"
          @input="chooseStatus"
          :data="[
            { label: 'All', key: 'ALL' },
            { label: 'Success', key: 'SUCCESS' },
            { label: 'Error', key: 'ERROR' },
          ]"
          icon="epic"
        />
      </div>
    </div>
    <div class="rk-trace-search-more" v-show="status">
      <div class="flex-h">
        <div class="mr-15">
          <span class="sm b grey mr-10">{{ $t('traceID') }}:</span>
          <input type="text" v-model="traceId" class="rk-trace-search-input dib" />
        </div>
        <div class="mr-15">
          <span class="sm b grey mr-10">{{ $t('duration') }}:</span>
          <div class="rk-trace-search-range dib">
            <input class="vm tc" v-model="minTraceDuration" />
            <span class="grey vm">-</span>
            <input class="vm tc" v-model="maxTraceDuration" />
          </div>
        </div>
        <div>
          <span class="sm b grey mr-5">{{ $t('timeRange') }}:</span>
          <RkDate class="sm" v-model="time" position="bottom" format="YYYY-MM-DD HH:mm" />
        </div>
      </div>
      <ConditionTags :type="'TRACE'" :clearTags="clearTags" @updateTags="updateTags" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { ConditionTags, CommonSelector } from '../common/index';
  import { State as traceState } from '@/store/modules/trace/index';
  import { State as globalState } from '@/store/modules/global/index';
  import dateFormatStep from '@/utils/dateFormat';
  import getLocalTime from '@/utils/localtime';
  @Component({ components: { CommonSelector, ConditionTags } })
  export default class TraceSearch extends Vue {
    @State('rocketbot') private rocketbotGlobal!: globalState;
    @State('rocketTrace') private rocketTrace!: traceState;
    @Getter('durationTime') private durationTime: any;
    @Getter('duration') private duration: any;
    @Action('RESET_DURATION') private RESET_DURATION: any;
    @Action('rocketTrace/GET_SERVICES') private GET_SERVICES: any;
    @Action('rocketTrace/GET_INSTANCES') private GET_INSTANCES: any;
    @Action('rocketTrace/GET_ITEM_ENDPOINTS') private GET_ITEM_ENDPOINTS: any;
    @Action('rocketTrace/GET_TRACELIST') private GET_TRACELIST: any;
    @Action('rocketTrace/SET_TRACE_FORM') private SET_TRACE_FORM: any;
    @Mutation('rocketTrace/SET_TRACE_FORM_ITEM')
    private SET_TRACE_FORM_ITEM: any;
    @Mutation('rocketTrace/SET_INSTANCES') private SET_INSTANCES: any;
    @Mutation('rocketTrace/SET_ENDPOINTS') private SET_ENDPOINTS: any;
    private service: Option = { label: 'All', key: '' };
    private time!: Date[];
    private status: boolean = true;
    private maxTraceDuration: string = localStorage.getItem('maxTraceDuration') || '';
    private minTraceDuration: string = localStorage.getItem('minTraceDuration') || '';
    private instance: Option = { label: 'All', key: '' };
    private endpoint: Option = { label: 'All', key: '' };
    private traceId: string = localStorage.getItem('traceId') || '';
    private traceState: Option = { label: 'All', key: 'ALL' };
    private tagsMap: Array<{ key: string; value: string }> = [];
    private tagsList: string[] = [];
    private clearTags: boolean = false;
    private serviceName: string = '';

    private created() {
      this.traceId = this.$route.query.traceid ? this.$route.query.traceid.toString() : this.traceId;
      this.serviceName = this.$route.query.service ? this.$route.query.service.toString() : this.serviceName;
      this.time = [this.rocketbotGlobal.durationRow.start, this.rocketbotGlobal.durationRow.end];
    }
    private mounted() {
      this.GET_SERVICES({ duration: this.durationTime }).then(() => {
        if (this.serviceName) {
          for (const s of this.rocketTrace.services) {
            if (s.label === this.serviceName) {
              this.service = s;
              break;
            }
          }
        }
        this.getTraceList();
        if (this.service && this.service.key) {
          this.getInstance();
        }
      });
    }
    private getInstance(serviceId?: string) {
      this.GET_INSTANCES({
        duration: this.durationTime,
        serviceId: serviceId || this.service.key,
      });
    }
    private globalTimeFormat(time: Date[]) {
      const step = 'SECOND';

      return {
        start: dateFormatStep(time[0], step, false),
        end: dateFormatStep(time[1], step, false),
        step,
      };
    }
    private chooseService(i: Option) {
      if (this.service.key === i.key) {
        return;
      }
      this.instance = { label: 'All', key: '' };
      this.endpoint = { label: 'All', key: '' };
      this.service = i;
      if (i.key === '') {
        this.SET_INSTANCES([]);
        this.SET_ENDPOINTS([]);
        return;
      }
      this.getInstance(i.key);
      this.SET_ENDPOINTS([]);
      this.getItemEndpoints(i.key, '');
    }
    private searchEndpoint(search: string) {
      this.getItemEndpoints(this.service.key, search);
    }
    private getItemEndpoints(serviceId: string, keyword?: string) {
      this.GET_ITEM_ENDPOINTS({
        serviceId,
        keyword,
        duration: this.durationTime,
      });
    }
    private chooseStatus(i: Option) {
      this.traceState = i;
    }
    private chooseEndpoint(i: Option) {
      this.endpoint = i;
    }
    private updateTags(data: { tagsMap: Array<{ key: string; value: string }>; tagsList: string[] }) {
      this.tagsList = data.tagsList;
      this.tagsMap = data.tagsMap;
    }
    private getTraceList() {
      const temp: any = {
        queryDuration: this.globalTimeFormat([
          getLocalTime(this.rocketbotGlobal.utc, this.time[0]),
          getLocalTime(this.rocketbotGlobal.utc, this.time[1]),
        ]),
        traceState: this.traceState.key,
        paging: { pageNum: 1, pageSize: 15, needTotal: true },
        queryOrder: this.rocketTrace.traceForm.queryOrder,
      };
      if (this.service.key) {
        temp.serviceId = this.service.key;
      }
      if (this.instance.key) {
        temp.serviceInstanceId = this.instance.key;
      }
      if (this.maxTraceDuration) {
        temp.maxTraceDuration = this.maxTraceDuration;
        localStorage.setItem('maxTraceDuration', this.maxTraceDuration);
      }
      if (this.minTraceDuration) {
        temp.minTraceDuration = this.minTraceDuration;
        localStorage.setItem('minTraceDuration', this.minTraceDuration);
      }
      if (this.endpoint.key) {
        temp.endpointId = this.endpoint.key;
      }
      if (this.traceId) {
        temp.traceId = this.traceId;
      }
      localStorage.setItem('traceId', this.traceId);
      temp.tags = this.tagsMap;
      localStorage.setItem('traceTags', JSON.stringify(this.tagsList));
      this.SET_TRACE_FORM(temp);
      this.$eventBus.$emit('SET_LOADING_TRUE', () => {
        this.GET_TRACELIST().then(() => {
          this.$eventBus.$emit('SET_LOADING_FALSE');
        });
      });
    }
    private clearSearch() {
      this.RESET_DURATION();
      this.status = true;
      this.maxTraceDuration = '';
      localStorage.removeItem('maxTraceDuration');
      this.minTraceDuration = '';
      localStorage.removeItem('minTraceDuration');
      this.service = { label: 'All', key: '' };
      this.instance = { label: 'All', key: '' };
      this.endpoint = { label: 'All', key: '' };
      localStorage.removeItem('traceTags');
      this.clearTags = true;
      this.tagsMap = [];
      this.tagsList = [];
      this.traceId = '';
      localStorage.removeItem('traceId');
      this.traceState = { label: 'All', key: 'ALL' };
      this.SET_TRACE_FORM_ITEM({ type: 'queryOrder', data: '' });
      this.GET_SERVICES({ duration: this.durationTime });
      this.getTraceList();
    }

    @Watch('rocketbotGlobal.durationRow')
    private durationRowWatch(value: Duration) {
      this.time = [value.start, value.end];
    }
  }
</script>

<style lang="scss">
  .trace-select {
    height: 52px;
  }
  .rk-trace-search {
    flex-shrink: 0;
    background-color: #333840;
    color: #eee;
    width: 100%;
    padding: 3px 15px 8px;
    .selected {
      display: inline-block;
      padding: 0 3px;
      border-radius: 3px;
      overflow: hidden;
      color: rgba(0, 0, 0, 0.65);
      border: 1px dashed #aaa;
      color: #eee;
      font-size: 12px;
      margin: 0 2px;
    }
    .remove-icon {
      display: inline-block;
      margin-left: 3px;
      cursor: pointer;
    }
  }
  .rk-trace-search-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
  }
  .rk-trace-new-tag {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
    width: 175px;
    margin-right: 3px;
  }
  .rk-trace-tags {
    padding: 1px 5px 0 0;
    border-radius: 3px;
    height: 24px;
    display: inline-block;
    vertical-align: top;
  }
  .rk-trace-search-range {
    border-radius: 3px;
    background-color: #fff;
    padding: 1px;
    border-radius: 3px;
    input {
      width: 38px;
      border-style: unset;
      outline: 0;
    }
  }
  .rk-trace-search-btn {
    padding: 3px 9px;
    background-color: #484b55;
    border-radius: 4px;
    color: #eee;
    font-weight: normal;
    cursor: pointer;
    &.bg-blue {
      background-color: #448dfe;
    }
  }
  .rk-trace-search-btn {
    margin-top: 12px;
  }
  .rk-trace-clear-btn {
    padding: 3px 9px;
    background-color: #484b55;
    border-radius: 4px;
    margin-top: 12px;
    &.bg-warning {
      background-color: #fbb03b;
    }
  }
  .rk-trace-search-more {
    background-color: #484b55;
    padding: 4px 10px;
    border-radius: 3px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    &:after {
      bottom: 100%;
      right: 30px;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(0, 0, 0, 0);
      border-bottom-color: #484b55;
      border-width: 8px;
      margin-right: 0px;
    }
  }
</style>
