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
  <div v-if="type === 'statistics'">
    <div :class="['trace-item']" ref="traceItem">
      <div :class="['method']">
        <span v-tooltip:bottom="{ content: data.groupRef.endpointName, popperCls: ['trace-table-tooltip'] }">
          {{ data.groupRef.endpointName }}
        </span>
      </div>
      <div :class="['type']">
        <span v-tooltip:bottom="{ content: data.groupRef.type, popperCls: ['trace-table-tooltip'] }">
          {{ data.groupRef.type }}
        </span>
      </div>
      <div class="max-time">
        {{ data.maxTime }}
      </div>
      <div class="min-time">
        {{ data.minTime }}
      </div>
      <div class="sum-time">
        {{ data.sumTime }}
      </div>
      <div class="avg-time">
        {{ parseInt(data.avgTime) }}
      </div>
      <div class="count">
        {{ data.count }}
      </div>
    </div>
  </div>
  <div v-else>
    <div
      @click="showSelectSpan"
      :class="['trace-item', 'level' + (data.level - 1), ...{ 'trace-item-error': data.isError }]"
      ref="traceItem"
    >
      <div
        :class="['method', 'level' + (data.level - 1)]"
        :style="{ 'text-indent': (data.level - 1) * 10 + 'px', width: `${method}px` }"
      >
        <svg
          class="icon vm cp trans"
          :style="!displayChildren ? 'transform: rotate(-90deg);' : ''"
          @click.stop="toggle"
          v-if="data.children && data.children.length"
        >
          <use xlink:href="#arrow-down"></use>
        </svg>
        <span v-tooltip:bottom="{ content: data.endpointName, popperCls: ['trace-table-tooltip'] }">
          {{ data.endpointName }}
        </span>
      </div>
      <div class="start-time">
        {{ data.startTime | dateformat }}
      </div>
      <div class="exec-ms">
        {{ data.endTime - data.startTime ? data.endTime - data.startTime : '0' }}
      </div>
      <div class="exec-percent">
        <div class="outer-progress_bar" :style="{ width: outterPercent }">
          <div class="inner-progress_bar" :style="{ width: innerPercent }"></div>
        </div>
      </div>
      <div class="self">
        {{ data.dur ? data.dur + '' : '0' }}
      </div>
      <div class="api">
        <span v-tooltip:bottom="data.component || '-'">{{ data.component || '-' }}</span>
      </div>
      <div class="application">
        <span v-tooltip:bottom="data.serviceCode || '-'">{{ data.serviceCode }}</span>
      </div>
      <div class="application" v-show="type === 'profile'">
        <span @click="viewSpanDetail">{{ $t('view') }}</span>
      </div>
    </div>
    <div v-show="data.children && data.children.length > 0 && displayChildren" class="children-trace">
      <item :method="method" v-for="(child, index) in data.children" :key="index" :data="child" :type="type" />
    </div>
  </div>
</template>
<script lang="js">
  export default {
    name: 'item',
    props: ['data', 'method', 'type'],
    data() {
      return {
        displayChildren: true,
      };
    },
    methods: {
      toggle() {
        this.displayChildren = !this.displayChildren;
      },
      showSelectSpan() {
        const items = document.querySelectorAll('.trace-item');
        for (const item of items) {
          item.style.background = '#fff';
        }
        (this.$refs.traceItem).style.background = 'rgba(0, 0, 0, 0.1)';
        this.$eventBus.$emit('HANDLE-SELECT-SPAN', this.data);
      },
      viewSpanDetail() {
        this.showSelectSpan();
        this.$eventBus.$emit('HANDLE-VIEW-SPAN', this.data);
      },
    },
    watch: {
      data(val, oldVal) {
        const items = document.querySelectorAll('.trace-item');
        for (const item of items) {
          item.style.background = '#fff';
        }
      },
    },
    computed: {
      selfTime() {
        return this.data.dur ? this.data.dur : 0;
      },
      execTime() {
        return this.data.endTime - this.data.startTime ? this.data.endTime - this.data.startTime : 0;
      },
      outterPercent() {
        if (this.data.level === 1) {
          return '100%';
        } else {
          const data = this.data;
          const exec = data.endTime - data.startTime ? data.endTime - data.startTime : 0;
          let result = (exec / data.totalExec) * 100;
          result = result > 100 ? 100 : result;
          const resultStr = result.toFixed(4) + '%';
          return resultStr === '0.0000%' ? '0.9%' : resultStr;
        }
      },
      innerPercent() {
        const result = (this.selfTime / this.execTime) * 100;
        const resultStr = result.toFixed(4) + '%';
        return resultStr === '0.0000%' ? '0.9%' : resultStr;
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import './trace.scss';
  .trace-item.level0 {
    color: #448dfe;
    &:hover {
      background: rgba(0, 0, 0, 0.04);
      color: #448dfe;
    }
    &::before {
      position: absolute;
      content: '';
      width: 5px;
      height: 100%;
      background: #448dfe;
      left: 0;
    }
  }
  .trace-item-error {
    color: #e54c17;
  }
  .trace-item {
    // display: flex;
    white-space: nowrap;
    position: relative;
    cursor: pointer;
  }
  .trace-item.selected {
    background: rgba(0, 0, 0, 0.04);
  }

  .trace-item:not(.level0):hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .trace-item > div {
    padding: 0 5px;
    display: inline-block;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .trace-item > div.method {
    padding-left: 10px;
  }
  .trace-item div.exec-percent {
    width: 100px;
    height: 30px;
    padding: 0 8px;
    .outer-progress_bar {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: rgb(63, 177, 227);
      position: relative;
      margin-top: 11px;
      border: none;
    }
    .inner-progress_bar {
      position: absolute;
      background: rgb(110, 64, 170);
      height: 4px;
      border-radius: 2px;
      left: 0;
      border: none;
      top: 1px;
    }
  }
</style>
