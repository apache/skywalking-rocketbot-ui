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
    :class="`g-sm-${width}`"
    :style="`height:${height}px;`"
    v-if="!excludeCharts.includes(item.c) && !excludeMetrics.includes(item.d)"
  >
    <div class="rk-dashboard-item-title ell">
      <svg class="icon cp red r" v-if="rocketGlobal.edit" @click="DELETE_COMP(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
      <span>{{ title }}</span>
      <span v-show="unit"> ( {{ unit }} ) </span>
      <span v-show="status === 'UNKNOWN'" class="item-status">( {{ $t('unknownMetrics') }} )</span>
    </div>
    <div class="rk-dashboard-item-body">
      <div style="height:100%;">
        <component
          :is="rocketGlobal.edit ? 'ChartEdit' : item.c"
          ref="chart"
          :item="itemConfig"
          :index="index"
          :intervalTime="intervalTime"
          :data="chartSource"
          @updateStatus="(type, value) => setStatus(type, value)"
        ></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import charts from './charts';
  import metricsConfig, { QueryTypes, PercentileLabels, PercentileItem } from './constant';
  import { MetricsType, CalculationType } from './charts/constant';
  import { uuid } from '@/utils/uuid.ts';

  import { Mutation, State, Getter, Action } from 'vuex-class';

  @Component({
    components: { ...charts },
  })
  export default class DashboardItem extends Vue {
    @State('rocketOption') private rocketOption: any;
    @State('rocketbot') private rocketGlobal: any;
    @Mutation('EDIT_COMP_CONFIG') private EDIT_COMP_CONFIG: any;
    @Mutation('DELETE_COMP') private DELETE_COMP: any;
    @Mutation('SWICH_COMP') private SWICH_COMP: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    private excludeMetrics = ['endpointTopology', 'endpointTraces']; // ChartBrief ChartInstance
    private excludeCharts = ['ChartBrief', 'ChartInstance'];
    private status = 'UNKNOWN';
    private title = 'Title';
    private unit = '';
    private width = 3;
    private height = 300;
    private chartSource: any = { nodes: [], avgNum: 0 };
    private itemConfig: any = {};

    private created() {
      const configs = metricsConfig as any;
      const id = this.item.id || uuid();
      this.status = this.item.metricType;
      this.title = this.item.t;
      this.width = this.item.w;
      this.height = this.item.h;
      this.unit = this.item.unit;
      this.itemConfig = this.item;
      if (!this.item.version || !this.item.id) {
        let type = this.item.d;
        if (this.item.c === 'ChartNum' && !type.includes('Avg')) {
          type = type + 'Avg';
        }
        const values = { ...configs[type], d: type, version: '1.0', id };
        this.EDIT_COMP_CONFIG({ index: this.index, values });
        this.itemConfig = {
          ...this.item,
          ...values,
        };
      }
      this.chartRender();
    }

    private chartRender() {
      if (this.rocketGlobal.edit) {
        return;
      }
      this.GET_QUERY({
        duration: this.durationTime,
        index: this.index,
      }).then((params: Array<{ metricName: string; [key: string]: any; id: string }>) => {
        if (!params) {
          return;
        }
        if (!params.length) {
          return;
        }
        const { queryMetricType } = this.itemConfig;
        let data = params;
        if (queryMetricType !== QueryTypes.ReadMetricsValues) {
          data = [params[0]];
        }
        this.chartConfig(data);
      });
    }

    private chartConfig(data: Array<{ metricName: string; [key: string]: any; id: string }>) {
      this.chartSource = {};
      for (const params of data) {
        const { queryMetricType, aggregation, aggregationNum, metricLabels } = this.itemConfig;
        const resVal = params[queryMetricType];
        const labels = (metricLabels || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));

        if (queryMetricType === QueryTypes.ReadMetricsValue) {
          this.chartSource = {
            avgNum: this.aggregationValue({ data: resVal, type: aggregation, aggregationNum: Number(aggregationNum) }),
          };
        }
        if (queryMetricType === QueryTypes.ReadMetricsValues) {
          if (!resVal.values) {
            this.chartSource[params.metricName] = [];
          }
          const { values } = resVal.values;
          this.chartSource[params.metricName] = values.map((item: { value: number }) =>
            this.aggregationValue({ data: item.value, type: aggregation, aggregationNum: Number(aggregationNum) }),
          );
        }
        if (queryMetricType === QueryTypes.SortMetrics || queryMetricType === QueryTypes.ReadSampledRecords) {
          this.chartSource = (resVal || []).map((item: { value: number }) => {
            return {
              ...item,
              value: this.aggregationValue({
                data: item.value,
                type: aggregation,
                aggregationNum: Number(aggregationNum),
              }),
            };
          });
        }
        if (queryMetricType === QueryTypes.READHEATMAP) {
          const nodes = [] as any;
          resVal.values.forEach((items: { values: number[] }, x: number) => {
            const grids = items.values.map((val: number, y: number) => [
              x,
              y,
              this.aggregationValue({ data: val, type: aggregation, aggregationNum: Number(aggregationNum) }),
            ]);

            nodes.push(...grids);
          });

          this.chartSource = { nodes }; // nodes: number[][]
        }
        if (queryMetricType === QueryTypes.ReadLabeledMetricsValues) {
          // {[label: string]: number[]}
          this.chartSource = {};
          resVal.forEach((item: any, index: number) => {
            const list = item.values.values.map((d: { value: number }) =>
              this.aggregationValue({ data: d.value, type: aggregation, aggregationNum: Number(aggregationNum) }),
            );

            this.chartSource[labels[index]] = list;
          });
        }
      }
    }

    private aggregationValue(json: { data: number; type: string; aggregationNum: number }) {
      if (isNaN(json.aggregationNum)) {
        return json.data;
      }
      if (json.type === CalculationType[0].value) {
        return json.data + json.aggregationNum;
      }
      if (json.type === CalculationType[1].value) {
        return json.data - json.aggregationNum;
      }
      if (json.type === CalculationType[2].value) {
        return json.data * json.aggregationNum;
      }
      if (json.type === CalculationType[3].value) {
        return json.data / json.aggregationNum;
      }
      return json.data;
    }

    private setStatus(type: string, value: any) {
      if (type === 'metricType') {
        this.status = value;
      }
      if (type === 'title') {
        this.title = value;
      }
      if (type === 'width') {
        this.width = value;
      }
      if (type === 'height') {
        this.height = value;
      }
      if (type === 'unit') {
        this.unit = value;
      }
    }

    @Watch('rocketOption.currentInstance')
    private watchCurrentInstance() {
      this.chartRender();
    }
    @Watch('rocketOption.currentEndpoint')
    private watchCurrentEndpoint() {
      this.chartRender();
    }
    @Watch('rocketOption.currentDatabase')
    private watchCurrentDatabase() {
      this.chartRender();
    }
    @Watch('durationTime')
    private watchDurationTime() {
      this.chartRender();
    }
    @Watch('rocketGlobal.edit')
    private watchRerender() {
      this.chartRender();
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
