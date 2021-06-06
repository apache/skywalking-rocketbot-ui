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
  <div class="rk-topo-instance-dependency">
    <div class="rk-dependency-chart">
      <DependencySankey :data="stateTopo.instanceDependency" @showMetrics="showDependencyMetrics" />
      <div v-show="!stateTopo.instanceDependency.nodes.length">
        No Instance Dependency
      </div>
    </div>
    <div class="rk-instance-metric-box">
      <div v-if="stateTopo.selectedInstanceCall" class="rk-instance-metric-content">
        <div class="mb-5 clear header">
          <span class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
          <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('CLIENT')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{ active: stateTopo.instanceDependencyMode === 'client' }"
            @click="setMode('client')"
          >
            {{ $t('client') }}
          </span>
          <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('SERVER')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{ active: stateTopo.instanceDependencyMode === 'server' }"
            @click="setMode('server')"
          >
            {{ $t('server') }}
          </span>
          <span class="topo-tool-btn" @click="handleSetEdit">
            <rk-icon
              class="lg rk-icon"
              :style="`color:${stateTopo.editDependencyMetrics ? '#ffc107' : ''}`"
              :icon="stateTopo.editDependencyMetrics ? 'lock-open' : 'lock'"
              v-tooltip:bottom="{ content: stateTopo.editDependencyMetrics ? 'view' : 'edit' }"
            />
          </span>
          <span class="topo-tool-btn" v-tooltip:bottom="{ content: 'import' }">
            <input
              id="instance-tool-bar-file"
              type="file"
              name="file"
              title=""
              accept=".json"
              @change="importInstanceDependencyMetricsTemplate"
            />
            <label for="instance-tool-bar-file">
              <rk-icon class="lg import" icon="folder_open" />
            </label>
          </span>
          <span class="topo-tool-btn" @click="exportTopoInstanceDependencyMetrics">
            <rk-icon class="lg" icon="save_alt" v-tooltip:bottom="{ content: 'export' }" />
          </span>
        </div>
        <div class="pl-10 pb-5 flex-h">
          <div class="type grey">{{ $t('templateType') }}</div>
          <RkSelect
            class="content grey"
            :mode="'multiple'"
            :current="currentType"
            :data="templateNameList"
            :theme="'dark'"
            @onChoose="(item) => changeTemplatesType(item)"
          />
        </div>
        <div
          v-if="stateTopo.selectedInstanceCall"
          class="rk-instance-dependency-metrics scroll_bar_style"
          :style="`height: ${height}px`"
        >
          <DashboardItem
            v-for="(i, index) in serviceInstanceDependencyComps || []"
            :key="i.uuid"
            :rocketGlobal="rocketGlobal"
            :item="i"
            :index="index"
            :type="type"
            :updateObjects="true"
            :rocketOption="stateDashboardOption"
            :templateTypes="templateType"
            :templateMode="stateTopo.instanceDependencyMode"
            @setTemplates="setMetircsTemplates"
          />
          <div
            v-show="stateTopo.editDependencyMetrics"
            class="rk-add-metric-item g-sm-3"
            @click="addInstanceDependencyMetric"
          >
            + Add An Item
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { State, Getter, Mutation } from 'vuex-class';
  import { State as topoState } from '@/store/modules/topology';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import DependencySankey from '../chart/dependency-sankey.vue';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import { DEFAULT, TopologyType } from '@/constants/constant';
  import { Option } from '@/types/global';
  import { uuid } from '@/utils/uuid';

  @Component({
    components: {
      DependencySankey,
      DashboardItem,
    },
  })
  export default class TopoInstanceDependency extends Vue {
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    @State('rocketTopo') private stateTopo!: topoState;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @Mutation('rocketTopo/SET_INSTANCE_DEPENDENCY_MODE_STATUS') private SET_INSTANCE_DEPENDENCY_MODE_STATUS: any;
    @Mutation('rocketTopo/SET_SELECTED_INSTANCE_CALL') private SET_SELECTED_INSTANCE_CALL: any;
    @Mutation('SET_SERVICE_INSTANCE_DEPENDENCY') private SET_SERVICE_INSTANCE_DEPENDENCY: any;
    @Mutation('rocketTopo/EDIT_DEPENDENCY_METRICS') private EDIT_DEPENDENCY_METRICS: any;
    @Mutation('rocketTopo/ADD_TOPO_INSTANCE_DEPENDENCY_COMP') private ADD_TOPO_INSTANCE_DEPENDENCY_COMP: any;
    @Mutation('rocketTopo/IMPORT_TREE_INSTANCE_DEPENDENCY') private IMPORT_TREE_INSTANCE_DEPENDENCY: any;
    @Mutation('rocketTopo/UPDATE_TOPO_TEMPLATE_TYPES') private UPDATE_TOPO_TEMPLATE_TYPES: any;
    @Mutation('rocketTopo/SET_TOPO_SERVICE_INSTANCE_DEPENDENCY') private SET_TOPO_SERVICE_INSTANCE_DEPENDENCY: any;

    private showInfo: boolean = true;
    private height: number = 500;
    private serviceInstanceDependencyComps: any = [];
    private mode: string = 'server';
    private templateType: string[] = [];
    private templateMode: string = '';
    private type = TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY;
    private currentType: Option[] = [];
    private templateNameList: Option[] = [];

    private beforeMount() {
      this.height = document.body.clientHeight - 250;
    }

    private setMode(mode: any) {
      this.SET_INSTANCE_DEPENDENCY_MODE_STATUS(mode);
      const call: any = this.stateTopo.selectedInstanceCall || { sourceObj: {} };
      this.templateTypes();
      this.setMetircsTemplates();
    }

    private addInstanceDependencyMetric() {
      this.ADD_TOPO_INSTANCE_DEPENDENCY_COMP();
      this.setMetircsTemplates();
    }
    private showDependencyMetrics(data: any) {
      this.SET_INSTANCE_DEPENDENCY_MODE_STATUS(data.detectPoints[0].toLowerCase());
      this.SET_SELECTED_INSTANCE_CALL(data);
      this.SET_SERVICE_INSTANCE_DEPENDENCY(data);
      this.templateTypes();
      this.templateNameList = Object.keys(this.stateTopo.topoServicesInstanceDependency).map((item: string) => {
        return { label: item, key: item };
      });
      this.setMetircsTemplates();
    }

    private changeTemplatesType(item: Option) {
      let topoTemplateTypes;
      const types = this.stateTopo.topoTemplatesType;

      if (this.currentType.find((d) => d.key === item.key)) {
        this.deleteTemplateTypes(item);
        return;
      }
      this.currentType.push(item);
      topoTemplateTypes = {
        ...types,
        [TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY]: this.currentType,
      };
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
      this.templateTypes();
      this.setMetircsTemplates();
    }

    private deleteTemplateTypes(item: any) {
      let topoTemplateTypes = null;
      const types = this.stateTopo.topoTemplatesType;
      const index = this.currentType.findIndex((d) => item.key === d.key);

      this.currentType.splice(index, 1);
      topoTemplateTypes = {
        ...types,
        [TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY]: this.currentType,
      };
      this.templateTypes();
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
      this.setMetircsTemplates();
    }

    private setMetircsTemplates() {
      this.serviceInstanceDependencyComps = [];
      const mode = this.stateTopo.instanceDependencyMode as any;
      let templates: any = {};

      for (const type of Object.keys(this.stateTopo.topoServicesInstanceDependency)) {
        for (const detect of ['server', 'client']) {
          const m: any = detect;
          if (this.stateTopo.topoServicesInstanceDependency[type][m]) {
            const metricsTemp = this.stateTopo.topoServicesInstanceDependency[type][m].map((item: any) => {
              item.uuid = item.uuid || uuid();
              return item;
            });
            templates = {
              ...templates,
              [type]: {
                ...templates[type],
                [m]: metricsTemp,
              },
            };
          }
        }
      }
      this.SET_TOPO_SERVICE_INSTANCE_DEPENDENCY(templates);
      for (const type of this.templateType) {
        this.serviceInstanceDependencyComps = [
          ...this.serviceInstanceDependencyComps,
          ...this.stateTopo.topoServicesInstanceDependency[type][mode],
        ];
      }
    }

    private templateTypes() {
      const nodeType = this.stateTopo.currentNode.type;
      const templates = this.stateTopo.topoTemplatesType;
      let templateTypes = [];

      if (templates[TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY]) {
        templateTypes = templates[TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY].map((item: Option) => item.key);
      } else {
        templateTypes = this.stateTopo.topoServicesInstanceDependency[nodeType] ? [nodeType] : [DEFAULT];
      }

      this.templateType = templateTypes;
      this.currentType = templateTypes.map((d: Option) => {
        return { key: d, label: d };
      });
    }

    private handleSetEdit() {
      this.EDIT_DEPENDENCY_METRICS(!this.stateTopo.editDependencyMetrics);
    }
    private async importInstanceDependencyMetricsTemplate(event: Event) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        this.IMPORT_TREE_INSTANCE_DEPENDENCY(data[0]);
        this.setMetircsTemplates();
        const el: any = document.getElementById('instance-tool-bar-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportTopoInstanceDependencyMetrics() {
      let group: any = {};
      const name = 'topo_service_instance_dependency_metrics.json';
      for (const type of Object.keys(this.stateTopo.topoServicesInstanceDependency)) {
        for (const mode of ['server', 'client']) {
          const m: any = mode;
          const metricsTemp = this.stateTopo.topoServicesInstanceDependency[type][m].map((item: any) => {
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

      saveFile([group], name);
    }
  }
</script>
<style lang="scss" scoped>
  @import url('../styles/common.scss');
  .rk-topo-instance-dependency {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #2b3037;
    .content {
      width: 66%;
    }
  }
  .rk-instance-metric-box {
    display: flex;
    flex-direction: column;
    background: #252a2f;
  }
  .rk-instance-dependency-metrics {
    width: 350px;
    overflow: auto;
  }
  .rk-dependency-chart {
    height: 100%;
    width: calc(100% - 340px);
  }
  .header {
    padding: 10px;
    width: 100%;
    overflow: hidden;
  }
  .rk-add-metric-item {
    width: 325px;
  }
  .topo-tool-btn {
    cursor: pointer;
  }
  #instance-tool-bar-file {
    display: none;
  }
</style>
