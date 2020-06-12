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
  <div class="rk-dashboard-item" :class="`g-sm-${width}`" :style="`height:${height}px;`">
    <div class="rk-dashboard-item-title ell">
      <svg class="icon cp red r" v-show="rocketGlobal.edit" @click="deleteItem(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
      <span>{{ title }}</span>
      <span v-show="unit"> ( {{ unit }} ) </span>
      <span v-show="status === 'UNKNOWN'" class="item-status">( {{ $t('unknownMetrics') }} )</span>
      <span v-show="!rocketGlobal.edit && !pageTypes.includes(type)" @click="editComponentConfig">
        <svg class="icon cp r">
          <use xlink:href="#lock"></use>
        </svg>
      </span>
    </div>
    <div class="rk-dashboard-item-body">
      <div style="height:100%;">
        <component
          :is="rocketGlobal.edit ? 'ChartEdit' : itemConfig.chartType"
          ref="chart"
          :item="itemConfig"
          :index="index"
          :intervalTime="intervalTime"
          :data="chartSource"
          :type="type"
          @updateStatus="(type, value) => setStatus(type, value)"
        ></component>
      </div>
    </div>
    <rk-sidebox
      width="70%"
      :fixed="true"
      :title="$t('editConfig')"
      :show.sync="dialogConfigVisible"
      @closeSideboxCallback="chartRender()"
    >
      <div class="config-box">
        <component
          :is="'ChartEdit'"
          ref="chart"
          :item="itemConfig"
          :index="index"
          :intervalTime="intervalTime"
          :data="chartSource"
        ></component>
      </div>
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import charts from './charts';
  import { QueryTypes } from './constant';
  import { TopologyType, ObjectsType } from '../../constant';
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
    @Mutation('rocketTopo/DELETE_TOPO_ENDPOINT') private DELETE_TOPO_ENDPOINT: any;
    @Mutation('rocketTopo/DELETE_TOPO_INSTANCE') private DELETE_TOPO_INSTANCE: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    @Prop() private type!: string;
    @Prop() private updateObjects!: string;

    private pageTypes = [TopologyType.TOPOLOGY_ENDPOINT, TopologyType.TOPOLOGY_INSTANCE] as any[];
    private dialogConfigVisible = false;
    private status = 'UNKNOWN';
    private title = 'Title';
    private unit = '';
    private width = 3;
    private height = 300;
    private chartSource: any = {};
    private itemConfig: any = {};

    private created() {
      this.status = this.item.metricType;
      this.title = this.item.title;
      this.width = this.item.width;
      this.height = this.item.height;
      this.unit = this.item.unit;
      this.itemConfig = this.item;
      const types = [ObjectsType.UPDATE_INSTANCES, ObjectsType.UPDATE_ENDPOINTS, ObjectsType.UPDATE_DASHBOARD] as any[];

      if (!types.includes(this.updateObjects)) {
        return;
      }
      setTimeout(() => {
        this.chartRender();
      }, 200);
    }

    private chartRender() {
      if (this.rocketGlobal.edit) {
        return;
      }

      this.GET_QUERY({
        duration: this.durationTime,
        index: this.index,
        type: this.type,
      }).then((params: Array<{ metricName: string; [key: string]: any; config: any }>) => {
        if (!params) {
          return;
        }
        if (!params.length) {
          return;
        }
        this.itemConfig = params[0].config;
        const { queryMetricType } = this.itemConfig;
        let data = params;
        if (queryMetricType !== QueryTypes.ReadMetricsValues) {
          data = [params[0]];
        }
        this.chartValue(data);
      });
    }

    private chartValue(data: Array<{ metricName: string; [key: string]: any; config: any }>) {
      this.chartSource = {};
      for (const params of data) {
        const { queryMetricType, aggregation, aggregationNum, metricLabels, labelsIndex } = params.config;
        const resVal = params[queryMetricType];

        if (queryMetricType === QueryTypes.ReadMetricsValue) {
          this.chartSource = {
            avgNum: this.aggregationValue({ data: resVal, type: aggregation, aggregationNum: Number(aggregationNum) }),
          };
        }
        if (queryMetricType === QueryTypes.ReadMetricsValues) {
          if (!(resVal && resVal.values)) {
            this.chartSource[params.metricName] = [];
            return;
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
          if (!(resVal && resVal.values)) {
            this.chartSource = { nodes: [] };
            return;
          }
          resVal.values.forEach((items: { values: number[] }, x: number) => {
            const grids = items.values.map((val: number, y: number) => [
              x,
              y,
              this.aggregationValue({ data: val, type: aggregation, aggregationNum: Number(aggregationNum) }),
            ]);

            nodes.push(...grids);
          });
          let buckets = [] as any;
          if (resVal.buckets.length) {
            buckets = [resVal.buckets[0].min, ...resVal.buckets.map((item: { min: string; max: string }) => item.max)];
          }

          this.chartSource = { nodes, buckets }; // nodes: number[][]
        }
        if (queryMetricType === QueryTypes.ReadLabeledMetricsValues) {
          const labels = (metricLabels || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
          const indexList = (labelsIndex || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));

          this.chartSource = {};
          for (const item of resVal || []) {
            const list = item.values.values.map((d: { value: number }) =>
              this.aggregationValue({ data: d.value, type: aggregation, aggregationNum: Number(aggregationNum) }),
            );

            const indexNum = indexList.findIndex((d: string) => d === item.label);
            if (labels[indexNum] && indexNum > -1) {
              this.chartSource[labels[indexNum]] = list; // {[label: string]: number[]}
            } else {
              this.chartSource[item.label] = list;
            }
          }
        }
      }
    }

    private editComponentConfig() {
      this.dialogConfigVisible = true;
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

    private deleteItem(index: number) {
      if (this.type === this.pageTypes[0]) {
        this.DELETE_TOPO_ENDPOINT(index);
      } else if (this.type === this.pageTypes[1]) {
        this.DELETE_TOPO_INSTANCE(index);
      } else {
        this.DELETE_COMP(index);
      }
    }

    @Watch('rocketOption.updateDashboard')
    private watchCurrentSelectors() {
      setTimeout(() => {
        this.chartRender();
      }, 200);
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
  .config-box {
    padding: 40px 30px;
  }
</style>
