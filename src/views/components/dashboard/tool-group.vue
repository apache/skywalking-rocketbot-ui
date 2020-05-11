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
    <span v-for="(i, index) in rocketComps.tree" :key="index" class="mr-15">
      <a
        class="rk-dashboard-group-i mb-10"
        @click="handleOption(index)"
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
        <div class="mb-10 vm">{{ $t('createGroup') }}</div>
        <div class="sm grey mb-5 mr-10">{{ $t('groupType') }}</div>
        <select v-model="type" class="rk-dashboard-group-sel">
          <option :value="DASHBOARDTYPE.SERVICE">{{ $t('standardAPM') }}</option>
          <option :value="DASHBOARDTYPE.METRIC">{{ $t('metrics') }}</option>
          <option :value="DASHBOARDTYPE.DATABASE">{{ $t('database') }}</option>
        </select>
        <div class="sm grey  mb-5 mr-10">{{ $t('groupName') }}</div>
        <input class="mb-5 rk-dashboard-group-input" type="text" v-model="name" />
        <div v-show="type === 'database'">
          <label class="mb-10 dib"><input type="checkbox" v-model="template" />{{ $t('template') }}</label>
        </div>
        <a class="rk-btn r vm long tc confirm" @click="handleCreate">{{ $t('confirm') }}</a>
      </div>
    </a>

    <a class="rk-dashboard-import ml-10" v-if="rocketGlobal.edit">
      <input id="tool-group-file" class="ipt" type="file" name="file" title="" accept=".json" @change="importData" />
      <label for="tool-group-file" class="input-label">
        <svg class="icon open vm">
          <use xlink:href="#folder_open"></use>
        </svg>
      </label>
    </a>
    <a class="ml-10" v-if="rocketGlobal.edit">
      <svg class="icon vm" @click="exportData">
        <use xlink:href="#save_alt"></use>
      </svg>
    </a>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Mutation, Action, Getter } from 'vuex-class';
  import { DASHBOARDTYPE } from './constant';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';

  @Component({})
  export default class ToolGroup extends Vue {
    @Prop() private rocketGlobal: any;
    @Prop() private rocketComps: any;
    @Mutation('IMPORT_COMPS_GROUP') private IMPORT_COMPS_GROUP: any;
    @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
    @Mutation('DELETE_COMPS_GROUP') private DELETE_COMPS_GROUP: any;
    @Mutation('ADD_COMPS_GROUP') private ADD_COMPS_GROUP: any;
    @Action('MIXHANDLE_CHANGE_GROUP') private MIXHANDLE_CHANGE_GROUP: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Getter('durationTime') private durationTime: any;
    private name: string = '';
    private type: string = DASHBOARDTYPE.SERVICE;
    private show: boolean = false;
    private template: boolean = false;
    private DASHBOARDTYPE = DASHBOARDTYPE;
    private get compType() {
      return this.rocketComps.tree[this.rocketComps.group].type;
    }
    private handleOption(index: any) {
      this.MIXHANDLE_CHANGE_GROUP(index);
      return this.MIXHANDLE_GET_OPTION({
        compType: this.compType,
        duration: this.durationTime,
      });
    }
    private handleHide() {
      this.name = '';
      this.type = DASHBOARDTYPE.SERVICE;
      this.show = false;
    }
    private handleCreate() {
      let template = DASHBOARDTYPE.METRIC;
      if (this.type === DASHBOARDTYPE.SERVICE) {
        template = DASHBOARDTYPE.SERVICE;
      }
      if (this.type === DASHBOARDTYPE.METRIC) {
        template = DASHBOARDTYPE.METRIC;
      }
      if (this.type === DASHBOARDTYPE.DATABASE) {
        template = DASHBOARDTYPE.DATABASE;
        if (!this.template) {
          template = DASHBOARDTYPE.METRIC;
        }
      }
      this.ADD_COMPS_GROUP({ name: this.name, type: this.type, template });
      this.handleHide();
      this.template = false;
    }
    private async importData(event: any) {
      try {
        const data: any = await readFile(event);
        const { children, name, query, type } = data;
        if (children && name && query && type) {
          this.IMPORT_COMPS_GROUP(data);
        } else {
          throw new Error();
        }
        const el: any = document.getElementById('tool-group-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportData() {
      const group = this.rocketComps.tree[this.rocketComps.group];
      const name = `${group.name}.group.json`;
      saveFile(group, name);
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
  .rk-dashboard-import {
    .icon.open {
      margin-top: 2px;
    }
    .ipt {
      display: none;
    }
    .input-label {
      display: inline;
      line-height: inherit;
      cursor: pointer;
    }
  }
</style>
