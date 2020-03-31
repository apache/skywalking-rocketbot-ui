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
  <div class="rk-alarm-table clear">
    <div v-for="(i, index) in data" :key="index" class="mb-10 clear">
      <div class="g-sm-3 grey sm hide-xs rk-alarm-time-line tr">
        {{ parseInt(i.startTime) | dateformat }}
      </div>
      <div class="rk-alarm-table-i g-sm-9">
        <div class="message mb-5 b">
          {{ i.message }}
        </div>
        <div
          class="rk-alarm-table-i-scope mr-10 l sm"
          :class="{
            blue: i.scope === 'Service',
            green: i.scope === 'Endpoint',
            yellow: i.scope === 'ServiceInstance',
          }"
        >
          {{ $t(i.scope.toLowerCase()) }}
        </div>
        <div class="grey sm show-xs">
          {{ parseInt(i.startTime) | dateformat }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class AlarmTable extends Vue {
    @Prop({ default: () => [] }) private data: any;
  }
</script>

<style lang="scss" scoped>
  .rk-alarm-table {
    padding: 30px 20px 20px 40px;
    flex-grow: 1;
    overflow: auto;
    height: 100%;
  }
  .rk-alarm-time-line {
    padding: 14px 30px;
    min-height: 63px;
    max-width: 132px;
  }
  .rk-alarm-table-i {
    padding: 10px 15px;
    border-left: 4px solid rgba(46, 47, 51, 0.05);
    position: relative;
    &:after {
      content: '';
      display: inline-block;
      position: absolute;
      width: 7px;
      height: 7px;
      left: -23px;
      top: 25px;
      border-radius: 4px;
      background-color: #448dfe;
    }
    &:before {
      content: '';
      display: inline-block;
      position: absolute;
      width: 1px;
      height: calc(100% + 11px);
      top: 0;
      left: -20px;
      border-radius: 5px;
      background-color: #448dfe99;
    }
  }
  .rk-alarm-table-i-scope {
    display: inline-block;
    padding: 0px 8px;
    border: 1px solid;
    margin-top: -1px;
    border-radius: 4px;
  }
</style>
