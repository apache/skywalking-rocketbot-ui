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
  <nav class="rk-alarm-tool flex-h">
    <div class="mr-10" style="padding: 3px 15px 0">
      <div class="sm grey">{{ $t('searchKeyword') }}</div>
      <input type="text" disabled v-model="keyword" class="rk-alarm-tool-input" @input="handleFetch(1)" />
    </div>
    <RkPage
      class="mt-15"
      :currentSize="20"
      :currentPage="pageNum"
      @changePage="(pageNum) => handleFetch(pageNum)"
      :total="total"
    />
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Action, Mutation, Getter } from 'vuex-class';

  interface Option {
    key: string | number;
    label: string | number;
  }

  @Component
  export default class AlarmTool extends Vue {
    @Getter('durationTime') private durationTime: any;
    @Action('rocketAlarm/GET_ALARM') private GET_ALARM: any;
    @Prop() private total!: number;
    @Prop() private keyword!: string;
    private pageNum: number = 1;
    private handleFetch(pageNum: number) {
      this.pageNum = pageNum;
      this.GET_ALARM({
        duration: this.durationTime,
        scope: 'Service',
        paging: {
          pageNum,
          pageSize: 20,
          needTotal: true,
        },
        keyword: this.keyword,
      });
    }

    private beforeMount() {
      this.handleFetch(1);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-alarm-tool {
    border-bottom: 1px solid #c1c5ca41;
    height: 52px;
    background-color: #333840;
    padding: 0 15px;
    color: #efefef;
    flex-shrink: 0;
  }

  .rk-alarm-tool-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
  }
</style>
