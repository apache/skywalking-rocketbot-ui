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
          :value="item.t"
          @change="setItemConfig({ index, type: 't', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('metrics') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="metricName"
          @change="setItemConfig({ index, type: 'metricName', value: $event.target.value })"
        />
        <select
          class="long"
          v-model="queryMetricType"
          @change="setItemConfig({ index, type: 'queryMetricType', value: $event.target.value })"
        >
          <option v-for="query in queryMetricTypesList" :value="query.value" :key="query.value">{{
            query.label
          }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="isLabel">
        <div class="title grey sm">{{ $t('labels') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="metricLabels"
          @change="setItemConfig({ index, type: 'metricLabels', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5" v-show="!isDatabase">
        <div class="title grey sm">{{ $t('entityType') }}:</div>
        <select
          class="long"
          v-model="itemType"
          @change="setItemConfig({ index, type: 'entityType', value: $event.target.value })"
        >
          <option v-for="type in EntityType" :value="type.key" :key="type.key">{{ type.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="independentSelector && isDatabase">
        <div class="title grey sm">{{ $t('currentDatabase') }}:</div>
        <select
          class="long"
          v-model="currentDatabase"
          @change="setItemConfig({ index, type: 'currentDatabase', value: $event.target.value })"
        >
          <option v-for="database in stateDashboardOption.databases" :value="database.key" :key="database.key">{{
            database.label
          }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="itemType !== EntityType[1].key && independentSelector && !isDatabase">
        <div class="title grey sm">{{ $t('currentService') }}:</div>
        <select
          class="long"
          v-model="currentService"
          @change="setItemConfig({ index, type: 'currentService', value: $event.target.value })"
        >
          <option v-for="service in stateDashboardOption.services" :value="service.key" :key="service.key">{{
            service.label
          }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="itemType === EntityType[2].key && independentSelector && !isDatabase">
        <div class="title grey sm">{{ $t('currentEndpoint') }}:</div>
        <select
          class="long"
          v-model="currentEndpoint"
          @change="setItemConfig({ index, type: 'currentEndpoint', value: $event.target.value })"
        >
          <option v-for="endpoint in endpoints" :value="endpoint.key" :key="endpoint.key">{{ endpoint.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="itemType === EntityType[3].key && independentSelector && !isDatabase">
        <div class="title grey sm">{{ $t('currentInstance') }}:</div>
        <select
          class="long"
          v-model="currentInstance"
          @change="setItemConfig({ index, type: 'currentInstance', value: $event.target.value })"
        >
          <option v-for="instance in instances" :value="instance.key" :key="instance.key">{{ instance.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="rocketComps.tree[this.rocketComps.group].type !== 'metric'">
        <div class="title grey sm">{{ $t('independentSelector') }}:</div>
        <select
          class="long"
          v-model="independentSelector"
          @change="setItemConfig({ index, type: 'independentSelector', value: $event.target.value })"
        >
          <option v-for="type in IndependentType" :value="type.key" :key="type.key">{{ type.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('width') }}:</div>
        <input
          type="number"
          min="1"
          max="12"
          class="rk-chart-edit-input long"
          :value="item.w"
          @change="EDIT_COMP_CONFIG({ index, values: { w: $event.target.value } })"
        />
      </div>
      <div class="flex-h">
        <div class="title grey sm">{{ $t('height') }}:</div>
        <input
          type="number"
          min="1"
          class="rk-chart-edit-input long"
          :value="item.h"
          @change="EDIT_COMP_CONFIG({ index, values: { h: $event.target.value } })"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { State, Getter, Mutation, Action } from 'vuex-class';
  import { Component, Prop } from 'vue-property-decorator';

  import { EntityType, IndependentType, MetricsType, QueryMetricTypes, MetricChartType } from './constant';
  import { DASHBOARDTYPE } from '../constant';

  @Component
  export default class ChartEdit extends Vue {
    @State('rocketOption') private stateDashboardOption: any;
    @State('rocketData') private rocketComps!: any;
    @Mutation('EDIT_COMP_CONFIG') private EDIT_COMP_CONFIG: any;
    @Action('GET_ITEM_ENDPOINTS') private GET_ITEM_ENDPOINTS: any;
    @Action('GET_ITEM_INSTANCES') private GET_ITEM_INSTANCES: any;
    @Action('TYPE_METRICS') private TYPE_METRICS: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    @Prop() private intervalTime!: any;
    private EntityType = EntityType;
    private IndependentType = IndependentType;
    private itemType = '';
    private endpoints: any = [];
    private instances: any = [];
    private currentService = '';
    private currentEndpoint = '';
    private currentInstance = '';
    private currentDatabase = '';
    private independentSelector = true;
    private metricType = '';
    private metricName = '';
    private queryMetricTypesList: any = [];
    private queryMetricType = '';
    private isDatabase = false;
    private isLabel = false;
    private metricLabels = '';

    private created() {
      this.isDatabase = this.rocketComps.tree[this.rocketComps.group].type === DASHBOARDTYPE.DATABASE ? true : false;
      this.itemType = this.item.entityType;
      this.independentSelector = this.item.independentSelector;
      this.metricType = this.item.metricType;
      this.metricName = this.item.metricName;
      this.queryMetricType = this.item.queryMetricType;
      this.queryMetricTypesList = QueryMetricTypes[this.item.metricType] || [];
      this.isLabel = this.metricType === MetricsType.LABELED_VALUE ? true : false;
      this.metricLabels = this.item.metricLabels;
      if (!this.independentSelector) {
        return;
      }
      this.selectorsConfig();
    }

    private selectorsConfig() {
      this.endpoints = this.stateDashboardOption.endpoints;
      this.instances = this.stateDashboardOption.instances;
      this.currentDatabase = this.item.currentDatabase || this.stateDashboardOption.currentDatabase;
      this.currentService = this.item.currentService || this.stateDashboardOption.currentService;
      this.currentEndpoint = this.item.currentEndpoint || this.stateDashboardOption.currentEndpoint;
      this.currentInstance = this.item.currentInstance || this.stateDashboardOption.currentInstance;
      this.getServiceObject(this.currentService, this.index, false);
    }

    private setItemConfig(params: { index: number; type: string; value: string }) {
      if (params.type === 'currentService') {
        let serviceId = this.item.currentService;

        if (!this.item.version) {
          serviceId = this.stateDashboardOption.currentService.key;
        }
        serviceId = params.value;
        this.getServiceObject(serviceId, params.index);
      }
      if (params.type === 't') {
        this.$emit('updateStatus', 'title', params.value);
      }
      if (params.type === 'metricName') {
        this.metricName = params.value;
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
          this.queryMetricType = this.queryMetricTypesList[0] && this.queryMetricTypesList[0].value;
          this.isLabel = typeOfMetrics === MetricsType.LABELED_VALUE ? true : false;
          this.EDIT_COMP_CONFIG({
            index: params.index,
            values: {
              metricType: typeOfMetrics,
              queryMetricType: this.queryMetricType,
              c: MetricChartType[this.queryMetricType],
              metricName: params.value,
            },
          });
        });
        return;
      }
      if (params.type === 'queryMetricType') {
        this.EDIT_COMP_CONFIG({
          index: params.index,
          values: {
            c: MetricChartType[params.value],
            [params.type]: params.value,
          },
        });
        return;
      }
      if (params.type === 'independentSelector') {
        this.independentSelector = params.value === 'true' ? true : false;
        this.EDIT_COMP_CONFIG({ index: params.index, values: { [params.type]: this.independentSelector } });
        return;
      }
      this.EDIT_COMP_CONFIG({ index: params.index, values: { [params.type]: params.value } });
    }

    private getServiceObject(serviceId: string, index: number, update: boolean = true) {
      if (this.itemType === EntityType[1].key) {
        this.GET_ITEM_ENDPOINTS({ serviceId, keyword: '', duration: this.durationTime }).then(
          (data: Array<{ key: string; label: string }>) => {
            this.endpoints = data;
            if (data.length && update) {
              this.currentEndpoint = data[0].key;
              this.EDIT_COMP_CONFIG({ index, values: { currentEndpoint: this.currentEndpoint } });
            }
          },
        );
      } else if (this.itemType === EntityType[2].key) {
        this.GET_ITEM_INSTANCES({ serviceId, keyword: '', duration: this.durationTime }).then(
          (data: Array<{ key: string; label: string }>) => {
            this.instances = data;
            if (data.length && update) {
              this.currentInstance = data[0].key;
              this.EDIT_COMP_CONFIG({ index, values: { currentInstance: this.currentInstance } });
            }
          },
        );
      }
    }
  }
</script>
<style lang="scss">
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
