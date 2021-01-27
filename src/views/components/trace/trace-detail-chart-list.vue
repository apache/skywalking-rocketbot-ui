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
  <div class="time-charts scroll_hide">
    <div class="rk-trace-t-loading" v-show="loading">
      <svg class="icon loading">
        <use xlink:href="#spinner"></use>
      </svg>
    </div>
    <transition-group name="fade" tag="a" class="mb-5">
      <span class="time-charts-item mr-10" v-for="(i, index) in list" :key="i" :style="`color:${computedScale(index)}`">
        <svg class="icon vm mr-5 sm">
          <use xlink:href="#issue-open-m"></use>
        </svg>
        <span>{{ i }}</span>
      </span>
    </transition-group>
    <a class="rk-btn r vm  tc" @click="downloadTrace">{{ $t('exportImage') }}</a>
    <rk-sidebox :width="'50%'" :show.sync="showDetail" :title="$t('spanInfo')">
      <TraceSpanLogs :currentSpan="currentSpan" />
    </rk-sidebox>
    <div class="trace-list">
      <div ref="traceList"></div>
    </div>
  </div>
</template>
<script lang="js">
  import copy from '@/utils/copy';
  import * as d3 from 'd3';
  import Trace from './d3-trace';
  import _ from 'lodash';
  import TraceSpanLogs from './trace-span-logs.vue';
  export default {
    components: {TraceSpanLogs},
    props: ['data', 'traceId'],
    data() {
      return {
        segmentId: [],
        showDetail: false,
        list: [],
        currentSpan: [],
        loading: true,
        fixSpansSize: 0,
        showRelatedLogs: false,
      };
    },
    watch: {
      data() {
        if (!this.data.length) { return; }
        this.loading = true;
        this.changeTree();
        this.tree.init({label: 'TRACE_ROOT', children: this.segmentId}, this.data, this.fixSpansSize);
        this.tree.draw(() => {
          setTimeout(() => {
            this.loading = false;
          }, 200);
        });
      },
    },
    beforeDestroy() {
      d3.selectAll('.d3-tip').remove();
    },
    mounted() {
      this.$eventBus.$on('TRACE-LIST-LOADING', this, () => { this.loading = true; });
      // this.loading = true;
      this.changeTree();
      this.tree = new Trace(this.$refs.traceList, this);
      this.tree.init({label: 'TRACE_ROOT', children: this.segmentId}, this.data, this.fixSpansSize);
      this.tree.draw();
      this.loading = false;
      // this.computedScale();
    },
    methods: {
      handleSelectSpan(i) {
        this.currentSpan = i.data;
        this.showDetail = true;
      },
      traverseTree(node, spanId, segmentId, data) {
        if (!node || node.isBroken) { return; }
        if (node.spanId === spanId && node.segmentId === segmentId) {
          node.children.push(data);
          return;
        }
        if (node.children && node.children.length > 0) {
          node.children.forEach((nodeItem) => {
            this.traverseTree(nodeItem, spanId, segmentId, data);
          });
        }
      },
      computedScale(i) {
         // Rainbow map
        const sequentialScale = d3.scaleSequential()
        .domain([0, this.list.length + 1])
        .interpolator(d3.interpolateCool);
        return sequentialScale(i);
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
            const index = this.data.findIndex((i) => (
              i.segmentId === span.segmentId
              &&
              i.spanId === (span.spanId - 1)
            ));
            const fixSpanKeyContent = {
              traceId: span.traceId,
              segmentId: span.segmentId,
              spanId: span.spanId - 1,
              parentSpanId: span.spanId - 2,
            };
            if (index === -1 && !_.find(fixSpans, fixSpanKeyContent)) {
              fixSpans.push(
                {
                  ...fixSpanKeyContent,
                  refs: [],
                  endpointName: `VNode: ${span.segmentId}`,
                  serviceCode: 'VirtualNode',
                  type: `[Broken] ${span.type}`,
                  peer: '',
                  component: `VirtualNode: #${span.spanId - 1}`,
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
        segmentHeaders.forEach((span) => {
          if (span.refs.length) {
            span.refs.forEach((ref) => {
              const index = this.data.findIndex((i) => (
                ref.parentSegmentId === i.segmentId
                &&
                ref.parentSpanId === i.spanId
              ));
              if (index === -1) {
                // create a known broken node.
                const i = ref.parentSpanId;
                const fixSpanKeyContent = {
                  traceId: ref.traceId,
                  segmentId: ref.parentSegmentId,
                  spanId: i,
                  parentSpanId: i > -1 ? 0 : -1,
                };
                if (!_.find(fixSpans, fixSpanKeyContent)) {
                  fixSpans.push({
                      ...fixSpanKeyContent, refs: [], endpointName: `VNode: ${ref.parentSegmentId}`,
                    serviceCode: 'VirtualNode', type: `[Broken] ${ref.type}`, peer: '', component: `VirtualNode: #${i}`,
                    isError: true, isBroken: true, layer: 'Broken', tags: [], logs: [],
                  });
                }
                // if root broken node is not exist, create a root broken node.
                if (fixSpanKeyContent.parentSpanId > -1) {
                  const fixRootSpanKeyContent = {
                    traceId: ref.traceId,
                    segmentId: ref.parentSegmentId,
                    spanId: 0,
                    parentSpanId: -1,
                  };
                  if (!_.find(fixSpans, fixRootSpanKeyContent)) {
                    fixSpans.push({
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
                    });
                  }
                }
              }
            });
          }
        });
        [...fixSpans, ...this.data].forEach((i) => {
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
        this.fixSpansSize = fixSpans.length;
        segmentIdGroup.forEach((id) => {
          const currentSegment = segmentGroup[id].sort((a, b) => b.parentSpanId - a.parentSpanId);
          currentSegment.forEach((s) => {
            const index = currentSegment.findIndex((i) => i.spanId === s.parentSpanId);
            if (index !== -1) {
              if (
                (currentSegment[index].isBroken && currentSegment[index].parentSpanId === -1)
                ||
                !currentSegment[index].isBroken
              ) {
                currentSegment[index].children.push(s);
                currentSegment[index].children.sort((a, b) => a.spanId - b.spanId);
              }
            }
            if (s.isBroken) {
              const children = _.filter(this.data, (span) => {
                return _.find(span.refs, {traceId: s.traceId, parentSegmentId: s.segmentId, parentSpanId: s.spanId});
              });
              if (children.length > 0) {
                s.children.push(...children);
              }
            }
          });
          segmentGroup[id] = currentSegment[currentSegment.length - 1];
        });
        segmentIdGroup.forEach((id) => {
          segmentGroup[id].refs.forEach((ref) => {
            if (ref.traceId === this.traceId) {
              this.traverseTree(
                segmentGroup[ref.parentSegmentId],
                ref.parentSpanId,
                ref.parentSegmentId,
                segmentGroup[id]);
            }
          });
        });
        for (const i in segmentGroup) {
          if (segmentGroup[i].refs.length === 0 ) {
            this.segmentId.push(segmentGroup[i]);
          }
        }
        this.segmentId.forEach((i) => {
          this.collapse(i);
        });
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
      downloadTrace() {
        const serializer = new XMLSerializer();
        const svgNode = d3.select('.trace-list-dowanload').node();
        const source = `<?xml version="1.0" standalone="no"?>\r\n${serializer.serializeToString(svgNode)}`;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = d3.select('.trace-list-dowanload')._groups[0][0].clientWidth;
        canvas.height = d3.select('.trace-list-dowanload')._groups[0][0].clientHeight;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const image = new Image();
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
        image.onload = () => {
          context.drawImage(image, 0, 0);
          const tagA = document.createElement('a');
          tagA.download = 'trace-list.png';
          tagA.href = canvas.toDataURL('image/png');
          tagA.click();
        };
      },
    },
  };
</script>
<style lang="scss">
  .time-charts {
    overflow: auto;
    padding: 10px 30px;
    position: relative;
    min-height: 150px;
  }
  .trace-node .group {
    cursor: pointer;
    fill-opacity: 0;
  }
  .trace-node-container {
    fill: rgba(0, 0, 0, 0);
    stroke-width: 5px;
    cursor: pointer;
    &:hover {
      fill: rgba(0, 0, 0, 0.05);
    }
  }
  .trace-node .node-text {
    font: 12.5px sans-serif;
    pointer-events: none;
  }
  .domain {
    display: none;
  }
  .time-charts-item {
    display: inline-block;
    padding: 2px 8px;
    border: 1px solid;
    font-size: 11px;
    border-radius: 4px;
  }
  .trace-list {
    fill: rgba(0, 0, 0, 0);
  }
  .trace-list .trace-node rect {
    &:hover {
      fill: rgba(0, 0, 0, 0.05);
    }
  }
  .dialog-c-text {
    white-space: pre;
    overflow: auto;
    font-family: monospace;
  }
  .rk-popup-btn {
    color: #fff;
    padding: 10px 9px;
    border-radius: 4px;
    margin-top: 40px;
    width: 100%;
    text-align: center;
  }
</style>
