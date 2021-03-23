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
      <div class="flex-h">
        <TraceSelect
          :hasSearch="true"
          :title="$t('service')"
          :value="service"
          @input="chooseService"
          :data="rocketTrace.services"
        />
        <TraceSelect :hasSearch="true" :title="$t('instance')" v-model="instance" :data="rocketTrace.instances" />
        <TraceSelect
          :title="$t('status')"
          :value="traceState"
          @input="chooseStatus"
          :data="[
            { label: 'All', key: 'ALL' },
            { label: 'Success', key: 'SUCCESS' },
            { label: 'Error', key: 'ERROR' },
          ]"
        />
        <div class="mr-10" style="padding: 3px 15px 0">
          <div class="sm grey">{{ $t('endpointName') }}</div>
          <input type="text" v-model="endpointName" class="rk-trace-search-input" />
        </div>
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
      <div class="flex-h">
        <div class="mr-10" style="padding-top: 5px">
          <span class="sm grey">{{ $t('tags') }}: </span>
          <span class="rk-trace-tags">
            <span class="selected" v-for="(item, index) in tagsList" :key="index">
              <span>{{ item }}</span>
              <span class="remove-icon" @click="removeTags(index)">×</span>
            </span>
          </span>
          <input type="text" :placeholder="$t('addTag')" v-model="tags" class="rk-trace-new-tag" @keyup="addLabels" />
          <span class="trace-tips" v-tooltip:bottom="{ content: $t('traceTagsTip') }">
            <a
              target="blank"
              href="https://github.com/apache/skywalking/blob/master/docs/en/setup/backend/configuration-vocabulary.md"
            >
              {{ $t('tagsLink') }}
            </a>
            <rk-icon icon="help" class="mr-5" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import TraceSelect from '../common/trace-select.vue';
  import { State as traceState } from '@/store/modules/trace/index';
  import { State as globalState } from '@/store/modules/global/index';
  import dateFormatStep from '@/utils/dateFormat';

  @Component({ components: { TraceSelect } })
  export default class TraceSearch extends Vue {
    @State('rocketbot') private rocketbotGlobal!: globalState;
    @State('rocketTrace') private rocketTrace!: traceState;
    @Getter('durationTime') private durationTime: any;
    @Getter('duration') private duration: any;
    @Action('RESET_DURATION') private RESET_DURATION: any;
    @Action('rocketTrace/GET_SERVICES') private GET_SERVICES: any;
    @Action('rocketTrace/GET_INSTANCES') private GET_INSTANCES: any;
    @Action('rocketTrace/GET_TRACELIST') private GET_TRACELIST: any;
    @Action('rocketTrace/SET_TRACE_FORM') private SET_TRACE_FORM: any;
    @Mutation('rocketTrace/SET_TRACE_FORM_ITEM')
    private SET_TRACE_FORM_ITEM: any;
    @Mutation('rocketTrace/SET_INSTANCES') private SET_INSTANCES: any;
    private service: Option = { label: 'All', key: '' };
    private time!: Date[];
    private status: boolean = true;
    private maxTraceDuration: string = localStorage.getItem('maxTraceDuration') || '';
    private minTraceDuration: string = localStorage.getItem('minTraceDuration') || '';
    private instance: Option = { label: 'All', key: '' };
    private endpointName: string = localStorage.getItem('endpointName') || '';
    private traceId: string = localStorage.getItem('traceId') || '';
    private traceState: Option = { label: 'All', key: 'ALL' };
    private tags: string = '';
    private tagsList: string[] = [];

    private created() {
      this.endpointName = this.$route.query.endpointname
        ? this.$route.query.endpointname.toString()
        : this.endpointName;
      this.traceId = this.$route.query.traceid ? this.$route.query.traceid.toString() : this.traceId;
      this.time = [this.rocketbotGlobal.durationRow.start, this.rocketbotGlobal.durationRow.end];
      this.tagsList = localStorage.getItem('traceTags') ? JSON.parse(localStorage.getItem('traceTags') || '') : [];
    }
    private mounted() {
      this.getTraceList();
      if (this.service && this.service.key) {
        this.GET_INSTANCES({
          duration: this.durationTime,
          serviceId: this.service.key,
        });
      }
    }

    private globalTimeFormat(time: Date[]) {
      let step = 'MINUTE';
      const unix = Math.round(time[1].getTime()) - Math.round(time[0].getTime());
      if (unix <= 60 * 60 * 1000) {
        step = 'MINUTE';
      } else if (unix <= 24 * 60 * 60 * 1000) {
        step = 'HOUR';
      } else {
        step = 'DAY';
      }
      return {
        start: dateFormatStep(time[0], step, false),
        end: dateFormatStep(time[1], step, false),
        step,
      };
    }

    private chooseService(i: any) {
      if (this.service.key === i.key) {
        return;
      }
      this.instance = { label: 'All', key: '' };
      this.service = i;
      if (i.key === '') {
        this.SET_INSTANCES([]);
        return;
      }
      this.GET_INSTANCES({ duration: this.durationTime, serviceId: i.key });
    }

    private chooseStatus(i: any) {
      this.traceState = i;
    }

    private getTraceList() {
      this.GET_SERVICES({ duration: this.durationTime });
      const temp: any = {
        queryDuration: this.globalTimeFormat([
          new Date(
            this.time[0].getTime() +
              (parseInt(String(this.rocketbotGlobal.utc), 10) + new Date().getTimezoneOffset() / 60) * 3600000,
          ),
          new Date(
            this.time[1].getTime() +
              (parseInt(String(this.rocketbotGlobal.utc), 10) + new Date().getTimezoneOffset() / 60) * 3600000,
          ),
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
      if (this.endpointName) {
        temp.endpointName = this.endpointName;
        localStorage.setItem('endpointName', this.endpointName);
      }
      if (this.traceId) {
        temp.traceId = this.traceId;
        localStorage.setItem('traceId', this.traceId);
      }
      if (this.tagsList.length) {
        const tagsMap = this.tagsList.map((item: string) => {
          const key = item.substring(0, item.indexOf('='));

          return {
            key,
            value: item.substring(item.indexOf('=') + 1, item.length),
          };
        });
        temp.tags = tagsMap;
        localStorage.setItem('traceTags', JSON.stringify(this.tagsList));
      }
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
      this.endpointName = '';
      localStorage.removeItem('endpointName');
      this.tagsList = [];
      localStorage.removeItem('traceTags');
      this.traceId = '';
      localStorage.removeItem('traceId');
      this.traceState = { label: 'All', key: 'ALL' };
      this.SET_TRACE_FORM_ITEM({ type: 'queryOrder', data: '' });
      this.getTraceList();
    }

    private addLabels(event: KeyboardEvent) {
      if (event.keyCode !== 13 || !this.tags) {
        return;
      }
      this.tagsList.push(this.tags);
      this.tags = '';
    }

    private removeTags(index: number) {
      this.tagsList.splice(index, 1);
      localStorage.setItem('traceTags', JSON.stringify(this.tagsList));
    }

    @Watch('rocketbotGlobal.durationRow')
    private durationRowWatch(value: Duration) {
      this.time = [value.start, value.end];
    }
  }
</script>

<style lang="scss">
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
    margin-top: 8px;
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
