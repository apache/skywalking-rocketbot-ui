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
  <div class="time-charts scroll_hide">
    <transition-group name="fade" tag="div" class="mb-5">
      <span class="time-charts-item mr-10" v-for="(i,index) in list" :key="i" :style="`color:${computedScale(index)}`">
         <svg class="icon vm mr-5 sm">
            <use xlink:href="#issue-open-m"></use>
          </svg>
        <span>{{i}}</span>
      </span>
    </transition-group>
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
          <div class="mb-10 sm"><span class="mr-10">{{$t('time')}}:</span><span class="grey">{{i.time | dateformat}}</span></div>
          <div class="mb-15 clear" v-for="(_i, _index) in i.data" :key="_index">
            <div class="mb-10">{{_i.key}}:</div><pre class="pl-15 mt-0 mb-0 sm oa" >{{_i.value}}</pre>
          </div>
        </div>
      </div>
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
/* eslint-disable */
/* tslint:disable */
export default {
  props: ['data', 'traceId'],
  data(){
    return {
      segmentId:[],
      showDetail: false,
      list: [],
      currentSpan: [],
    };
  },
  watch: {
    data() {
      if(!this.data.length) {return;}
      this.changeTree();
      this.tree.init({label:`TRACE_ROOT`, children: this.segmentId}, this.data);
      this.tree.draw()
    }
  },
  beforeDestroy() {
    d3.selectAll('.d3-tip').remove();
  },
  mounted() {
    this.changeTree();
    this.tree = new Trace(this.$refs.traceList, this)
    this.tree.init({label:`TRACE_ROOT`, children: this.segmentId}, this.data);
    this.tree.draw()
    // this.computedScale();
  },
  methods: {
    copy,
    handleSelectSpan(i) {
      this.currentSpan = i.data;
      this.showDetail = true;
    },
    traverseTree(node, spanId, segmentId, data){
      if (!node) return;
      if(node.spanId == spanId && node.segmentId == segmentId) {node.children.push(data);return;}
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            this.traverseTree(node.children[i],spanId,segmentId,data);
        }
      }
    },
    computedScale(i) {
       // 彩虹图
      const sequentialScale = d3.scaleSequential()
      .domain([0, this.list.length + 1])
      .interpolator(d3.interpolateCool);
      return sequentialScale(i);
    },
    changeTree(){
      if (this.data.length === 0) return [];
      this.list = Array.from(new Set(this.data.map(i => i.serviceCode)));
      this.segmentId = [];
      const segmentGroup = {}
      const segmentIdGroup = []
      this.data.forEach(i => {
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
          if(index !== -1){
            currentSegment[index].children.push(s);
            currentSegment[index].children.sort((a, b) => a.spanId - b.spanId );
          }
        })
        segmentGroup[id] = currentSegment[currentSegment.length-1]
      })
      segmentIdGroup.forEach(id => {
        segmentGroup[id].refs.forEach(ref => {
          if(ref.traceId === this.traceId) {
            this.traverseTree(segmentGroup[ref.parentSegmentId],ref.parentSpanId,ref.parentSegmentId,segmentGroup[id])
          };
        })
        // if(segmentGroup[id].refs.length !==0 ) delete segmentGroup[id];
      })
      for (let i in segmentGroup) {
        if(segmentGroup[i].refs.length ===0 )
        this.segmentId.push(segmentGroup[i]);
      }
      this.segmentId.forEach((_, i) => {
        this.collapse(this.segmentId[i]);
      })
    },
    collapse(d) {
      if(d.children){
        let dur = d.endTime - d.startTime;
        d.children.forEach(i => {
          dur -= (i.endTime - i.startTime);
        })
        d.dur = dur < 0 ? 0 : dur;
        d.children.forEach((i) => this.collapse(i));
      }
    }
  }
};
</script>
<style lang="scss">
.time-charts{
  overflow: auto;
  padding: 10px 30px;
}
.trace-node .group {
  cursor: pointer;
  fill-opacity: 0;
}
.trace-node-container{
  fill: rgba(0, 0, 0, 0);
  stroke-width: 5px;
  cursor: pointer;
  &:hover{
    fill: rgba(0,0,0,0.05)
  }
}
.trace-node  .node-text {
  font: 12.5px sans-serif;
  pointer-events: none;
}
.domain{display: none;}
.trace-link {
  fill: none;
  stroke: rgba(0,0,0,0.1);
  stroke-width: 2px;
}
.time-charts-item{
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid;
  font-size: 11px;
  border-radius: 4px;
}
 .trace-list{
   fill: rgba(0,0,0,0)
 }
 .trace-list .trace-node rect{
   &:hover{
     fill: rgba(0,0,0,0.05)
   }
 }
</style>
