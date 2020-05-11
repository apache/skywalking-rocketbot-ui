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
          @change="EDIT_COMP_CONFIG({ index, type: 't', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('entityType') }}:</div>
        <select
          class="long"
          v-model="itemType"
          @change="setItemConfig({ index, type: 'entityType', value: $event.target.value })"
        >
          <option v-for="type in EntityType" :value="type.key" :key="type.key">{{ type.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('currentService') }}:</div>
        <select class="long" @change="setItemConfig({ index, type: 'currentService', value: $event.target.value })">
          <option v-for="service in stateDashboardOption.services" :value="service.key" :key="service.key">{{
            service.label
          }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="itemType === EntityType[1].key">
        <div class="title grey sm">{{ $t('currentEndpoint') }}:</div>
        <select class="long" @change="setItemConfig({ index, type: 'currentEndpoint', value: $event.target.value })">
          <option v-for="endpoint in endpoints" :value="endpoint.key" :key="endpoint.key">{{ endpoint.label }}</option>
        </select>
      </div>
      <div class="flex-h mb-5" v-show="itemType === EntityType[2].key">
        <div class="title grey sm">{{ $t('currentInstance') }}:</div>
        <select class="long" @change="setItemConfig({ index, type: 'currentInstance', value: $event.target.value })">
          <option v-for="instance in instances" :value="instance.key" :key="instance.key">{{ instance.label }}</option>
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
          @change="EDIT_COMP_CONFIG({ index, type: 'w', value: $event.target.value })"
        />
      </div>
      <div class="flex-h">
        <div class="title grey sm">{{ $t('height') }}:</div>
        <input
          type="number"
          min="1"
          class="rk-chart-edit-input long"
          :value="item.h"
          @change="EDIT_COMP_CONFIG({ index, type: 'h', value: $event.target.value })"
        />
      </div>
      <div class="flex-h">
        <div class="title grey sm">{{ $t('independentSelector') }}:</div>
        <input
          type="number"
          min="1"
          class="rk-chart-edit-input long"
          :value="item.h"
          @change="EDIT_COMP_CONFIG({ index, type: 'independentSelector', value: $event.target.value })"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { State, Getter, Mutation, Action } from 'vuex-class';
  import { Component, Prop } from 'vue-property-decorator';

  import { EntityType, DefaultType } from './constant';

  @Component
  export default class ChartEdit extends Vue {
    @State('rocketOption') private stateDashboardOption: any;
    @Mutation('EDIT_COMP_CONFIG') private EDIT_COMP_CONFIG: any;
    @Action('GET_ITEM_ENDPOINTS') private GET_ITEM_ENDPOINTS: any;
    @Action('GET_ITEM_INSTANCES') private GET_ITEM_INSTANCES: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    @Prop() private intervalTime!: any;
    private EntityType = EntityType;
    private DefaultType = DefaultType;
    private itemType = '';
    private endpoints: any = [];
    private instances: any = [];

    get itemEntityType() {
      return this.item.entityType || DefaultType;
    }

    private created() {
      this.itemType = this.itemEntityType.key;
      this.endpoints = this.stateDashboardOption.endpoints;
      this.instances = this.stateDashboardOption.instances;
    }

    private setItemConfig(params: { index: number; type: string; value: string }) {
      let serviceId = this.item.currentService;

      if (!this.item.version) {
        serviceId = this.stateDashboardOption.currentService.key;
      }
      if (this.itemType === EntityType[1].key) {
        this.GET_ITEM_ENDPOINTS({ serviceId, keyword: '', duration: this.durationTime }).then(
          (data: Array<{ key: string; label: string }>) => {
            this.endpoints = data;
          },
        );
      } else if (this.itemType === EntityType[2].key) {
        this.GET_ITEM_INSTANCES({ serviceId, keyword: '', duration: this.durationTime }).then(
          (data: Array<{ key: string; label: string }>) => {
            this.instances = data;
          },
        );
      }
      this.EDIT_COMP_CONFIG(params);
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
    // background-color: rgba(196, 200, 225, 0.2);
  }
</style>
