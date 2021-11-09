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
  <div class="rk-log-detail">
    <div class="mb-10 clear rk-flex" v-for="(item, index) in columns" :key="index">
      <template>
        <span class="g-sm-4 grey">{{ $t(item.value) }}:</span>
        <span v-if="item.label === 'timestamp'" class="g-sm-8">{{ currentLog[item.label] | dateformat }}</span>
        <textarea
          class="content"
          readonly="readonly"
          v-else-if="item.label === 'content'"
          v-model="currentLog[item.label]"
        />
        <span v-else-if="item.label === 'tags'" class="g-sm-8">
          <div v-for="(d, index) in logTags" :key="index">{{ d }}</div>
        </span>
        <span v-else class="g-sm-8">{{ currentLog[item.label] }}</span>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { ServiceLogDetail } from './log-constant';

  @Component
  export default class LogServiceDetailContent extends Vue {
    @Prop() private currentLog: any;
    private columns = ServiceLogDetail;
    private logContent: string = '';

    get logTags() {
      if (!this.currentLog.tags) {
        return [];
      }
      return this.currentLog.tags.map((d: { key: string; value: string }) => {
        return `${d.key} = ${d.value}`;
      });
    }
  }
</script>
<style lang="scss" scoped>
  .content {
    max-width: 700px;
    min-width: 500px;
    min-height: 500px;
    border: none;
    outline: none;
    color: #3d444f;
    overflow: auto;
  }
</style>
