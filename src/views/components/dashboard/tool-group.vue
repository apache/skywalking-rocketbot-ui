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
  <nav class="rk-dashboard-group">
    <span v-for="(i, index) in rocketComps.tree || []" :key="index" class="mr-15">
      <a
        class="rk-dashboard-group-i mb-10"
        @click="handleOption(index, i.serviceGroup)"
        :class="{
          active: rocketComps.group == index,
          grey: rocketComps.group != index,
        }"
        >{{ i.name }}</a
      >
      <svg
        v-if="rocketGlobal.edit && rocketComps.group !== index"
        class="ml-5 icon cp red vm"
        @click="DELETE_COMPS_GROUP(index)"
      >
        <use xlink:href="#file-deletion"></use>
      </svg>
    </span>
    <a class="rk-dashboard-group-add" v-clickout="handleHide" v-if="rocketGlobal.edit">
      <svg class="icon vm" @click="show = !show">
        <use xlink:href="#todo-add"></use>
      </svg>
      <div class="rk-dashboard-group-add-box" v-if="show">
        <div class="mb-10 vm">{{ $t('createTemplate') }}</div>
        <div class="sm grey mb-5 mr-10">{{ $t('templateType') }}</div>
        <select v-model="type" class="rk-dashboard-group-sel">
          <option :value="DASHBOARDTYPE.SERVICE">{{ $t('standardAPM') }}</option>
          <option :value="DASHBOARDTYPE.METRIC">{{ $t('metricsView') }}</option>
          <option :value="DASHBOARDTYPE.DATABASE">{{ $t('databaseView') }}</option>
          <option :value="DASHBOARDTYPE.BROWSER">{{ $t('browserView') }}</option>
        </select>
        <div class="sm grey  mb-5 mr-10" v-show="type !== DASHBOARDTYPE.METRIC">{{ $t('templateConfig') }}</div>
        <select v-model="templateName" class="rk-dashboard-group-sel" v-show="type !== DASHBOARDTYPE.METRIC">
          <option :value="''">None</option>
          <option v-for="template in templates" :key="template.name" :value="template.name">{{ template.name }}</option>
        </select>
        <div class="sm grey  mb-5 mr-10">{{ $t('templateName') }}</div>
        <input class="mb-5 rk-dashboard-group-input" type="text" v-model="name" />
        <a class="rk-btn r vm long tc confirm" @click="handleCreate">{{ $t('confirm') }}</a>
      </div>
    </a>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Mutation, Action, Getter } from 'vuex-class';
  import { DASHBOARDTYPE } from './constant';
  import { PageTypes } from '@/constants/constant';

  @Component({})
  export default class ToolGroup extends Vue {
    @Prop() private rocketGlobal: any;
    @Prop() private rocketComps: any;
    @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
    @Mutation('DELETE_COMPS_GROUP') private DELETE_COMPS_GROUP: any;
    @Mutation('ADD_COMPS_GROUP') private ADD_COMPS_GROUP: any;
    @Action('MIXHANDLE_CHANGE_GROUP') private MIXHANDLE_CHANGE_GROUP: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Getter('durationTime') private durationTime: any;
    private name: string = '';
    private type: string = DASHBOARDTYPE.SERVICE;
    private show: boolean = false;
    private DASHBOARDTYPE = DASHBOARDTYPE;
    private templateName: string = '';

    private get compType() {
      return (
        (this.rocketComps.tree[this.rocketComps.group] && this.rocketComps.tree[this.rocketComps.group].type) ||
        'service'
      );
    }
    private get servicesTemplates() {
      const templates = this.rocketComps.templates.filter(
        (item: { type: string; name: string; children: any[] }) => item.type === DASHBOARDTYPE.SERVICE,
      );

      return templates;
    }
    private get databaseTemplates() {
      const templates = this.rocketComps.templates.filter(
        (item: { type: string; name: string; children: any[] }) => item.type === DASHBOARDTYPE.DATABASE,
      );

      return templates;
    }
    private get templates() {
      let templates = [];
      if (this.type === DASHBOARDTYPE.SERVICE) {
        templates = this.servicesTemplates;
      } else if (this.type === DASHBOARDTYPE.DATABASE) {
        templates = this.databaseTemplates;
      }

      return templates;
    }
    private handleOption(index: number, serviceGroup: string) {
      this.MIXHANDLE_CHANGE_GROUP(index);
      return this.MIXHANDLE_GET_OPTION({
        compType: this.compType,
        duration: this.durationTime,
        keywordServiceName: serviceGroup,
        pageType: PageTypes.DASHBOARD,
      });
    }
    private handleHide() {
      this.name = '';
      this.type = DASHBOARDTYPE.SERVICE;
      this.show = false;
      this.templateName = '';
    }
    private handleCreate() {
      this.ADD_COMPS_GROUP({ name: this.name, type: this.type, templateName: this.templateName });
      this.handleHide();
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-group {
    border-bottom: 1px solid #252a2f;
    background-color: #333840;
    padding: 10px 15px 0;
    color: #eee;
  }
  .rk-dashboard-group-sel {
    outline: none;
    border: 0;
    margin: 0 0 5px 0;
    width: 160px;
  }
  .rk-dashboard-group-add {
    position: relative;
  }
  .rk-dashboard-group-add-box {
    position: absolute;
    left: -10px;
    top: 35px;
    padding: 10px 5px;
    z-index: 2;
    border-radius: 4px;
    color: #eee;
    background-color: #252a2f;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    .confirm {
      margin: 10px 0;
    }
  }
  .rk-dashboard-group-add-box:after {
    bottom: 100%;
    left: 10px;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: #252a2f;
    border-width: 8px;
    margin-left: 0px;
  }
  .rk-dashboard-group-input {
    border: 0;
    outline: 0;
    padding: 1px 8px;
    border-radius: 4px;
  }
  .rk-dashboard-group-i {
    display: inline-block;
    padding: 4px 13px 4px 15px;
    border-radius: 4px;
    position: relative;
    background-color: rgba(255, 255, 255, 0.07);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
    will-change: border-color, color;
    transition: border-color 0.3s, color 0.3s;
    &.active::before {
      content: '';
      position: absolute;
      display: inline-block;
      width: 5px;
      height: 10px;
      border-radius: 4px;
      background-color: #448dfe;
      top: 9px;
      left: 4px;
    }
  }
</style>
