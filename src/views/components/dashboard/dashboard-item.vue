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
  <div
    class="rk-dashboard-item"
    :class="`g-sm-${item.w}`"
    :style="rocketGlobal.edit ? 'height:350px' : `height:${item.h}px;`"
  >
    <div class="rk-dashboard-item-title ell">
      <svg class="icon cp red r" v-if="rocketGlobal.edit" @click="DELETE_COMP(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
      <span>{{ item.t }}</span>
      <span v-if="status === 'UNKNOWN'" class="item-status">( {{ $t('unknownMetrics') }} )</span>
    </div>
    <div class="rk-dashboard-item-body">
      <div style="height:100%;">
        <component
          :is="rocketGlobal.edit ? 'ChartEdit' : item.c"
          ref="chart"
          :item="item"
          :index="index"
          :intervalTime="intervalTime"
          :data="chartSource"
          @updateStatus="(type) => setStatus(type)"
        ></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import charts from './charts';
  import metricsConfig, { QueryTypes } from './constant';
  import { uuid } from '@/utils/uuid.ts';

  import { Mutation, State, Getter, Action } from 'vuex-class';

  @Component({
    components: { ...charts },
  })
  export default class DashboardItem extends Vue {
    @Mutation('EDIT_COMP_CONFIG') private EDIT_COMP_CONFIG: any;
    @Mutation('DELETE_COMP') private DELETE_COMP: any;
    @Mutation('SWICH_COMP') private SWICH_COMP: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private rocketGlobal!: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    private status = 'UNKNOWN';
    private chartSource: any = { nodes: [], avgNum: 0 };

    private beforeMount() {
      const configs = metricsConfig as any;
      this.status = this.item.metricType;
      if (this.item.id === '') {
        this.EDIT_COMP_CONFIG({ index: this.index, values: { id: uuid() } });
      }
      if (!this.item.version) {
        let type = this.item.d;
        if (this.item.c === 'ChartNum' && !type.includes('Avg')) {
          type = type + 'Avg';
        }
        this.EDIT_COMP_CONFIG({ index: this.index, values: { ...configs[type], d: type, version: '1.0' } });
      }
      this.chartRender();
      this.SET_EVENTS([this.chartRender]);
    }

    private chartRender() {
      this.GET_QUERY({
        duration: this.durationTime,
        index: this.index,
      }).then((params: { metricName: string; [key: string]: any; id: string }) => {
        if (!params) {
          return;
        }

        const { queryMetricType } = this.item;
        const resVal = params[queryMetricType];

        if (queryMetricType === QueryTypes.ReadMetricsValue) {
          this.chartSource = { avgNum: resVal };
        }
        if (queryMetricType === QueryTypes.ReadMetricsValues) {
          const { values } = resVal.values;
          const data = values.map((item: { value: number }) => item.value);

          this.chartSource = { [params.metricName]: data };
        }
        if (queryMetricType === QueryTypes.SortMetrics) {
          this.chartSource = resVal;
        }
        if (queryMetricType === QueryTypes.READHEATMAP) {
          const nodes = [] as any;
          resVal.values.forEach((items: { values: number[] }, x: number) => {
            const grids = items.values.map((val: number, y: number) => [x, y, val]);

            nodes.push(...grids);
          });

          this.chartSource = { nodes }; // nodes: number[][]
        }
        if (queryMetricType === QueryTypes.ReadLabeledMetricsValues) {
          // {[label: string]: number[]}
          this.chartSource = {};
          for (const item of resVal) {
            const list = item.values.values.map((d: { value: number }) => d.value);

            this.chartSource[item.label] = list;
          }
        }
      });
    }

    private setStatus(data: string) {
      this.status = data;
    }
  }
</script>
<style lang="scss">
  .rk-dashboard-item {
    display: flex;
    height: 100%;
    flex-direction: column;
    padding-left: 5px;
    padding-right: 5px;
  }
  .dashboard-item-shadow {
    background-color: #448dfe15;
    position: absolute;
    border: 1px solid #448dfec0;
    border-radius: 4px;
  }
  .rk-dashboard-item-title {
    flex-shrink: 0;
    user-select: none;
    line-height: 16px;
    border-radius: 2px;
    background-color: rgba(196, 200, 225, 0.2);
    color: #9da5b2;
    padding: 6px 10px;
  }
  .rk-dashboard-item-title .hint {
    color: #fbb03b;
    padding-left: 10px;
  }
  .dashboard-item-title-input {
    border-style: unset;
    background-color: #ffffffcc;
    outline: 0;
    border-radius: 3px;
    padding: 5px;
    height: 16px;
    margin-left: -5px;
  }
  .dashboard-item-resize {
    position: absolute;
    fill: #9da5b2;
    z-index: 1;
    width: 8px;
    height: 8px;
    padding: 3px;
    right: -4px;
    bottom: 0;
    cursor: se-resize;
  }
  .rk-dashboard-item-body {
    padding: 7px 10px;
    flex-grow: 1;
    // height:100%;
    height: calc(100% - 28px);
  }
  .item-status {
    color: red;
    display: inline-block;
    margin-left: 10px;
  }
</style>
