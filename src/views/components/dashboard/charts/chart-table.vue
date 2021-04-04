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
    <table ref="chartTable">
      <tr>
        <th :style="`width: ${nameWidth}px`">
          {{ item.tableHeaderCol1 || $t('name') }}
          <span class="r cp" ref="draggerName"><rk-icon icon="settings_ethernet"/></span>
        </th>
        <th class="value-col">
          {{ item.tableHeaderCol2 || $t('value') }}
        </th>
      </tr>
      <tr v-for="key in dataKeys" :key="key">
        <td :style="`width: ${nameWidth}px`">{{ key }}</td>
        <td class="value-col" v-show="item.showTableValues">{{ data[key][dataLength(data[key])] }}</td>
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
    @Prop() private item: any;

    private nameWidth: number = 0;
    // private initWidth: number = 0;

    private get dataKeys() {
      const keys = Object.keys(this.data || {}).filter((i: any) => Array.isArray(this.data[i]) && this.data[i].length);
      return keys;
    }

    private mounted() {
      const chartTable: any = this.$refs.chartTable;
      this.nameWidth = chartTable.offsetWidth / 2;
      // this.initWidth = chartTable.offsetWidth / 2;
      const drag: any = this.$refs.draggerName;
      drag.onmousedown = (event: any) => {
        const diffX = event.clientX;
        const copy = this.nameWidth;
        document.onmousemove = (documentEvent) => {
          const moveX = documentEvent.clientX - diffX;
          this.nameWidth = copy + moveX;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }

    private dataLength(param: number[]) {
      return param.length - 1 || 0;
    }
  }
</script>
<style lang="scss" scoped>
  .rk-chart-table {
    height: 100%;
    width: 100%;
    overflow: auto;
    table {
      border-top: 1px solid #ccc;
      border-right: 1px solid #ccc;
      overflow: auto;
    }
    tr {
      border: 1px solid #ccc;
    }
    th,
    td {
      border-left: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      text-align: center;
      height: 20px;
      line-height: 20px;
    }
    .value-col {
      width: 50%;
    }
  }
</style>
