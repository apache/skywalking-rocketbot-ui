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
    <TraceContainer :tableData="tableData" :type="HeaderType">
      <div class="trace-tips" v-if="!tableData.length">{{ $t('noData') }}</div>
    </TraceContainer>
    <rk-sidebox :width="'50%'" :show.sync="showDetail" :title="$t('spanInfo')">
      <TraceSpanLogs :currentSpan="currentSpan" />
    </rk-sidebox>
  </div>
</template>
<style lang="scss">
  .rk-tooltip-popper.trace-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
  .trace-detail-chart-table {
    position: relative;
    min-height: 300px;
    border-bottom: 1px solid #ccc;
  }
</style>

<script lang="js">
  import copy from '@/utils/copy';
  import TraceContainer from './trace-statistics-table/trace-container';
  import _ from 'lodash';
  import TraceSpanLogs from '../trace/trace-span-logs.vue';
  /* eslint-disable */
  /* tslint:disable */
  export default {
    components: {
      TraceContainer,
      TraceSpanLogs,
    },
    props: ['data', 'traceId', 'showBtnDetail', 'HeaderType'],
    watch: {
      data(val, oldVal) {
        if (!this.data.length) {
          this.tableData = [];
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
    methods: {
      copy,
      // TODO 统计计算
      compute(data){
        const traceData = data[0].children;
        const map = new Map();
        //数据转化
        for (let i=0; i<traceData.length;i++) {
          const element = traceData[i];
          // console.log(element);
          if (map.has(element.endpointName)) {
            let arr =  map.get(element.endpointName);
            arr[0].children.push(element);
            map.set(element.endpointName,arr);
          }else{
            let arr = [];
            arr.push(element);
            map.set(element.endpointName,arr);
          }
        };
        console.log(map);
        const result = [];

       for(let value of map.values()){
          let maxTime = 0;
          let minTime;
          let sumTime = 0;
          let val = value[0].children;
          let count = val.length;
          let endpointName;
          //如果只出现一次,取value[0]
          if(count == 0){
            val = value[0];
            count = 1;
            let a = val.endTime;
            let b = val.startTime;
            let ms = a - b;
            maxTime = ms;
            minTime = ms;
            sumTime = ms;
            endpointName = val.endpointName;

          } else {
            //循环计算
            for (let i = 0; i < val.length;i++) {
              let element = val[i];
              let a = element.endTime;
              let b = element.startTime;
              let ms = a - b;
              //默认赋值
              if(i == 0){
                endpointName = element.endpointName;
                maxTime = ms;
                minTime = ms;
              }else{
                if (ms > maxTime){
                  maxTime = ms;
                }
                if (ms < minTime) {
                  minTime = ms;
                }
              }
              sumTime = sumTime + ms;

            };
          }
          let avgTime = count == 0 ? 0 :(sumTime / count);
          let jsonStr = {
              'maxTime': maxTime,
              'minTime': minTime,
              'avgTime': avgTime,
              'count': count,
              'endpointName': endpointName
              };
          result.push(jsonStr);
        };
        console.log("--- this is result---");
        console.log(result);
        console.log("------");
        return result;
      },
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
        if (!node || node.isBroken) {
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
            const fixSpanKeyContent = {
              traceId: span.traceId,
              segmentId: span.segmentId,
              spanId: span.spanId - 1,
              parentSpanId: span.spanId - 2,
            };
            if (index === -1 && !_.find(fixSpans, fixSpanKeyContent)) {
              fixSpans.push(
                {
                  ...fixSpanKeyContent, refs: [], endpointName: `VNode: ${span.segmentId}`, serviceCode: 'VirtualNode', type: `[Broken] ${span.type}`, peer: '', component: `VirtualNode: #${span.spanId - 1}`, isError: true, isBroken: true, layer: 'Broken', tags: [], logs: [],
                },
              );
            }
          }
        });
          segmentHeaders.forEach((span) => {
            if (span.refs && span.refs.length) {
              span.refs.forEach((ref) => {
                const index = this.data.findIndex(i => (ref.parentSegmentId === i.segmentId && ref.parentSpanId === i.spanId));
                if (index === -1) {
                  // create a known broken node.
                  const i = ref.parentSpanId;
                  const fixSpanKeyContent = {
                    traceId: ref.traceId,
                    segmentId: ref.parentSegmentId,
                    spanId: i,
                    parentSpanId: i > -1 ? 0 : -1,
                  };
                  !_.find(fixSpans, fixSpanKeyContent) && fixSpans.push(
                    {
                      ...fixSpanKeyContent, refs: [], endpointName: `VNode: ${ref.parentSegmentId}`, serviceCode: 'VirtualNode', type: `[Broken] ${ref.type}`, peer: '', component: `VirtualNode: #${i}`, isError: true, isBroken: true, layer: 'Broken', tags: [], logs: [],
                    },
                  );
                  // if root broken node is not exist, create a root broken node.
                  if (fixSpanKeyContent.parentSpanId > -1) {
                    const fixRootSpanKeyContent = {
                      traceId: ref.traceId,
                      segmentId: ref.parentSegmentId,
                      spanId: 0,
                      parentSpanId: -1,
                    };
                    !_.find(fixSpans, fixRootSpanKeyContent) && fixSpans.push(
                      {
                        ...fixRootSpanKeyContent,
                        refs: [],
                        endpointName: `VNode: ${ref.parentSegmentId}`,
                        serviceCode: 'VirtualNode',
                        type: `[Broken] ${ref.type}`,
                        peer: '',
                        component: `VirtualNode: #0`,
                        isError: true,
                        isBroken: true,
                        layer: 'Broken',
                        tags: [],
                        logs: [],
                      },
                    );
                  }
                }
              });
            }
          });
          [...fixSpans, ...this.data].forEach(i => {
            i.label=i.endpointName || 'no operation name';
            i.children = [];
            if(segmentGroup[i.segmentId] === undefined){
              segmentIdGroup.push(i.segmentId);
              segmentGroup[i.segmentId] = [];
              segmentGroup[i.segmentId].push(i);
            }else{
              segmentGroup[i.segmentId].push(i);
            }
          });
          segmentIdGroup.forEach(id => {
            let currentSegment = segmentGroup[id].sort((a,b) => b.parentSpanId-a.parentSpanId);
            currentSegment.forEach(s =>{
              let index = currentSegment.findIndex(i => i.spanId === s.parentSpanId);
              if (index !== -1) {
                if ((currentSegment[index].isBroken && currentSegment[index].parentSpanId === -1) || !currentSegment[index].isBroken) {
                  currentSegment[index].children.push(s);
                  currentSegment[index].children.sort((a, b) => a.spanId - b.spanId);
                }
              }
              if (s.isBroken) {
                const children = _.filter(this.data, (span) => {
                  return _.find(span.refs, {traceId: s.traceId, parentSegmentId: s.segmentId, parentSpanId: s.spanId});
                });
                children.length > 0 && s.children.push(...children);
              }
            })
            segmentGroup[id] = currentSegment[currentSegment.length-1]
          })
          segmentIdGroup.forEach(id => {
            segmentGroup[id].refs && segmentGroup[id].refs.forEach(ref => {
              if(ref.traceId === this.traceId) {
                this.traverseTree(segmentGroup[ref.parentSegmentId],ref.parentSpanId,ref.parentSegmentId,segmentGroup[id])
              };
            })
            // if(segmentGroup[id].refs.length !==0 ) delete segmentGroup[id];
          })
        for (const i in segmentGroup) {
          if (segmentGroup[i].refs && segmentGroup[i].refs.length === 0 || !segmentGroup[i].refs) {
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
      const data = this.formatData(this.changeTree());
      this.tableData = this.compute(data);
      this.loading = false;
      this.$eventBus.$on('HANDLE-VIEW-SPAN', this, this.handleViewSpan);
      this.$eventBus.$on('TRACE-TABLE-LOADING', this, ()=>{ this.loading = true });
    },
  };
</script>
<style>
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
</style>
