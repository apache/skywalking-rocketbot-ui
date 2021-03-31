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
  <div class="rk-chart-table">
    <table>
      <tr>
        <th>{{ $t('name') }}</th>
        <th>{{ $t('value') }}</th>
      </tr>
      <tr v-for="key in dataKeys" :key="key">
        <td>{{ key }}</td>
        <td>{{ data[key][dataLength(data[key])] }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartTable extends Vue {
    @Prop() private data!: any;

    private get dataKeys() {
      const keys = Object.keys(this.data || {}).filter((i: any) => Array.isArray(this.data[i]) && this.data[i].length);
      return keys;
    }

    private dataLength(param: any[]) {
      return param.length - 1 || 0;
    }
  }
</script>
<style lang="scss" scoped>
  .rk-chart-table {
    table {
      width: 100%;
      border-top: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
    tr {
      width: 100%;
      border: 1px solid #ccc;
    }
    th,
    td {
      border-left: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      width: 50%;
      text-align: center;
    }
  }
</style>
