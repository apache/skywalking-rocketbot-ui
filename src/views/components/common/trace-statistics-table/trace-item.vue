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
    <div :class="['trace-item']" ref="traceItem">
      <div :class="['method']" :style="{ 'text-indent': 10 + 'px', width: `${method}px` }">
        <span v-tooltip:bottom="{ content: data.endpointName, popperCls: ['trace-table-tooltip'] }">
          {{ data.endpointName }}
        </span>
      </div>

      <div class="max-time">
        {{ data.maxTime }}
      </div>
      <div class="avg-time">
        {{ parseInt(data.avgTime) }}
      </div>
      <div class="min-time">
        {{ data.minTime }}
      </div>
      <div class="count">
        {{ data.count }}
      </div>
    </div>
  </div>
</template>
<script lang="js">
  export default {
    props: ['data', 'method'],
    watch: {
      data() {
        const items = document.querySelectorAll('.trace-item');
        for (const item of items) {
          item.style.background = '#fff';
        }
      },
    },

  };
</script>
<style lang="scss" scoped>
  @import './trace.scss';
  .trace-item {
    // display: flex;
    white-space: nowrap;
    position: relative;
    cursor: pointer;
  }

  .trace-item:hover {
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
</style>
