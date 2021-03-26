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
  <div class="flex-h btn-box">
    <div class="rk-dashboard-bar-btn" @click="handleSetEdit">
      <rk-icon
        class="lg"
        :style="`color:${!rocketGlobal.edit ? '' : '#ffc107'}`"
        :icon="!rocketGlobal.edit ? 'lock' : 'lock-open'"
        v-tooltip:bottom="{ content: rocketGlobal.edit ? 'view' : 'edit' }"
      />
    </div>
    <div class="rk-dashboard-bar-btn" v-tooltip:bottom="{ content: 'import' }">
      <input id="tool-bar-file" type="file" name="file" title="" accept=".json" @change="importData" />
      <label for="tool-bar-file">
        <rk-icon class="lg import" icon="folder_open" />
      </label>
    </div>
    <div class="rk-dashboard-bar-btn" @click="exportData">
      <rk-icon class="lg" icon="save_alt" v-tooltip:bottom="{ content: 'export' }" />
    </div>
    <div class="rk-dashboard-bar-btn" @click="handleOption">
      <rk-icon class="lg" icon="retry" v-tooltip:bottom="{ content: 'auto' }" />
    </div>
    <div class="rk-dashboard-bar-btn" @click="setEnbleEvents" v-show="compType === dashboardType.SERVICE">
      <rk-icon
        class="lg"
        :class="enableEvents ? 'blue' : ''"
        icon="format_indent_increase"
        v-tooltip:bottom="{ content: enableEvents ? $t('disableEvents') : $t('enableEvents') }"
      />
    </div>
    <div class="rk-dashboard-bar-btn" @click="() => (dialogEventVisible = true)" v-show="enableEvents">
      <rk-icon class="lg" icon="settings" v-tooltip:bottom="{ content: $t('setEvent') }" />
    </div>
    <rk-sidebox width="950px" :fixed="true" :show.sync="dialogEventVisible">
      <DashboardEvent :rocketComps="rocketComps" :closeBox="() => (dialogEventVisible = false)" />
    </rk-sidebox>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Action, Mutation } from 'vuex-class';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import { EntityType } from '../charts/constant';
  import DashboardEvent from './dashboard-events.vue';
  import { UpdateDashboardEvents } from '../constant';

  @Component({ components: { DashboardEvent } })
  export default class ToolBarBtns extends Vue {
    @Prop() private compType!: any;
    @Prop() private dashboardType!: any;
    @Prop() private rocketGlobal!: any;
    @Prop() private rocketComps!: any;
    @Prop() private durationTime!: any;
    @Prop() private rocketOption: any;
    @Prop() private stateDashboard: any;
    @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
    @Mutation('SET_ENABLE_EVENTS') private SET_ENABLE_EVENTS: any;
    @Mutation('IMPORT_TREE') private IMPORT_TREE: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;
    @Mutation('SET_DASHBOARD_EVENTS') private SET_DASHBOARD_EVENTS: any;
    @Action('SET_EDIT') private SET_EDIT: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('GET_EVENT') private GET_EVENT: any;
    private dialogEventVisible: boolean = false;
    private enableEvents: boolean = false;

    private handleOption() {
      return this.MIXHANDLE_GET_OPTION({
        compType: this.compType,
        duration: this.durationTime,
        keywordServiceName:
          this.rocketComps.tree[this.rocketComps.group] && this.rocketComps.tree[this.rocketComps.group].serviceGroup,
      });
    }

    private handleSetEdit() {
      this.SET_EDIT(!this.rocketGlobal.edit);
    }

    private async importData(event: any) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        const [{ children, name, type }] = data;
        if (children && name && type) {
          this.IMPORT_TREE(data);
        } else {
          throw new Error('error');
        }
        const el: any = document.getElementById('tool-bar-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportData() {
      const group = this.rocketComps.tree[this.rocketComps.group];
      delete group.query;
      const name = 'dashboard.json';
      saveFile([group], name);
    }
    private setEnbleEvents() {
      this.enableEvents = !this.enableEvents;
      this.SET_ENABLE_EVENTS(this.enableEvents);
      if (!this.enableEvents) {
        this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[0].key });
        this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[2].key });
        this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[3].key });
        this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
        return;
      }
      Promise.all([
        this.GET_EVENT({
          condition: {
            time: this.durationTime,
            size: 20,
            source: {
              service: this.stateDashboard.currentService.label,
            },
          },
          type: EntityType[0].key,
        }),
        this.GET_EVENT({
          condition: {
            time: this.durationTime,
            size: 20,
            source: {
              service: this.stateDashboard.currentService.label,
              serviceInstance: this.stateDashboard.currentInstance.label,
            },
          },
          type: EntityType[3].key,
        }),
        this.GET_EVENT({
          condition: {
            time: this.durationTime,
            size: 20,
            source: {
              service: this.stateDashboard.currentService.label,
              endpoint: this.stateDashboard.currentEndpoint.label,
            },
          },
          type: EntityType[2].key,
        }),
      ]).then(() => {
        this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
      });
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-bar-btn {
    padding: 0 8px;
    border-right: 2px solid #252a2f;
    height: 19px;
    cursor: pointer;
  }
  #tool-bar-file {
    display: none;
  }
  .input-label {
    display: inline;
    line-height: inherit;
    cursor: pointer;
  }
  .btn-box {
    height: 58px;
  }
  .import {
    margin-top: 0;
    cursor: pointer;
  }
</style>
