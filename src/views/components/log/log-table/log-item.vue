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
    <div @click="showSelectSpan" :class="['log-item']" ref="logItem">
      <div
        v-for="(item, index) in columns"
        :key="index"
        :class="['method']"
        :style="{
          lineHeight: 1.3,
          width: `${index === 0 ? method : ''}px`,
        }"
      >
        <template v-if="item.label === 'message'">
          <span
            class="text w360"
            v-tooltip:bottom="lineBreak(data.message) || '-'"
            v-html="lineBreak(data.message)"
          ></span>
        </template>
        <template v-else-if="item.label === 'time'">
          {{ data.time | dateformat }}
        </template>
        <template v-else>
          <span class="text" v-tooltip:bottom="data[item.label] || '-'">{{ data[item.label] || '-' }}</span>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="js">
  import {  BrowserLogConstants } from './log-constant';

  export default {
    name: 'item',
    props: ['data', 'type', 'method'],
    created() {
    },
    watch: {
    },
    data() {
      return {
        columns:BrowserLogConstants,
        displayChildren: true,
        selectedSpan: 0,
      };
    },
    computed: {

    },
    methods: {
      lineBreak(str = '') {
        let s = str
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br />')
                .replace(/\r\n/g, '<br />');
        return s;
      },
      showSelectSpan() {
        const items = document.querySelectorAll('.log-item');
        for (const item of items) {
          item.style.background = '#fff';
        }
        this.$refs.logItem.style.background = 'rgba(0, 0, 0, 0.1)';
        this.$eventBus.$emit('HANDLE-SELECT-SPAN', this.data);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .log-item {
    /*display: flex;*/
    align-items: center;
    white-space: nowrap;
    position: relative;
    cursor: pointer;
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .log-item .text {
    width: 120px;
    /*padding: 0 5px;*/
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .log-item > div.method {
    /*padding-left: 10px;*/
    padding: 3px 8px;
    &:not(first-child) {
      vertical-align: middle;
    }
  }
  .w360 {
    width: 360px !important;
  }
</style>
