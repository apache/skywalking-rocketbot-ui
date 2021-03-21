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
  <div>
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
      <item :method="method" v-for="(item, index) in data.children" :key="index" :data="item" :type="type"> </item>
    </div>
  </div>
</template>
<script lang="js">
  export default {
    name: 'item',
    props: ['data', 'type', 'method'],
    watch: {
      data() {
        const items = document.querySelectorAll('.trace-item');
        for (const item of items) {
          item.style.background = '#fff';
        }
      },
    },
    data() {
      return {
        displayChildren: true,
        selectedSpan: 0,
      };
    },
    computed: {
      selfTime() {
        const {data} = this;
        return  data.dur ? data.dur : 0;
      },
      execTime() {
        const {data} = this;
        return  (data.endTime - data.startTime) ? (data.endTime - data.startTime) : 0;
      },
      outterPercent() {
        if (this.data.level === 1) {
          return '100%';
        } else {
          const data = this.data;
          const exec = (data.endTime - data.startTime) ? (data.endTime - data.startTime) : 0;
          let result = (exec / data.totalExec * 100);
          result = result > 100 ? 100 : result;
          result = result.toFixed(4) + '%';
          return result === '0.0000%' ? '0.9%' : result;
        }
      },
      innerPercent() {
        const result = (this.selfTime / this.execTime) * 100 .toFixed(4) + '%';
        return result === '0.0000%' ? '0.9%' : result;
      },
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
        this.$refs.traceItem.style.background = 'rgba(0, 0, 0, 0.1)';
        this.$eventBus.$emit('HANDLE-SELECT-SPAN', this.data);
      },
      viewSpanDetail() {
        this.showSelectSpan();
        this.$eventBus.$emit('HANDLE-VIEW-SPAN', this.data);
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
