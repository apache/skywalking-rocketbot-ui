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
  <div class="rk-trace-detail flex-v">
    <div class="rk-trace-detail-wrapper clear" v-if="current.endpointNames">
      <h5 class="mb-5 mt-0">
        <svg v-if="current.isError" class="icon red vm mr-5 sm">
          <use xlink:href="#clear"></use>
        </svg>
        <span class="vm">{{ current.endpointNames[0] }}</span>
      </h5>
      <div class="mb-5 blue sm">
        <select class="rk-trace-detail-ids" @change="GET_TRACE_SPANS({ traceId: i })">
          <option v-for="i in current.traceIds" :value="i" :key="i">{{ i }}</option>
        </select>
        <svg class="icon vm grey link-hover cp ml-5" @click="handleClick(current.traceIds)">
          <use xlink:href="#review-list"></use>
        </svg>
      </div>

      <a class="rk-btn mr-5 sm r" :class="{ ghost: displayMode !== 'table' }" @click="displayMode = 'table'">
        <svg class="icon vm sm rk-trace-table_svg-icon">
          <use xlink:href="#table"></use>
        </svg>
        {{ $t('table') }}</a
      >
      <a class="rk-btn mr-5 sm r" :class="{ ghost: displayMode !== 'tree' }" @click="displayMode = 'tree'">
        <svg class="icon vm sm">
          <use xlink:href="#issue-child"></use>
        </svg>
        {{ $t('tree') }}</a
      >
      <a class="rk-btn mr-5 sm r" :class="{ ghost: displayMode !== 'list' }" @click="displayMode = 'list'">
        <svg class="icon vm sm">
          <use xlink:href="#list-bulleted"></use>
        </svg>
        {{ $t('list') }}</a
      >

      <div class="rk-tag mr-5">{{ this.$t('start') }}</div>
      <span class="mr-15 sm">{{ parseInt(current.start) | dateformat }}</span>
      <div class="rk-tag mr-5">{{ this.$t('duration') }}</div>
      <span class="mr-15 sm">{{ current.duration }} ms</span>
      <div class="rk-tag mr-5">{{ this.$t('spans') }}</div>
      <span class="sm">{{ spans.length }}</span>
    </div>
    <TraceDetailChartList
      v-if="displayMode == 'list' && current.endpointNames"
      :data="spans"
      :traceId="current.traceIds[0]"
    />
    <TraceDetailChartTree
      v-if="displayMode == 'tree' && current.endpointNames"
      :data="spans"
      :traceId="current.traceIds[0]"
    />
    <TraceDetailChartTable
      v-if="displayMode == 'table' && current.endpointNames"
      :data="spans"
      :traceId="current.traceIds[0]"
      :showBtnDetail="false"
    />

    <div v-if="!current.endpointNames" class="flex-h container">
      <svg class="icon rk-icon-trace">
        <use xlink:href="#unlink"></use>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import TraceDetailChartList from './trace-detail-chart-list.vue';
  import TraceDetailChartTree from './trace-detail-chart-tree.vue';
  import { TraceDetailChartTable } from '../common';
  import { Trace, Span } from '@/types/trace';
  import { Action, State } from 'vuex-class';
  import copy from '@/utils/copy';

  @Component({
    components: {
      TraceDetailChartList,
      TraceDetailChartTree,
      TraceDetailChartTable,
    },
  })
  export default class TraceDetail extends Vue {
    @State('rocketbot') private rocketbot: any;
    @Action('rocketTrace/GET_TRACE_SPANS') private GET_TRACE_SPANS: any;
    @Prop() private spans!: Span[];
    @Prop() private current!: Trace;
    private mode: boolean = true;
    private displayMode: string = 'list';
    private handleClick(ids: any) {
      let copyValue = null;
      if (ids.length === 1) {
        copyValue = ids[0];
      } else {
        copyValue = ids.join(',');
      }
      copy(copyValue);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-trace-detail {
    flex-shrink: 0;
    height: 100%;
    width: 75%;
    overflow-y: auto;
    .rk-btn.ghost {
      background: rgba(0, 0, 0, 0.5);
    }
  }
  .rk-trace-detail-wrapper {
    padding: 8px 30px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .rk-trace-detail-ids {
    background-color: rgba(0, 0, 0, 0);
    outline: 0;
    border-style: unset;
    color: inherit;
    border: 1px solid;
    border-radius: 4px;
  }
  .rk-tag {
    display: inline-block;
    border-radius: 4px;
    padding: 0px 7px;
    background-color: #40454e;
    color: #eee;
  }
  .rk-icon-trace {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    fill: rgba(46, 47, 51, 0.15);
  }
  .rk-trace-table_svg-icon {
    width: 11px;
    height: 11px;
  }
</style>
