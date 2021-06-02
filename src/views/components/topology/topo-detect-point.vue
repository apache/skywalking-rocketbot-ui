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
    v-if="stateTopo.selectedServiceCall || showServerInfo"
    :class="`link-topo-aside-box link-topo-aside-box-${isMini ? 'min' : 'max'}`"
    :style="`top:55px;position: fixed;right: 30px;${showInfoCount === 0 ? 'animation: unset;' : ''}`"
  >
    <svg
      :style="`position:absolute;left:-48px;top:0;transform: rotate(${isMini ? 0 : 180}deg);`"
      class="link-topo-aside-btn icon cp lg"
      @click="setShowInfo"
    >
      <use xlink:href="#chevron-left" />
    </svg>
    <div class="mb-5 clear flex-h">
      <span class="tool-title" v-if="stateTopo.selectedServiceCall">
        <span class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
        <span
          v-if="stateTopo.detectPoints.indexOf('CLIENT') !== -1"
          :class="{ active: !stateTopo.mode }"
          class="link-topo-aside-box-btn tc r sm cp b"
          @click="setMode(false)"
        >
          {{ $t('client') }}
        </span>
        <span
          v-if="stateTopo.detectPoints.indexOf('SERVER') !== -1"
          :class="{ active: stateTopo.mode }"
          class="link-topo-aside-box-btn tc r sm cp b"
          @click="setMode(true)"
        >
          {{ $t('server') }}
        </span>
      </span>
      <span v-else-if="showServerInfo" class="b dib vm tool-title">{{ $t('serviceDetail') }}</span>
      <div class="flex-h">
        <div class="topo-tool-btn" @click="handleSetEdit">
          <rk-icon
            class="lg rk-icon"
            :style="`color:${!rocketGlobal.edit ? '' : '#ffc107'}`"
            :icon="!rocketGlobal.edit ? 'lock' : 'lock-open'"
            v-tooltip:bottom="{ content: rocketGlobal.edit ? 'view' : 'edit' }"
          />
        </div>
        <div class="topo-tool-btn" v-tooltip:bottom="{ content: 'import' }">
          <input
            id="tool-bar-file"
            type="file"
            name="file"
            title=""
            accept=".json"
            @change="importServiceMetricsTemplate"
          />
          <label for="tool-bar-file">
            <rk-icon class="lg import" icon="folder_open" />
          </label>
        </div>
        <div class="topo-tool-btn" @click="exportTopoServiceMetrics">
          <rk-icon class="lg" icon="save_alt" v-tooltip:bottom="{ content: 'export' }" />
        </div>
      </div>
    </div>
    <div v-if="showInfo">
      <div class="pl-10 pb-5 flex-h">
        <div class="type grey">{{ $t('templateType') }}</div>
        <RkSelect
          class="content grey"
          :mode="'multiple'"
          :current="currentType"
          :data="templateTypesList"
          :theme="'dark'"
          @onChoose="(item) => changeTemplatesType(item)"
        />
      </div>
      <TopoServiceDependency v-if="stateTopo.selectedServiceCall" :currentType="currentType" ref="serviceDependency" />
      <TopoServiceMetrics v-else-if="showServerInfo" :currentType="currentType" ref="serviceTemplate" />
    </div>
    <div class="show-dependency" v-if="stateTopo.selectedServiceCall">
      <a class="rk-btn lg" @click="openInstanceModal">{{ $t('ShowInstanceDependency') }}</a>
      <rk-sidebox
        class="instance-dependency"
        width="100%"
        :fixed="false"
        :title="
          `${stateTopo.selectedServiceCall.source.name} -> ${stateTopo.selectedServiceCall.target.name} Instance Dependency`
        "
        :show.sync="dialogTopoVisible"
        :closeSideboxCallback="clearInstance"
      >
        <TopoInstanceDependency />
      </rk-sidebox>
    </div>
  </div>
</template>
<script lang="ts">
  import { State as topoState } from '@/store/modules/topology';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import TopoInstanceDependency from './dependency/topo-instance-dependency.vue';
  import { DurationTime, Option } from '@/types/global';
  import TopoServiceMetrics from './topo-service-metrics.vue';
  import ToolBarBtns from '../dashboard/tool-bar/tool-bar-btns.vue';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import { State as dataState } from '@/store/modules/dashboard/dashboard-data';
  import compareObj from '@/utils/comparison';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import TopoServiceDependency from './dependency/topo-service-dependency.vue';
  import { DEFAULT, TopologyType } from '@/constants/constant';

  @Component({
    components: {
      TopoServiceMetrics,
      TopoInstanceDependency,
      TopoServiceDependency,
      ToolBarBtns,
    },
  })
  export default class TopoDetectPoint extends Vue {
    @State('rocketData') private rocketComps!: dataState;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @State('rocketTopo') private stateTopo!: topoState;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime!: DurationTime;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT')
    private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Action('SET_EDIT') private SET_EDIT: any;
    @Mutation('rocketTopo/SET_MODE_STATUS') private SET_MODE_STATUS: any;
    @Mutation('rocketTopo/SET_SELECTED_INSTANCE_CALL')
    private SET_SELECTED_INSTANCE_CALL: any;
    @Mutation('rocketTopo/SET_INSTANCE_DEPENDENCY')
    private SET_INSTANCE_DEPENDENCY: any;
    @Action('rocketTopo/CLEAR_TOPO_INFO') private CLEAR_TOPO_INFO: any;
    @Action('rocketTopo/GET_TOPO_INSTANCE_DEPENDENCY')
    private GET_INSTANCE_DEPENDENCY: any;
    @Mutation('rocketTopo/IMPORT_TREE_SERVICE') private IMPORT_TREE_SERVICE: any;
    @Mutation('rocketTopo/IMPORT_TREE_SERVICE_DEPENDENCY') private IMPORT_TREE_SERVICE_DEPENDENCY: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;
    @Mutation('rocketTopo/EDIT_DEPENDENCY_METRICS') private EDIT_DEPENDENCY_METRICS: any;
    @Mutation('rocketTopo/UPDATE_TOPO_TEMPLATE_TYPES') private UPDATE_TOPO_TEMPLATE_TYPES: any;

    private isMini: boolean = true;
    private showInfoCount: number = 0;
    private showInfo: boolean = false;
    private dialogTopoVisible = false;
    private templateTypesList: Option[] = [];
    private currentType: Option[] = [{ key: '', label: '' }];

    private get showServerInfo() {
      return this.stateTopo.currentNode.name && this.stateTopo.currentNode.isReal;
    }

    private changeTemplatesType(item: any) {
      let topoTemplateTypes;
      const types = this.stateTopo.topoTemplatesType;

      if (this.currentType.find((d) => d.key === item.key)) {
        this.deleteTemplateTypes(item);
        return;
      }
      this.currentType.push(item);
      if (this.showServerInfo) {
        const nodeType = this.stateTopo.currentNode.type || DEFAULT;

        topoTemplateTypes = {
          ...types,
          [TopologyType.TOPOLOGY_SERVICE]: { [nodeType]: this.currentType },
        };
      } else {
        if (!(this.stateTopo.selectedServiceCall && this.stateTopo.selectedServiceCall.source)) {
          return;
        }
        const callType = this.stateTopo.selectedServiceCall.source.type || DEFAULT;

        topoTemplateTypes = {
          ...types,
          [TopologyType.TOPOLOGY_SERVICE_DEPENDENCY]: { [callType]: this.currentType },
        };
      }
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
    }

    private deleteTemplateTypes(item: any) {
      let topoTemplateTypes = null;
      const types = this.stateTopo.topoTemplatesType;
      const index = this.currentType.findIndex((d) => item.key === d.key);

      this.currentType.splice(index, 1);
      if (this.showServerInfo) {
        const nodeType = this.stateTopo.currentNode.type || DEFAULT;

        topoTemplateTypes = {
          ...types,
          [TopologyType.TOPOLOGY_SERVICE]: { [nodeType]: this.currentType },
        };
      } else {
        if (!(this.stateTopo.selectedServiceCall && this.stateTopo.selectedServiceCall.source)) {
          return;
        }
        const callType = this.stateTopo.selectedServiceCall.source.type || DEFAULT;

        topoTemplateTypes = {
          ...types,
          [TopologyType.TOPOLOGY_SERVICE_DEPENDENCY]: { [callType]: this.currentType },
        };
      }
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
    }

    private setShowInfo() {
      this.showInfo = false;
      this.showInfoCount = 1;
      this.isMini = !this.isMini;
      setTimeout(() => {
        this.showInfo = true;
      }, 550);
    }

    private handleSetEdit() {
      this.SET_EDIT(!this.rocketGlobal.edit);
    }

    private setMode(mode: boolean) {
      this.SET_MODE_STATUS(mode);
    }

    private clearInstance() {
      this.dialogTopoVisible = false;
      this.SET_SELECTED_INSTANCE_CALL(null);
      this.EDIT_DEPENDENCY_METRICS(false);
    }

    private openInstanceModal() {
      this.stateTopo.selectedInstanceCall = null;
      this.dialogTopoVisible = true;
      if (!(this.stateTopo.selectedServiceCall && this.stateTopo.selectedServiceCall.source)) {
        return;
      }
      this.GET_INSTANCE_DEPENDENCY({
        serverServiceId: this.stateTopo.selectedServiceCall.source.id,
        clientServiceId: this.stateTopo.selectedServiceCall.target.id,
        duration: this.durationTime,
      });
    }

    private async importServiceMetricsTemplate(event: Event) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        if (this.showServerInfo) {
          this.IMPORT_TREE_SERVICE(data[0]);
          const service: any = this.$refs.serviceTemplate;
          service.setServiceTemplates();
        } else {
          this.IMPORT_TREE_SERVICE_DEPENDENCY(data[0]);
          const serviceDependency: any = this.$refs.serviceDependency;
          serviceDependency.setServiceDependencyTemplates();
        }
        const el: any = document.getElementById('tool-bar-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }

    private exportTopoServiceMetrics() {
      let name = '';
      let group: any = {};

      if (this.showServerInfo) {
        name = 'topo_service_metrics.json';
        for (const type of Object.keys(this.stateTopo.topoServices)) {
          const metricsTemp = this.stateTopo.topoServices[type].map((item: any) => {
            delete item.uuid;
            return item;
          });
          group = {
            ...group,
            [type]: metricsTemp,
          };
        }
      } else {
        name = 'topo_service_dependency_metrics.json';
        for (const type of Object.keys(this.stateTopo.topoServicesDependency)) {
          for (const mode of ['server', 'client']) {
            const m: any = mode;
            const metricsTemp = this.stateTopo.topoServicesDependency[type][m].map((item: any) => {
              delete item.uuid;
              return item;
            });
            group = {
              ...group,
              [type]: {
                ...group[type],
                [m]: metricsTemp,
              },
            };
          }
        }
      }
      saveFile([group], name);
    }

    @Watch('durationTime')
    private watchDurationTime(newValue: DurationTime, oldValue: DurationTime) {
      if (compareObj(newValue, oldValue)) {
        this.UPDATE_DASHBOARD();
      }
    }

    @Watch('stateTopo.selectedServiceCall')
    private watchDetectPointNodeId(newValue: string) {
      if (newValue || this.stateTopo.currentNode.isReal) {
        this.showInfo = true;
        if (!(this.stateTopo.selectedServiceCall && this.stateTopo.selectedServiceCall.source)) {
          return;
        }
        const callType = this.stateTopo.selectedServiceCall.source.type || DEFAULT;
        const topoTemplatesType: any = this.stateTopo.topoTemplatesType;

        this.templateTypesList = Object.keys(this.stateTopo.topoServicesDependency).map((item: string) => {
          return { label: item, key: item };
        });
        if (topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_DEPENDENCY]) {
          this.currentType = topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_DEPENDENCY][callType] || [
            { label: DEFAULT, key: DEFAULT },
          ];
        } else {
          this.currentType = [{ label: DEFAULT, key: DEFAULT }];
        }
      } else {
        this.showInfo = false;
        this.showInfoCount = 0;
        this.isMini = true;
        this.SET_EDIT(false);
      }
    }

    @Watch('stateTopo.currentNode.name')
    private watchCurrentNodeIsReal(newValue: boolean) {
      const service = this.stateTopo.currentNode;
      if (this.stateTopo.currentNode.isReal) {
        this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 1 });
        this.UPDATE_DASHBOARD();
      }
      if (newValue || this.stateTopo.selectedServiceCall) {
        this.showInfo = true;
        const topoTemplatesType: any = this.stateTopo.topoTemplatesType;
        const nodeType = this.stateTopo.currentNode.type || DEFAULT;

        this.templateTypesList = Object.keys(this.stateTopo.topoServices).map((item: string) => {
          return { label: item, key: item };
        });
        if (topoTemplatesType[TopologyType.TOPOLOGY_SERVICE]) {
          this.currentType = topoTemplatesType[TopologyType.TOPOLOGY_SERVICE][nodeType] || [
            { label: DEFAULT, key: DEFAULT },
          ];
        } else {
          this.currentType = [{ label: DEFAULT, key: DEFAULT }];
        }
      } else {
        this.showInfo = false;
        this.showInfoCount = 0;
        this.isMini = true;
        this.SET_EDIT(false);
      }
    }
  }
</script>
<style lang="scss">
  .tool-btns {
    height: 30px;
  }
  #tool-bar-file {
    display: none;
  }
  .topo-tool-btn {
    margin: 0 3px;
    cursor: pointer;
  }
  .link-topo-aside-box-btn {
    color: #626977;
    border: 1px solid;
    padding: 0px 3px;
    width: 45px;
    display: inline-block;

    &.active {
      color: #448dfe;
    }
  }
  .instance-dependency {
    .rk-sidebox {
      background: #2b3037;
      outline: none;
      z-index: 200;
    }
    .rk-sidebox-inner {
      height: 100%;
    }
  }

  .show-dependency {
    margin-top: 20px;

    .rk-btn {
      display: block;
      text-align: center;
    }

    .title-name {
      width: 100%;
      padding-left: 40px;
      font-size: 16px;
    }

    .rk-sidebox-title {
      color: #eee;
    }
  }

  .link-topo-aside-box {
    border-radius: 4px;
    position: absolute;
    width: 280px;
    z-index: 101;
    color: #ddd;
    background-color: #2b3037;

    .label {
      display: inline-block;
      width: 40%;
    }

    .type {
      display: inline-block;
      width: 100px;
    }

    .tool-title {
      padding: 10px;
    }

    .content {
      vertical-align: top;
      display: inline-block;
      width: 67%;
    }

    .circle {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: #ee5b5b;
      margin-top: 6px;
    }
  }

  .link-topo-aside-box {
    p {
      margin-block-start: auto !important;
      margin-block-end: auto !important;
    }
  }
</style>
