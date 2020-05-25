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
          :value="itemConfig.t"
          @change="setItemConfig({ type: 't', value: $event.target.value })"
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
          :value="itemConfig.metricLabels"
          @change="setItemConfig({ type: 'metricLabels', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5" v-show="!isDatabase">
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
          <option v-for="database in stateDashboardOption.databases" :value="database.label" :key="database.key">{{
            database.label
          }}</option>
        </select>
      </div>
      <div
        class="flex-h mb-5"
        v-show="itemConfig.entityType !== EntityType[1].key && itemConfig.independentSelector && !isDatabase"
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
        v-show="itemConfig.entityType === EntityType[2].key && itemConfig.independentSelector && !isDatabase"
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
          <option v-for="endpoint in endpoints" :value="endpoint.label" :key="endpoint.key">{{
            endpoint.label
          }}</option>
        </select>
      </div>
      <div
        class="flex-h mb-5"
        v-show="itemConfig.entityType === EntityType[3].key && itemConfig.independentSelector && !isDatabase"
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
          <option v-for="instance in instances" :value="instance.label" :key="instance.key">{{
            instance.label
          }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="rocketComps.tree[this.rocketComps.group].type !== 'metric'">
        <div class="title grey sm">{{ $t('independentSelector') }}:</div>
        <select
          class="long"
          v-model="itemConfig.independentSelector"
          @change="setItemConfig({ type: 'independentSelector', value: $event.target.value })"
        >
          <option v-for="type in IndependentType" :value="type.key" :key="type.key">{{ type.label }}</option>
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
          :value="itemConfig.w"
          @change="setItemConfig({ type: 'w', value: $event.target.value })"
        />
      </div>
      <div class="flex-h">
        <div class="title grey sm">{{ $t('height') }}:</div>
        <input
          type="number"
          min="1"
          class="rk-chart-edit-input long"
          :value="itemConfig.h"
          @change="setItemConfig({ type: 'h', value: $event.target.value })"
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
    @Action('GET_ITEM_SERVICES') private GET_ITEM_SERVICES: any;
    @Action('GET_ITEM_ENDPOINTS') private GET_ITEM_ENDPOINTS: any;
    @Action('GET_ITEM_INSTANCES') private GET_ITEM_INSTANCES: any;
    @Action('TYPE_METRICS') private TYPE_METRICS: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    @Prop() private intervalTime!: any;
    private itemConfig: any = {};
    private EntityType = EntityType;
    private IndependentType = IndependentType;
    private services: any = [];
    private endpoints: any = [];
    private instances: any = [];
    private queryMetricTypesList: any = [];
    private isDatabase = false;
    private isLabel = false;

    private created() {
      this.itemConfig = this.item;
      this.isDatabase = this.rocketComps.tree[this.rocketComps.group].type === DASHBOARDTYPE.DATABASE ? true : false;
      this.queryMetricTypesList = QueryMetricTypes[this.item.metricType] || [];
      this.isLabel = this.itemConfig.metricType === MetricsType.LABELED_VALUE ? true : false;
      if (!this.itemConfig.independentSelector) {
        return;
      }
      this.setItemServices();
    }

    private setItemConfig(params: { type: string; value: string }) {
      this.itemConfig[params.type] = params.value;
      const types = ['endpointsKey', 'instancesKey', 'currentService'];
      if (params.type === 'servicesKey') {
        this.setItemServices(true);
      }
      if (types.includes(params.type)) {
        this.getServiceObject(true);
      }
      if (params.type === 't') {
        this.$emit('updateStatus', 'title', params.value);
      }
      if (params.type === 'w') {
        this.$emit('updateStatus', 'width', params.value);
      }
      if (params.type === 'h') {
        this.$emit('updateStatus', 'height', params.value);
      }
      if (params.type === 'unit') {
        this.$emit('updateStatus', 'unit', params.value);
      }
      if (params.type === 'entityType') {
        if (this.itemConfig.currentService) {
          this.getServiceObject(true);
        }
      }
      if (params.type === 'metricName') {
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
          this.isLabel = typeOfMetrics === MetricsType.LABELED_VALUE ? true : false;
          const values = {
            metricType: typeOfMetrics,
            queryMetricType: this.itemConfig.queryMetricType,
            c: MetricChartType[this.itemConfig.queryMetricType],
            metricName: params.value,
          };
          this.EDIT_COMP_CONFIG({
            index: this.index,
            values,
          });
          this.itemConfig = {
            ...this.itemConfig,
            ...values,
          };
        });
        return;
      }
      if (params.type === 'queryMetricType') {
        const values = {
          c: MetricChartType[params.value],
          [params.type]: params.value,
        };
        this.EDIT_COMP_CONFIG({
          index: this.index,
          values,
        });
        this.itemConfig = {
          ...this.itemConfig,
          ...values,
        };
        return;
      }
      if (params.type === 'independentSelector') {
        this.itemConfig.independentSelector = params.value === 'true' ? true : false;
        this.EDIT_COMP_CONFIG({ index: this.index, values: { [params.type]: this.itemConfig.independentSelector } });
        return;
      }
      this.EDIT_COMP_CONFIG({ index: this.index, values: { [params.type]: params.value } });
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
