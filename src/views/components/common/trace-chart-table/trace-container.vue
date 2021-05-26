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
    <div class="trace-header" v-if="type === 'statistics'">
      <div :class="item.label" v-for="(item, index) in headerData" :key="index">
        {{ item.value }}
        <span class="r cp" @click="sortStatistics(item.key)" :key="componentKey" v-if="(item.key != 'endpointName') & (item.key != 'type')">
          <svg class="icon">
            <use xlink:href="#sort"></use>
          </svg>
        </span>
      </div>
    </div>
    <div class="trace-header" v-else>
      <div class="method" :style="`width: ${method}px`">
        <span class="r cp" ref="dragger">
          <svg class="icon">
            <use xlink:href="#settings_ethernet"></use>
          </svg>
        </span>
        {{ headerData[0].value }}
      </div>
      <div :class="item.label" v-for="(item, index) in headerData.slice(1)" :key="index">
        {{ item.value }}
      </div>
    </div>
    <Item :method="method" v-for="(item, index) in tableData" :data="item" :key="'key' + index" :type="type" />
    <slot></slot>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ProfileConstant, TraceConstant, StatisticsConstant } from './trace-constant';
  import Item from './trace-item.vue';

  @Component({
    components: {
      Item,
    },
  })

  export default class TraceContainer extends Vue {
    @Prop()
    public tableData: any;
    @Prop()
    public type!: string;

    private headerData: Array<{ label: string; value: string; }>|undefined;
    private method: number = 300;
    private componentKey: number = 0;
    private flag: boolean =  true;

    public created(): void {
      if ( this.type === 'profile' ) {
          this.headerData = ProfileConstant;
      } else if ( this.type === 'statistics' ) {
          this.headerData = StatisticsConstant;
      } else {
          this.headerData = TraceConstant;
      }
    }

    public mounted(): void {
      if (this.type === 'statistics') {
        return;
      }
      const drag: any = this.$refs.dragger;
      drag.onmousedown = (event: any) => {
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
    }

    private sortStatistics(key: string): void {
      const element = this.tableData;
      for (let i = 0; i < element.length; i++) {
        for (let j = 0; j < element.length - i - 1; j++) {
          let val1;
          let val2;
          if (key === 'maxTime') {
            val1 = element[j].maxTime;
            val2 = element[j + 1].maxTime;
          }
          if (key === 'minTime') {
            val1 = element[j].minTime;
            val2 = element[j + 1].minTime;
          }
          if (key === 'avgTime') {
            val1 = element[j].avgTime;
            val2 = element[j + 1].avgTime;
          }
          if (key === 'sumTime') {
            val1 = element[j].sumTime;
            val2 = element[j + 1].sumTime;
          }
          if (key === 'count') {
            val1 = element[j].count;
            val2 = element[j + 1].count;
          }
          if (this.flag) {
            if (val1 < val2) {
              const tmp = element[j];
              element[j] = element[j + 1];
              element[j + 1] = tmp;
            }
          } else {
            if (val1 > val2) {
              const tmp = element[j];
              element[j] = element[j + 1];
              element[j + 1] = tmp;
            }
          }
        }
      }
      this.tableData = element;
      this.componentKey += 1;
      this.flag = !this.flag;
    }
  }
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
