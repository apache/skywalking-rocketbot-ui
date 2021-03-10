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
  <div @click="showSelectSpan" class="log-item">
    <div v-for="(item, index) in columns" :key="index" :class="item.label">
      <span v-if="item.label === 'timestamp'">
        {{ data.timestamp | dateformat }}
      </span>
      <span v-else-if="item.label === 'tags'">
        {{ tags }}
      </span>
      <router-link
        v-else-if="item.label === 'traceId' && !noLink"
        :to="{ name: 'trace', query: { traceid: data[item.label] } }"
      >
        <span>{{ data[item.label] }}</span>
      </router-link>
      <span v-else>{{ data[item.label] }}</span>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { ServiceLogConstants } from './log-constant';

  @Component
  export default class ServiceItem extends Vue {
    @Prop() private data: any;
    @Prop() private noLink!: any;
    private columns = ServiceLogConstants;
    private get tags() {
      if (!this.data.tags) {
        return '';
      }
      return String(this.data.tags.map((d: any) => `${d.key}=${d.value}`));
    }
    private showSelectSpan() {
      this.$eventBus.$emit('HANDLE-SELECT-LOG', this.data);
    }
  }
</script>
<style lang="scss" scoped>
  .log-item {
    white-space: nowrap;
    position: relative;
    cursor: pointer;
    .traceId {
      width: 390px;
      color: #448dfe;
      cursor: pointer;
      span {
        display: inline-block;
        width: 100%;
        line-height: 30px;
      }
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

  .log-item:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .log-item > div {
    line-height: 1.3;
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
    width: 100%;
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
