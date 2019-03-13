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
  <div class="rk-trace-detail flex-v">
    <div class="rk-trace-detail-wrapper"  v-if="current.endpointNames">
      <h5 class="mb-5 mt-0">
        <svg v-if="current.isError" class="icon red vm mr-5 sm">
          <use xlink:href="#clear"></use>
        </svg>
        <span class="vm">{{current.endpointNames[0]}}</span>
      </h5>
      <div class="mb-5 blue sm">
        <select class="rk-trace-detail-ids" @change="GET_TRACE_SPANS({traceId: i})">
          <option v-for="i in current.traceIds" :value="i" :key="i">{{i}}</option>
        </select>
      </div>
      <div class="rk-tag mr-5">Start</div><span class="mr-15 sm">{{parseInt(current.start) | dateformat}}</span>
      <div class="rk-tag mr-5">Duration</div><span class="mr-15 sm">{{current.duration}} ms</span>
      <div class="rk-tag mr-5">Spans</div><span class="sm">9</span>
    </div>
    <TraceDetailChart v-if="current.endpointNames" :data="spans" :traceId="current.traceIds[0]"/>
    <div v-else class="flex-h container">
      <svg class="icon rk-icon-trace">
        <use xlink:href="#unlink"></use>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import TraceDetailChart from './trace-detail-charts.vue';
import { Trace, Span } from '../../../store/interfaces';
import { Action } from 'vuex-class';

@Component({ components: { TraceDetailChart } })
export default class Header extends Vue {
  @Action('rocketTrace/GET_TRACE_SPANS') private GET_TRACE_SPANS: any;
  @Prop() private spans!: Span[];
  @Prop() private current!: Trace;
}
</script>

<style lang="scss" scoped>
.rk-trace-detail {
  flex-shrink: 0;
  height: 100%;
  width: 70%;
}
.rk-trace-detail-wrapper {
  padding: 8px 30px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
.rk-trace-detail-ids{
  background-color: rgba(0, 0, 0, 0);
  outline: 0;
  border-style: unset;
  color: inherit;
  border: 1px solid;
  border-radius: 4px;
}
.rk-tag{
  display: inline-block;
  border-radius: 4px;
  padding: 0px 7px;
  background-color: #40454e;
  color: #eee;
}
.rk-icon-trace{
  width:100px;
  height:100px;
  margin: 0 auto;
  fill: rgba(46, 47, 51, 0.15);
}
</style>
