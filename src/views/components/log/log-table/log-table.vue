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
  <div class="log">
    <div class="log-header">
      <template v-for="(item, index) in columns">
        <div class="method" :style="`width: ${item.method}px`" v-if="item.drag" :key="index">
          <span class="r cp" ref="dragger" :data-index="index">
            <rk-icon icon="settings_ethernet" />
          </span>
          {{ $t(item.value) }}
        </div>
        <div v-else :class="item.label" :key="index">
          {{ $t(item.value) }}
        </div>
      </template>
    </div>
    <div v-if="type === 'browser'">
      <BrowserItem :method="method" v-for="(item, index) in tableData" :data="item" :key="'key' + index" />
    </div>
    <div v-else>
      <ServiceItem v-for="(item, index) in tableData" :data="item" :key="'key' + index" :noLink="noLink" />
    </div>
    <slot></slot>
  </div>
</template>
<script lang="js">
  import { ServiceLogConstants, BrowserLogConstants } from './log-constant';
  import BrowserItem from './log-browser-item';
  import ServiceItem from './log-service-item';

  export default {
    components: { ServiceItem, BrowserItem },
    name: 'LogContainer',
    props: ['type', 'tableData', 'noLink'],
    data() {
      return {
        method: 380,
        columns: this.type === 'browser' ? BrowserLogConstants : ServiceLogConstants,
      };
    },
    created() {
      switch (this.type) {
        case 'browser':
          this.data = BrowserLogConstants;
          break;
        case 'service':
          this.data = ServiceLogConstants;
          break;
        default:
          break;
      }
    },
    mounted() {
      const drags = this.$refs.dragger || [];
      drags.forEach((drag) => {
        drag.onmousedown = (event) => {
          const diffX = event.clientX;
          const index = +drag.dataset.index;

          const item = this.data[index];
          const copy = item.method;
          document.onmousemove = (documentEvent) => {
            const moveX = documentEvent.clientX - diffX;
            const method = copy + moveX;
            this.$set(this.data, index, { ...item, method });
          };
          document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      });

    },
  };
</script>
<style lang="scss" scoped>
  /*@import './trace.scss';*/
  .log {
    font-size: 12px;
    height: 100%;
    overflow: auto;
  }

  .log-header {
    /*display: flex;*/
    white-space: nowrap;
    user-select: none;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    /*background-color: #f3f4f9;*/
    .traceId {
      width: 390px;
    }
    .content,
    .tags {
      width: 300px;
    }
    .serviceInstanceName,
    .serviceName {
      width: 200px;
    }
  }

  .log-header div {
    /*min-width: 140px;*/
    width: 140px;
    /*flex-grow: 1;*/
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
