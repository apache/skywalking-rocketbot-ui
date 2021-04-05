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
  <div class="rk-chart-edit">
    <div class="rk-chart-edit-container">
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('title') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.title"
          @change="setItemConfig({ type: 'title', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('metrics') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.metricName"
          @change="setItemConfig({ type: 'metricName', value: $event.target.value })"
        />
        <select
          class="long"
          v-model="itemConfig.queryMetricType"
          @change="setItemConfig({ type: 'queryMetricType', value: $event.target.value })"
        >
          <option v-for="query in queryMetricTypesList" :value="query.value" :key="query.value"
            >{{ query.label }}
          </option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="isChartType">
        <div class="title grey sm">{{ $t('chartType') }}:</div>
        <select
          class="long"
          v-model="itemConfig.chartType"
          @change="setItemConfig({ type: 'chartType', value: $event.target.value })"
        >
          <option v-for="chart in ChartTypeOptions" :value="chart.value" :key="chart.value">
            {{ chart.label }}
          </option>
        </select>
      </div>
      <div class="flex-h mb-5" v-if="isReadSingleValue">
        <div class="title grey sm">{{ $t('chartType') }}:</div>
        <select
          class="long"
          v-model="itemConfig.chartType"
          @change="setItemConfig({ type: 'chartType', value: $event.target.value })"
        >
          <option value="ChartNum" :key="`ChartNum`">no chart</option>
          <option value="ChartSlow" :key="`ChartSlow`">Bar Chart</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="isLabel">
        <div class="title grey sm">{{ $t('labels') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.metricLabels"
          @change="setItemConfig({ type: 'metricLabels', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5" v-show="isLabel">
        <div class="title grey sm">{{ $t('labelsIndex') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.labelsIndex"
          @change="setItemConfig({ type: 'labelsIndex', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5" v-show="!isDatabase && !pageTypes.includes(type)">
        <div class="title grey sm">{{ $t('entityType') }}:</div>
        <select
          class="long"
          v-model="itemConfig.entityType"
          @change="setItemConfig({ type: 'entityType', value: $event.target.value })"
        >
          <option v-for="type in EntityType" :value="type.key" :key="type.key">{{ type.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="itemConfig.independentSelector && isDatabase">
        <div class="title grey sm">{{ $t('currentDatabase') }}:</div>
        <select
          class="long"
          v-model="itemConfig.currentDatabase"
          @change="setItemConfig({ type: 'currentDatabase', value: $event.target.value })"
        >
          <option v-for="database in stateDashboardOption.databases" :value="database.label" :key="database.key"
            >{{ database.label }}
          </option>
        </select>
      </div>
      <div
        class="flex-h mb-5"
        v-show="
          itemConfig.entityType !== EntityType[1].key && itemConfig.independentSelector && !isDatabase && !isBrowser
        "
      >
        <div class="title grey sm">{{ $t('currentService') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.servicesKey"
          @change="setItemConfig({ type: 'servicesKey', value: $event.target.value })"
        />
        <select
          class="long"
          v-model="itemConfig.currentService"
          @change="setItemConfig({ type: 'currentService', value: $event.target.value })"
        >
          <option v-for="service in services" :value="service.label" :key="service.key">
            {{ service.label }}
          </option>
        </select>
      </div>
      <div
        class="flex-h mb-5"
        v-show="
          itemConfig.entityType === EntityType[2].key && itemConfig.independentSelector && !isDatabase && !isBrowser
        "
      >
        <div class="title grey sm">{{ $t('currentEndpoint') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.endpointsKey"
          @change="setItemConfig({ type: 'endpointsKey', value: $event.target.value })"
        />
        <select
          class="long"
          v-model="itemConfig.currentEndpoint"
          @change="setItemConfig({ type: 'currentEndpoint', value: $event.target.value })"
        >
          <option v-for="endpoint in endpoints" :value="endpoint.label" :key="endpoint.key"
            >{{ endpoint.label }}
          </option>
        </select>
      </div>
      <div
        class="flex-h mb-5"
        v-show="
          itemConfig.entityType === EntityType[3].key && itemConfig.independentSelector && !isDatabase && !isBrowser
        "
      >
        <div class="title grey sm">{{ $t('currentInstance') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.instancesKey"
          @change="setItemConfig({ type: 'instancesKey', value: $event.target.value })"
        />
        <select
          class="long"
          v-model="itemConfig.currentInstance"
          @change="setItemConfig({ type: 'currentInstance', value: $event.target.value })"
        >
          <option v-for="instance in instances" :value="instance.label" :key="instance.key"
            >{{ instance.label }}
          </option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="!isIndependentSelector && !isBrowser">
        <div class="title grey sm">{{ $t('independentSelector') }}:</div>
        <select
          class="long"
          v-model="itemConfig.independentSelector"
          @change="setItemConfig({ type: 'independentSelector', value: $event.target.value })"
        >
          <option v-for="type in IndependentType" :value="type.key" :key="type.key">{{ type.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="nameMetrics.includes(itemConfig.queryMetricType)">
        <div class="title grey sm">{{ $t('parentService') }}:</div>
        <select
          class="long"
          v-model="itemConfig.parentService"
          @change="setItemConfig({ type: 'parentService', value: $event.target.value })"
        >
          <option :value="true">{{ $t('isParentService') }}</option>
          <option :value="false">{{ $t('noneParentService') }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="nameMetrics.includes(itemConfig.queryMetricType)">
        <div class="title grey sm">{{ $t('sortOrder') }}:</div>
        <select
          class="long"
          v-model="itemConfig.sortOrder"
          @change="setItemConfig({ type: 'sortOrder', value: $event.target.value })"
        >
          <option :value="'DES'">{{ $t('descendOrder') }}</option>
          <option :value="'ASC'">{{ $t('increaseOrder') }}</option>
        </select>
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('unit') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.unit"
          @change="setItemConfig({ type: 'unit', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('width') }}:</div>
        <input
          type="number"
          min="1"
          max="12"
          class="rk-chart-edit-input long"
          :value="itemConfig.width"
          @change="setItemConfig({ type: 'width', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('height') }}:</div>
        <input
          type="number"
          min="1"
          class="rk-chart-edit-input long"
          :value="itemConfig.height"
          @change="setItemConfig({ type: 'height', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('aggregation') }}:</div>
        <select
          class="long"
          v-model="itemConfig.aggregation"
          @change="setItemConfig({ type: 'aggregation', value: $event.target.value })"
        >
          <option v-for="type in CalculationType" :value="type.value" :key="type.value">{{ type.label }} </option>
        </select>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="itemConfig.aggregationNum"
          @change="setItemConfig({ type: 'aggregationNum', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5" v-show="itemConfig.chartType === ChartTypeOptions[3].value">
        <div class="title grey sm">{{ $t('tableHeader') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          placeholder="col-1"
          :value="itemConfig.tableHeaderCol1"
          @change="setItemConfig({ type: 'tableHeaderCol1', value: $event.target.value })"
        />
        <input
          type="text"
          class="rk-chart-edit-input long"
          placeholder="col-2"
          :value="itemConfig.tableHeaderCol2"
          @change="setItemConfig({ type: 'tableHeaderCol2', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5" v-show="itemConfig.chartType === ChartTypeOptions[3].value">
        <div class="title grey sm">{{ $t('tableValues') }}:</div>
        <select
          class="long"
          v-model="itemConfig.showTableValues"
          @change="setItemConfig({ type: 'showTableValues', value: $event.target.value })"
        >
          <option :value="true">{{ $t('show') }}</option>
          <option :value="false">{{ $t('hide') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { State, Getter, Mutation, Action } from 'vuex-class';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { TopologyType } from '@/constants/constant';
  import {
    EntityType,
    BrowserEntityType,
    IndependentType,
    MetricsType,
    QueryMetricTypes,
    MetricChartType,
    CalculationType,
    ChartTypeOptions,
  } from './constant';
  import { DASHBOARDTYPE } from '../constant';

  @Component
  export default class ChartEdit extends Vue {
    @State('rocketOption') private stateDashboardOption: any;
    @State('rocketData') private rocketComps!: any;
    @Mutation('EDIT_COMP_CONFIG') private EDIT_COMP_CONFIG: any;
    @Mutation('rocketTopo/EDIT_TOPO_INSTANCE_CONFIG') private EDIT_TOPO_INSTANCE_CONFIG: any;
    @Mutation('rocketTopo/EDIT_TOPO_ENDPOINT_CONFIG') private EDIT_TOPO_ENDPOINT_CONFIG: any;
    @Action('GET_ITEM_SERVICES') private GET_ITEM_SERVICES: any;
    @Action('GET_ITEM_ENDPOINTS') private GET_ITEM_ENDPOINTS: any;
    @Action('GET_ITEM_INSTANCES') private GET_ITEM_INSTANCES: any;
    @Action('TYPE_METRICS') private TYPE_METRICS: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    @Prop() private intervalTime!: any;
    @Prop() private type!: string;
    private itemConfig: any = {};
    private EntityType = EntityType;
    private IndependentType = IndependentType;
    private CalculationType = CalculationType;
    private ChartTypeOptions = ChartTypeOptions;
    private services: any = [];
    private endpoints: any = [];
    private instances: any = [];
    private queryMetricTypesList: any = [];
    private isDatabase = false;
    private isBrowser = false;
    private isLabel = false;
    private isIndependentSelector = false;
    private nameMetrics = ['sortMetrics', 'readSampledRecords'];
    private pageTypes = [TopologyType.TOPOLOGY_ENDPOINT, TopologyType.TOPOLOGY_INSTANCE] as string[];
    private isChartType = false;
    private isReadSingleValue = false;

    private created() {
      this.itemConfig = this.item;
      this.initConfig();
      if (!this.itemConfig.independentSelector || this.pageTypes.includes(this.type)) {
        return;
      }
      this.setItemServices();
    }

    private initConfig() {
      this.isDatabase = this.pageTypes.includes(this.type)
        ? false
        : this.rocketComps.tree[this.rocketComps.group].type === DASHBOARDTYPE.DATABASE
        ? true
        : false;
      this.isBrowser = this.rocketComps.tree[this.rocketComps.group].type === DASHBOARDTYPE.BROWSER;
      if (this.isBrowser) {
        this.setItemConfig({ type: 'independentSelector', value: 'false' });
        this.setItemConfig({ type: 'sortOrder', value: 'DES' });
        this.EntityType = BrowserEntityType;
      }
      this.queryMetricTypesList = QueryMetricTypes[this.item.metricType] || [];
      this.isLabel = this.itemConfig.metricType === MetricsType.LABELED_VALUE ? true : false;
      this.isIndependentSelector =
        this.rocketComps.tree[this.rocketComps.group].type === 'metric' || this.pageTypes.includes(this.type);
      this.isChartType = ['readMetricsValues', 'readLabeledMetricsValues'].includes(this.itemConfig.queryMetricType);
    }

    private setItemConfig(params: { type: string; value: string }) {
      this.itemConfig[params.type] = params.value;
      const types = ['endpointsKey', 'instancesKey', 'currentService'];
      const typesUpdate = ['title', 'width', 'height', 'unit'];
      if (params.type === 'servicesKey') {
        this.setItemServices(true);
      }
      if (types.includes(params.type)) {
        this.getServiceObject(true);
      }
      if (typesUpdate.includes(params.type)) {
        this.$emit('updateStatus', params.type, params.value);
      }
      if (params.type === 'entityType') {
        if (this.itemConfig.currentService) {
          this.getServiceObject(true);
        }
      }
      if (params.type === 'metricName') {
        this.updateMetricName(params);
        return;
      }
      if (params.type === 'queryMetricType') {
        this.updateQueryMetricType(params);
        return;
      }
      if (params.type === 'independentSelector' || params.type === 'parentService') {
        this.itemConfig[params.type] = params.value === 'true' ? true : false;
        if (this.type === this.pageTypes[0]) {
          this.EDIT_TOPO_ENDPOINT_CONFIG({
            index: this.index,
            values: { [params.type]: this.itemConfig[params.type] },
          });
        } else if (this.type === this.pageTypes[1]) {
          this.EDIT_TOPO_INSTANCE_CONFIG({
            index: this.index,
            values: { [params.type]: this.itemConfig[params.type] },
          });
        } else {
          this.EDIT_COMP_CONFIG({ index: this.index, values: { [params.type]: this.itemConfig[params.type] } });
        }
      }
      if (params.type === 'aggregation' && ['milliseconds', 'seconds'].includes(this.itemConfig.aggregation)) {
        this.updateAggregation(params);
        return;
      }
      if (this.type === this.pageTypes[0]) {
        this.EDIT_TOPO_ENDPOINT_CONFIG({
          index: this.index,
          values: { [params.type]: params.value },
        });
      } else if (this.type === this.pageTypes[1]) {
        this.EDIT_TOPO_INSTANCE_CONFIG({
          index: this.index,
          values: { [params.type]: params.value },
        });
      } else {
        this.EDIT_COMP_CONFIG({ index: this.index, values: { [params.type]: params.value } });
      }
    }

    private updateMetricName(params: { type: string; value: string }) {
      this.TYPE_METRICS({ name: params.value }).then((data: Array<{ typeOfMetrics: string }>) => {
        if (!data.length) {
          return;
        }
        if (data.length > 1) {
          const length = data.filter((d: { typeOfMetrics: string }) => d.typeOfMetrics !== MetricsType.REGULAR_VALUE)
            .length;
          if (length) {
            this.$emit('updateStatus', 'metricType', MetricsType.UNKNOWN);
            return;
          }
        }
        const { typeOfMetrics } = data[0];
        this.$emit('updateStatus', 'metricType', typeOfMetrics);
        this.queryMetricTypesList = QueryMetricTypes[typeOfMetrics] || [];
        this.itemConfig.queryMetricType = this.queryMetricTypesList[0] && this.queryMetricTypesList[0].value;
        this.isChartType = ['readMetricsValues', 'readLabeledMetricsValues'].includes(this.itemConfig.queryMetricType);
        this.isLabel = typeOfMetrics === MetricsType.LABELED_VALUE ? true : false;
        const values = {
          metricType: typeOfMetrics,
          queryMetricType: this.itemConfig.queryMetricType,
          chartType: MetricChartType[this.itemConfig.queryMetricType],
          metricName: params.value,
        };
        if (this.type === this.pageTypes[0]) {
          this.EDIT_TOPO_ENDPOINT_CONFIG({
            index: this.index,
            values,
          });
        } else if (this.type === this.pageTypes[1]) {
          this.EDIT_TOPO_INSTANCE_CONFIG({
            index: this.index,
            values,
          });
        } else {
          this.EDIT_COMP_CONFIG({
            index: this.index,
            values,
          });
        }
        this.itemConfig = {
          ...this.itemConfig,
          ...values,
        };
      });
    }

    private updateAggregation(params: { type: string; value: string }) {
      const values = {
        aggregationNum: 'YYYY-MM-DD HH:mm:ss',
        [params.type]: params.value,
      };
      this.itemConfig = {
        ...this.itemConfig,
        ...values,
      };
      this.EDIT_COMP_CONFIG({
        index: this.index,
        values,
      });
    }

    private updateQueryMetricType(params: { type: string; value: string }) {
      const values = {
        chartType: MetricChartType[params.value],
        [params.type]: params.value,
      };
      if (this.type === this.pageTypes[0]) {
        this.EDIT_TOPO_ENDPOINT_CONFIG({
          index: this.index,
          values,
        });
      } else if (this.type === this.pageTypes[1]) {
        this.EDIT_TOPO_INSTANCE_CONFIG({
          index: this.index,
          values,
        });
      } else {
        this.EDIT_COMP_CONFIG({
          index: this.index,
          values,
        });
      }
      this.itemConfig = {
        ...this.itemConfig,
        ...values,
      };
      this.isChartType = ['readMetricsValues', 'readLabeledMetricsValues'].includes(this.itemConfig.queryMetricType);
    }

    private setItemServices(update: boolean = false) {
      this.GET_ITEM_SERVICES({ keyword: this.itemConfig.servicesKey || '', duration: this.durationTime }).then(
        (result: Array<{ label: string; key: string }>) => {
          this.services = result;
          if (update) {
            if (result.length) {
              this.itemConfig.currentService = result[0].key;
            } else {
              this.itemConfig.currentService = '';
            }
          }
          if (this.itemConfig.currentService) {
            this.getServiceObject();
          }
        },
      );
    }

    private getServiceObject(update: boolean = false) {
      const service =
        this.services.filter((d: { key: string; label: string }) => d.label === this.itemConfig.currentService)[0] ||
        {};
      const serviceId = service.key;

      if (!serviceId) {
        return;
      }
      if (this.itemConfig.entityType === EntityType[2].key) {
        this.GET_ITEM_ENDPOINTS({
          serviceId,
          keyword: this.itemConfig.endpointsKey || '',
          duration: this.durationTime,
        }).then((data: Array<{ key: string; label: string }>) => {
          this.endpoints = data;
          if (update) {
            if (data.length) {
              this.itemConfig.currentEndpoint = data[0].key;
            } else {
              this.itemConfig.currentEndpoint = '';
            }
            this.EDIT_COMP_CONFIG({ index: this.index, values: { currentEndpoint: this.itemConfig.currentEndpoint } });
          }
        });
      } else if (this.itemConfig.entityType === EntityType[3].key) {
        this.GET_ITEM_INSTANCES({
          serviceId,
          keyword: this.itemConfig.instancesKey || '',
          duration: this.durationTime,
        }).then((data: Array<{ key: string; label: string }>) => {
          this.instances = data;
          if (update) {
            if (data.length) {
              this.itemConfig.currentInstance = data[0].key;
            } else {
              this.itemConfig.currentInstance = '';
            }
            this.EDIT_COMP_CONFIG({ index: this.index, values: { currentInstance: this.itemConfig.currentInstance } });
          }
        });
      }
    }

    @Watch('itemConfig.queryMetricType')
    private watchQueryMetricType(val: string) {
      this.isReadSingleValue = ['readMetricsValue'].includes(val);
    }
  }
</script>
<style lang="scss" scoped>
  .rk-chart-edit {
    margin: 0 -10px;
    height: 100%;
    overflow: auto;

    select {
      margin: 0;
      height: 30px;
      border: 1px solid #ddd;
      background-color: #fff;
      outline: none;
    }
  }

  .rk-chart-edit-container {
    padding: 7px 5px;
    border: 1px dashed rgba(196, 200, 225, 0.5);
    border-radius: 4px;
    height: 100%;

    .title {
      width: 120px;
      flex-shrink: 0;
    }
  }

  .rk-chart-edit-input {
    border: 0;
    outline: 0;
    padding: 4px 10px;
    border-radius: 3px;
    border: 1px solid #ddd;
  }
</style>
