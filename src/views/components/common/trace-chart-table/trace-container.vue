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
  <div class="trace">
    <div class="trace-header">
      <div class="method" :style="`width: ${method}px`">
        <span class="r cp" ref="dragger">
          <svg
            class="icon"
          >
            <use xlink:href="#settings_ethernet"></use>
          </svg>
        </span>
        {{ data[0].value }}
      </div>
      <div :class="item.label" v-for="(item, index) in data.slice(1)" :key="index">
        {{ item.value }}
      </div>
    </div>
    <Item :method="method" v-for="(item, index) in tableData" :data="item" :key="'key' + index" :type="type" />
    <slot></slot>
  </div>
</template>
<script lang="js">
  import { ProfileConstant, TraceConstant } from './trace-constant';
  import Item from './trace-item';

  export default {
    components: {Item},
    name: 'TraceContainer',
    props: ['type', 'tableData'],
    data() {
      return {
        method: 300,
      };
    },
    created() {
      this.data = this.type === 'profile' ? ProfileConstant : TraceConstant;
    },
    mounted() {
      const drag = this.$refs.dragger;
      drag.onmousedown = (event) => {
        const diffX = event.clientX;
        const copy = this.method;
        document.onmousemove = (documentEvent) => {
          const moveX = documentEvent.clientX - diffX;
          this.method = copy + moveX;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    },
  };
</script>
<style lang="scss" scoped>
  @import './trace.scss';
  .trace {
    font-size: 12px;
    height: 100%;
    overflow: auto;
  }
  .trace-header {
    white-space: nowrap;
    user-select: none;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .trace-header div {
    display: inline-block;
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    line-height: 30px;
    background-color: #f3f4f9;
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
