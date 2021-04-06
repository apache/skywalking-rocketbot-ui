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
    <div ref="chartTable">
      <div class="row header flex-h" :style="`width: ${nameWidth + initWidth}px`">
        <div class="name" :style="`width: ${nameWidth}px`">
          {{ item.tableHeaderCol1 || $t('name') }}
          <i class="r cp" ref="draggerName"><rk-icon icon="settings_ethernet"/></i>
        </div>
        <div class="value-col" v-if="showTableValues">
          {{ item.tableHeaderCol2 || $t('value') }}
        </div>
      </div>
      <div class="row flex-h" v-for="key in dataKeys" :key="key" :style="`width: ${nameWidth + initWidth}px`">
        <div :style="`width: ${nameWidth}px`">{{ key }}</div>
        <div class="value-col" v-if="showTableValues">{{ data[key][dataLength(data[key])] }}</div>
      </div>
    </div>
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
    private initWidth: number = 0;

    private get dataKeys() {
      const keys = Object.keys(this.data || {}).filter((i: any) => Array.isArray(this.data[i]) && this.data[i].length);
      return keys;
    }

    private get showTableValues() {
      return this.item.showTableValues === 'true' || this.item.showTableValues === true ? true : false;
    }

    private mounted() {
      const chartTable: any = this.$refs.chartTable;
      const width = this.showTableValues ? chartTable.offsetWidth / 2 : chartTable.offsetWidth;
      this.initWidth = this.showTableValues ? chartTable.offsetWidth / 2 : 0;
      this.nameWidth = width - 5;
      const drag: any = this.$refs.draggerName;
      drag.onmousedown = (event: MouseEvent) => {
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
    .name {
      padding-left: 15px;
    }
    .row {
      border-left: 1px solid #ccc;
      height: 20px;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        border-right: 1px solid #ccc;
        text-align: center;
        height: 20px;
        line-height: 20px;
        display: inline-block;
      }
      div:last-child {
        border-bottom: 1px solid #ccc;
      }
      div:nth-last-child(2) {
        border-bottom: 1px solid #ccc;
      }
    }
    .row:first-child {
      div {
        border-top: 1px solid #ccc;
        background: #eee;
      }
    }
    .header {
      color: #000;
      font-weight: bold;
    }
    .value-col {
      width: 50%;
    }
  }
</style>
