/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>

  <div class="trace-detail-chart-table">
    <div class="rk-trace-t-loading" v-show="loading">
      <svg class="icon loading">
        <use xlink:href="#spinner"></use>
      </svg>
    </div>
    <TraceContainer>
      <Item v-for="(item, index) in tableData"  :data="item"  :key="'key'+ index" />
    </TraceContainer>
    <rk-sidebox :width="'50%'" :show.sync="showDetail" :title="$t('spanInfo')">
      <div class="rk-trace-detail">
        <h5 class="mb-15">{{$t('tags')}}.</h5>
        <div class="mb-10 clear"><span class="g-sm-4 grey">{{$t('endpoint')}}:</span><span class="g-sm-8 wba">{{this.currentSpan.label}}</span></div>
        <div class="mb-10 clear"><span class="g-sm-4 grey">{{$t('spanType')}}:</span><span class="g-sm-8 wba">{{this.currentSpan.type}}</span></div>
        <div class="mb-10 clear"><span class="g-sm-4 grey">{{$t('component')}}:</span><span class="g-sm-8 wba">{{this.currentSpan.component}}</span></div>
        <div class="mb-10 clear"><span class="g-sm-4 grey">Peer:</span><span class="g-sm-8 wba">{{this.currentSpan.peer||'No Peer'}}</span></div>
        <div class="mb-10 clear"><span class="g-sm-4 grey">{{$t('error')}}:</span><span class="g-sm-8 wba">{{this.currentSpan.isError}}</span></div>
        <div class="mb-10 clear" v-for="i in this.currentSpan.tags" :key="i.key">
          <span class="g-sm-4 grey">{{i.key}}:</span>
          <span class="g-sm-8 wba">
            {{i.value}}
            <svg v-if="i.key==='db.statement'" class="icon vm grey link-hover cp ml-5" @click="copy(i.value)">
              <use xlink:href="#review-list"></use>
            </svg>
          </span>
        </div>
        <h5 class="mb-10" v-if="this.currentSpan.logs" v-show="this.currentSpan.logs.length">{{$t('logs')}}.</h5>
        <div v-for="(i, index) in this.currentSpan.logs" :key="index">
          <div class="mb-10 sm">
            <span class="mr-10">{{$t('time')}}:</span>
            <span class="grey">{{i.time | dateformat}}</span>
          </div>
          <div class="mb-15 clear" v-for="(_i, _index) in i.data" :key="_index">
            <div class="mb-10">{{_i.key}}:</div>
            <pre class="pl-15 mt-0 mb-0 sm oa">{{_i.value}}</pre>
          </div>
        </div>
      </div>
    </rk-sidebox>
  </div>
</template>
<style lang="scss">
  .rk-tooltip-popper.trace-table-tooltip .rk-tooltip-inner{
      max-width: 600px;
  }
  .trace-detail-chart-table {
    position: relative;
    min-height: 150px;
  }
</style>

<script lang="js">
import copy from '@/utils/copy';
import Item from './trace-chart-table/trace-item';
import TraceContainer from './trace-chart-table/trace-container';
/* eslint-disable */
/* tslint:disable */
export default {
  components: {
    Item,
    TraceContainer,
  },
  props: ['data', 'traceId'],
  watch: {
    data(val, oldVal) {
      if (!this.data.length) {
        return;
      }
      this.tableData = this.formatData(this.changeTree());
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
  computed: {
    eventHub() {
      return this.$store.getters.globalEventHub
    }
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
    traverseTree(node, spanId, segmentId, data) {
      if (!node) {
        return;
      }
      if (node.spanId === spanId && node.segmentId === segmentId) {
        node.children.push(data);
        return;
      }
      if (node.children && node.children.length > 0) {
        for (const item of node.children) {
          this.traverseTree(item, spanId, segmentId, data);
        }
      }
    },
    changeTree() {
      if (this.data.length === 0) {
        return [];
      }
      this.list = Array.from(new Set(this.data.map((i) => i.serviceCode)));
      this.segmentId = [];
      const segmentGroup = {};
      const segmentIdGroup = [];
      const fixSpans = [];
      const segmentHeaders = [];
      this.data.forEach((span) => {
        if (span.parentSpanId === -1) {
          segmentHeaders.push(span);
        } else {
          const index = this.data.findIndex(i => (i.segmentId === span.segmentId && i.spanId === (span.spanId - 1)));
          if (index === -1) {
            fixSpans.push(
              {
                traceId: span.traceId, segmentId: span.segmentId, spanId: span.spanId - 1, parentSpanId: span.spanId - 2, refs: [], endpointName: `VNode: ${span.segmentId}`, serviceCode: 'VirtualNode', type: 'Broken', peer: '', component: `VirtualNode: #${span.spanId - 1}`, isError: true, isBroken: true, layer: 'Broken', tags: [], logs: [],
              },
            );
          }
        }
      });
      segmentHeaders.forEach((span) => {
        if (span.refs.length) {
          span.refs.forEach((ref) => {
            const index = this.data.findIndex(i => (ref.parentSegmentId === i.segmentId && ref.parentSpanId === i.spanId));
            if (index === -1) {
              for (let i = 0; i <= ref.parentSpanId; i += 1) {
                fixSpans.push(
                  {
                    traceId: ref.traceId, segmentId: ref.parentSegmentId, spanId: i, parentSpanId: i - 1, refs: [], endpointName: `VNode: ${ref.parentSegmentId}`, serviceCode: 'VirtualNode', type: 'Broken', peer: '', component: `VirtualNode: #${i}`, isError: true, isBroken: true, layer: 'Broken', tags: [], logs: [],
                  },
                );
              }
            }
          });
        }
      });
      [...fixSpans, ...this.data].forEach(i => {
        i.label = i.endpointName || 'no operation name';
        i.children = [];
        if (segmentGroup[i.segmentId] === undefined) {
          segmentIdGroup.push(i.segmentId);
          segmentGroup[i.segmentId] = [];
          segmentGroup[i.segmentId].push(i);
        } else {
          segmentGroup[i.segmentId].push(i);
        }
      });
      segmentIdGroup.forEach((id) => {
        const currentSegment = segmentGroup[id].sort((a, b) => b.parentSpanId - a.parentSpanId);
        currentSegment.forEach((s) => {
          const index = currentSegment.findIndex((i) => i.spanId === s.parentSpanId);
          if (index !== -1) {
            currentSegment[index].children.push(s);
            currentSegment[index].children.sort((a, b) => a.spanId - b.spanId );
          }
        });
        segmentGroup[id] = currentSegment[currentSegment.length - 1];
      });
      segmentIdGroup.forEach((id) => {
        segmentGroup[id].refs.forEach((ref) => {
          if (ref.traceId === this.traceId) {
            this.traverseTree(segmentGroup[ref.parentSegmentId],
              ref.parentSpanId,
              ref.parentSegmentId,
              segmentGroup[id]);
          }
        });
        // if(segmentGroup[id].refs.length !==0 ) delete segmentGroup[id];
      });
      for (const i in segmentGroup) {
        if (segmentGroup[i].refs.length === 0) {
          this.segmentId.push(segmentGroup[i]);
        }
      }
      this.segmentId.forEach((_, i) => {
        this.collapse(this.segmentId[i]);
      });
      return this.segmentId;
    },
    collapse(d) {
      if (d.children) {
        let dur = d.endTime - d.startTime;
        d.children.forEach((i) => {
          dur -= (i.endTime - i.startTime);
        });
        d.dur = dur < 0 ? 0 : dur;
        d.children.forEach((i) => this.collapse(i));
      }
    },
    handleSelectSpan(data) {
      this.currentSpan = data;
      this.showDetail = true;
    },
  },
  created() {
    this.loading = true;
  },
  mounted() {
    this.tableData = this.formatData(this.changeTree());
    this.loading = false;
    this.eventHub.$on('HANDLE-SELECT-SPAN', this.handleSelectSpan);
    this.eventHub.$on('TRACE-TABLE-LOADING', ()=>{ this.loading = true });

  },
};
</script>
