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
  <div style="overflow: auto;height: 100%;" class="scroll_hide">
    <div class="rk-chart-slow clear">
      <div class="rk-chart-slow-i" v-for="(i, index) in datas" :key="index">
        <svg class="icon vm r grey link-hover cp" @click="handleClick((i.traceIds && i.traceIds[0]) || i.name)">
          <use xlink:href="#review-list"></use>
        </svg>
        <div class="mb-5 ell" v-tooltip:top.ellipsis="i.name || ''">
          <span class="calls sm mr-10">{{ i.value }}</span>
          <span class="cp link-hover">{{ i.name + getTraceId(i) }}</span>
        </div>
        <RkProgress :precent="(i.value / maxValue) * 100" color="#bf99f8" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import copy from '@/utils/copy';

  @Component({})
  export default class ChartSlow extends Vue {
    @Prop() private data!: any;
    @Prop() private item!: any;
    @Prop() private type!: any;
    @Prop() private intervalTime!: any;
    get maxValue() {
      if (!this.data.length) {
        return null;
      }
      const temp: number[] = this.data.map((i: any) => i.value);
      return Math.max.apply(null, temp);
    }
    private getTraceId(i: any) {
      return i.traceIds && i.traceIds[0] ? ` - ${i.traceIds[0]}` : '';
    }
    private handleClick(i: any) {
      copy(i);
    }
    get datas() {
      if (!this.data.length) {
        return [];
      }
      const val = this.item.sortOrder;

      switch (val) {
        case 'DES':
          this.data.sort((a: any, b: any) => b.value - a.value);
          break;
        case 'ASC':
          this.data.sort((a: any, b: any) => a.value - b.value);
          break;
        default:
          break;
      }
      return this.data;
    }
  }
</script>
<style lang="scss" scoped>
  .rk-chart-slow {
    height: 100%;
    .calls {
      padding: 0 5px;
      display: inline-block;
      background-color: #40454e;
      color: #eee;
      border-radius: 4px;
    }
  }
  .rk-chart-slow-i {
    padding: 6px 0;
  }
</style>
