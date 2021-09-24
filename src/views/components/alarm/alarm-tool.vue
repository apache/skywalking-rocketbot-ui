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
  <nav class="rk-alarm-tool flex-h">
    <div class="flex-h alarm-conditions">
      <CommonSelector
        :title="$t('filterScope')"
        :value="alarmOption"
        @input="
          (option) => {
            alarmOption = option;
            handleRefresh({ pageNum: 1 });
          }
        "
        :data="alarmOptions"
      />
      <div class="mr-10 ml-10">
        <span class="sm grey">{{ $t('searchKeyword') }}: </span>
        <input
          type="text"
          v-model="keyword"
          class="rk-alarm-tool-input"
          @input="enterUpdateAlarm"
          @change="handleRefresh({ pageNum: 1 })"
        />
      </div>
      <ConditionTags :type="'ALARM'" @updateTags="(data) => handleRefresh({ pageNum: 1, tagsMap: data.tagsMap })" />
    </div>
    <RkPage
      :currentSize="20"
      :currentPage="pageNum"
      @changePage="(pageNum) => handleRefresh({ pageNum })"
      :total="total"
    />
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Action, Mutation, Getter } from 'vuex-class';
  import { Option, DurationTime } from '@/types/global';
  import { ConditionTags, CommonSelector } from '../common/index';

  @Component({ components: { CommonSelector, ConditionTags } })
  export default class AlarmTool extends Vue {
    @Getter('durationTime') private durationTime!: DurationTime;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Action('rocketAlarm/GET_ALARM') private GET_ALARM: any;
    @Prop() private total!: number;
    private pageNum: number = 1;
    private alarmOption: Option = { label: 'All', key: '' };
    private alarmOptions: Option[] = [
      { label: 'All', key: '' },
      { label: 'Service', key: 'Service' },
      { label: 'ServiceInstance', key: 'ServiceInstance' },
      { label: 'Endpoint', key: 'Endpoint' },
      { label: 'ServiceRelation', key: 'ServiceRelation' },
      { label: 'ServiceInstanceRelation', key: 'ServiceInstanceRelation' },
      { label: 'EndpointRelation', key: 'EndpointRelation' },
    ];
    private keyword: string = '';

    private beforeMount() {
      this.SET_EVENTS([
        () => {
          this.handleRefresh({ pageNum: 1 });
        },
      ]);
    }
    private handleRefresh(param: { pageNum: number; tagsMap?: Array<{ key: string; value: string }> }) {
      this.pageNum = param.pageNum;
      const params: any = {
        duration: this.durationTime,
        paging: {
          pageNum: param.pageNum,
          pageSize: 20,
          needTotal: true,
        },
        tags: param.tagsMap,
      };
      if (this.alarmOption.key) {
        params.scope = this.alarmOption.key;
      }
      if (this.keyword) {
        params.keyword = this.keyword;
      }
      this.GET_ALARM(params);
    }
    private enterUpdateAlarm(event: KeyboardEvent) {
      if (event.keyCode !== 13) {
        return;
      }
      this.handleRefresh({ pageNum: 1 });
    }
    private beforeDestroy() {
      this.SET_EVENTS([]);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-alarm-tool {
    border-bottom: 1px solid #c1c5ca41;
    height: 52px;
    background-color: #333840;
    padding: 0 15px;
    color: #efefef;
    flex-shrink: 0;
    justify-content: space-between;
  }

  .rk-alarm-tool-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
  }
  .alarm-conditions {
    height: 100%;
  }
</style>
