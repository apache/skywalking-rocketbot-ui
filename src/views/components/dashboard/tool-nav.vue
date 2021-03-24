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
  <nav class="rk-dashboard-nav">
    <span
      v-for="(i, index) in rocketComps.tree[rocketComps.group] && rocketComps.tree[rocketComps.group].children"
      :key="index"
      class="mr-20"
    >
      <a class="rk-dashboard-nav-i b" @click="changeComps(index)" :class="{ active: rocketComps.current == index }">{{
        i.name
      }}</a>
      <svg
        v-if="rocketGlobal.edit && rocketComps.current !== index"
        class="ml-5 icon cp red vm"
        @click="DELETE_COMPS_TREE(index)"
      >
        <use xlink:href="#file-deletion"></use>
      </svg>
    </span>
    <a class="rk-dashboard-nav-add mr-10" v-clickout="handleHide" v-if="rocketGlobal.edit">
      <svg class="icon vm" @click="show = !show">
        <use xlink:href="#todo-add"></use>
      </svg>
      <div class="rk-dashboard-nav-add-box" v-if="show">
        <div class="mb-10 vm">{{ $t('createTab') }}</div>
        <div class="sm grey mb-5 mr-10">{{ $t('tabName') }}</div>
        <input class="mb-5 rk-dashboard-nav-input" type="text" v-model="name" />
        <a class="rk-btn r vm long tc confirm" @click="handleCreate">{{ $t('confirm') }}</a>
      </div>
    </a>
    <a class="rk-dashboard-import mr-10">
      <input id="tool-nav-file" class="ipt" type="file" name="file" title="" accept=".json" @change="importData" />
      <label for="tool-nav-file" class="input-label">
        <rk-icon class="open vm" icon="folder_open" />
      </label>
    </a>
    <a class="mr-10" @click="exportData">
      <rk-icon icon="save_alt" />
    </a>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Getter, Mutation, Action } from 'vuex-class';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import { DASHBOARDTYPE } from './constant';

  @Component
  export default class ToolNav extends Vue {
    @Prop() private rocketGlobal: any;
    @Prop() private rocketComps: any;
    @Mutation('IMPORT_COMPS_TREE') private IMPORT_COMPS_TREE: any;
    @Mutation('SET_CURRENT_COMPS') private SET_CURRENT_COMPS: any;
    @Mutation('DELETE_COMPS_TREE') private DELETE_COMPS_TREE: any;
    @Mutation('ADD_COMPS_TREE') private ADD_COMPS_TREE: any;
    @Action('RUN_EVENTS') private RUN_EVENTS: any;
    @Getter('durationTime') private durationTime: any;
    private name: string = '';
    private show: boolean = false;
    private dashboardType = DASHBOARDTYPE;

    get type() {
      return this.rocketComps.tree[this.rocketComps.group].type;
    }
    private handleHide() {
      this.name = '';
      this.show = false;
    }
    private handleCreate() {
      if (!this.name) {
        return;
      }
      this.ADD_COMPS_TREE({ name: this.name });
      this.handleHide();
    }
    private changeComps(index: number) {
      this.SET_CURRENT_COMPS(index);
      this.RUN_EVENTS({});
    }
    private async importData(event: any) {
      try {
        const data: any = await readFile(event);
        const { children, name } = data;
        if (children && name && children[0] && children[0].width) {
          this.IMPORT_COMPS_TREE(data);
        } else {
          throw new Error();
        }
        const el: any = document.getElementById('tool-nav-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportData() {
      const { tree, group, current } = this.rocketComps;
      const currentData = tree[group].children[current];
      const name = `${currentData.name}.comps.json`;
      saveFile(currentData, name);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-nav {
    box-shadow: 0 1px 0px rgba(0, 0, 0, 0.08);
    background-color: rgba(196, 200, 225, 0.2);
    padding: 0 15px;
  }
  .rk-dashboard-nav-sel {
    outline: none;
    border: 0;
  }
  .rk-dashboard-nav-add {
    position: relative;
  }
  .rk-dashboard-nav-add-box {
    position: absolute;
    left: -10px;
    top: 35px;
    padding: 10px 5px;
    z-index: 10;
    border-radius: 4px;
    color: #eee;
    background-color: #252a2f;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  }
  .rk-dashboard-nav-add-box:after {
    bottom: 100%;
    left: 10px;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: #333840;
    border-width: 8px;
    margin-left: 0px;
  }
  .rk-dashboard-nav-input {
    border: 0;
    outline: 0;
    padding: 1px 8px;
    border-radius: 4px;
  }
  .rk-dashboard-nav-i {
    display: inline-block;
    height: 41px;
    line-height: 40px;
    border-bottom: 2px;
    border-bottom-style: solid;
    color: rgba(61, 68, 79, 0.6);
    border-color: rgba(0, 0, 0, 0);
    will-change: border-color, color;
    transition: border-color 0.3s, color 0.3s;
    &:hover {
      color: #448dfe;
    }
    &.active {
      color: #448dfe;
      border-color: #448dfe;
    }
  }
  .confirm {
    margin: 10px 0;
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
