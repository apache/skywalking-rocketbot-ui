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
  <div>
      <div @click="showSelectSpan" :class="['trace-item', 'level'+( data.level - 1)]">
        <div :class="['method', 'level'+( data.level - 1)]" :style="{'text-indent': (data.level - 1) * 10 + 'px' }">
          <span
              v-if="data.children && data.children.length > 0"
              @click.stop="toggle"
              :class="['trace-table-toggle', displayChildren? 'collapse': 'expand']">

          </span>
          <span v-tooltip:bottom="{content: data.endpointName, popperCls: ['trace-table-tooltip']}">
            {{data.endpointName}}
          </span>
        </div>
        <div class="start-time">
          {{formatTime(data.startTime)}}
        </div>
        <div class="gap">
          0
        </div>
        <div class="exec-ms">
         {{(data.endTime - data.startTime)?(data.endTime - data.startTime) : '0'}}
        </div>
        <div class="exec-percent">
          <div class="outer-progress_bar" :style="{width: outterPercent}">
              <div class="inner-progress_bar" :style="{width: innerPercent}"></div>
          </div>
        </div>
        <div class="self">
          {{data.dur ? data.dur + '' : '0'}}
        </div>
        <div class="api">
          <span v-tooltip:bottom="data.component||'-'">{{data.component || '-'}}</span>
        </div>
        <div class="application">
          <span v-tooltip:bottom="data.serviceCode||'-'">{{data.serviceCode}}</span>
        </div>
      </div>
    <div v-show="data.children && data.children.length > 0 && displayChildren" class="children-trace">
        <item v-for="(item, index) in data.children" :key="index" :data="item"> </item>
    </div>
  </div>

</template>
<style lang="scss" scoped>
  @import './trace.scss';
  .trace-item.level0{
      background: rgba(0, 0, 0, 0.04);;
      color: #448dfe;
      &:hover {
        background: rgba(0, 0, 0, 0.04);;
        color: #448dfe;
      }
      &::before{
        position: absolute;
        content: '';
        width: 5px;
        height: 100%;
        background: #448dfe;
        left: 0;
      }
  }

  .trace-table-toggle {
    cursor: pointer;
    height: 12px;
    width: 12px;
    display: inline-block;
    &.collapse {
      background: url('./collapse.gif') no-repeat;
      background-size: 12px 12px;
    }

    &.expand {
      background: url('./expand.gif') no-repeat;
      background-size: 12px 12px;
    }
  }

  .trace-item {
    display: flex;
    position: relative;
  }
  .trace-item.selected {
    background: rgba(0, 0, 0, 0.04);
  }

  .trace-item:not(.level0):hover {
    background: rgba(0, 0, 0, 0.04);
  }


  .trace-item>div {
    padding: 0 5px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .trace-item>div.method {
    padding-left: 10px;
  }
  .trace-item div.exec-percent {
    width: 10%;
    padding-left: 8px;
    padding-right: 8px;
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
      border:none;
      top: 1px;
    }
  }


</style>
<script type="text/javascript">
import moment from 'dayjs';
import Popper from 'popper.js';
export default {
  name: 'item',
  props: ['data'],
  data() {
    return {
      displayChildren: true,
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
    eventHub() {
      return this.$store.getters.globalEventHub;
    },
  },
  methods: {
    toggle() {
      this.displayChildren = ! this.displayChildren;
    },
    formatTime(timestamp) {
      return moment(timestamp).format('HH:mm:ss SSS');
    },
    showSelectSpan() {
      this.eventHub.$emit('HANDLE-SELECT-SPAN', this.data);
    },
  },
};
</script>
