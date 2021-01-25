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
  <div @click="showSelectSpan" :class="['log-item', 'clearfix']" ref="logItem">
    <div
      v-for="(item, index) in columns"
      :key="index"
      :class="['method', ['message', 'stack'].includes(item.label) ? 'autoHeight' : '']"
      :style="{
        lineHeight: 1.3,
        width: `${item.drag ? item.method : ''}px`,
      }"
    >
      <span v-if="['message', 'stack'].includes(item.label)" class="text" v-html="lineBreak(data[item.label])"></span>
      <template v-else-if="item.label === 'time'">
        {{ data.time | dateformat }}
      </template>
      <span v-else class="" v-tooltip:bottom="data[item.label] || '-'">{{ data[item.label] || '-' }}</span>
    </div>
  </div>
</template>
<script lang="js">
  import { BrowserLogConstants } from './log-constant';

  export default {
    name: 'item',
    props: ['data', 'method'],
    watch: {
      data: {
        handler() {
          this.setLogItemHeight();
        },
        deep: true,
        immediate: true,
      },
    },
    data() {
      return {
        columns: BrowserLogConstants,
        displayChildren: true,
        selectedSpan: 0,
      };
    },
    computed: {},
    methods: {
      lineBreak(str = '') {
        const param = str
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\r\n/g, '<br />')
          .replace(/\n/g, '<br />');
        return param;
      },
      setLogItemHeight() {
        this.$nextTick(() => {
          const heights = [];
          this.$refs.logItem.childNodes.forEach((item) => {
            if (item.getAttribute('class').indexOf('autoHeight') > -1) {
              const autoHeightChild = item.childNodes[0];
              const height = autoHeightChild.getBoundingClientRect().height;
              heights.push(height + 11);
            }
          });
          const max = Math.max(...heights);
          this.$refs.logItem.style.height = max + 'px';
        });

      },
      showSelectSpan() {
        const items = document.querySelectorAll('.log-item');
        for (const item of items) {
          item.style.background = '#fff';
        }
        this.$refs.logItem.style.background = 'rgba(0, 0, 0, 0.1)';
        this.$eventBus.$emit('HANDLE-SELECT-LOG', this.data);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .log-item {
    white-space: nowrap;
    position: relative;
    cursor: pointer;
    /*height: 100px;*/
  }

  .log-item.selected {
    background: rgba(0, 0, 0, 0.04);
  }

  .log-item:not(.level0):hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .log-item:hover {
    background: rgba(0, 0, 0, 0.04) !important;
  }

  .log-item > div {
    width: 140px;
    padding: 0 5px;
    display: inline-block;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .log-item .text {
    width: 100% !important;
    /*padding: 0 5px;*/
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .log-item > div.method {
    height: 100%;
    padding: 3px 8px;
  }
</style>
