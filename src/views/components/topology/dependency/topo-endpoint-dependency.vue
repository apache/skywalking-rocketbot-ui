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
  <div class="rk-endpoint-dependency" :style="`height: ${height}px`">
    <div class="endpoint-dependency-chart">
      <DependencySankey
        v-if="stateTopo.endpointDependency.nodes.length"
        :data="stateTopo.endpointDependency"
        @showMetrics="showEndpointMetrics"
      />
      <div v-else class="endpoint-dependency-empty">
        No Endpoint Dependency
      </div>
    </div>
    <div class="mb-5 header" v-if="stateTopo.selectedEndpointCall">
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
          id="endpoint-tool-bar-file"
          type="file"
          name="file"
          title=""
          accept=".json"
          @change="importEndpointDependencyMetricsTemplate"
        />
        <label for="endpoint-tool-bar-file">
          <rk-icon class="lg import" icon="folder_open" />
        </label>
      </span>
      <span class="topo-tool-btn" @click="exportTopoEndpointDependencyMetrics">
        <rk-icon class="lg" icon="save_alt" v-tooltip:bottom="{ content: 'export' }" />
      </span>
      <span class="ml-5 pb-5 flex-h">
        <div class="type grey">{{ $t('templateType') }}</div>
        <RkSelect
          class="content grey"
          :mode="'multiple'"
          :current="currentType"
          :data="templateNameList"
          :theme="'dark'"
          @onChoose="(item) => changeTemplatesType(item)"
        />
      </span>
    </div>
    <div v-if="stateTopo.selectedEndpointCall" class="endpoint-dependency-metrics scroll_bar_style">
      <DashboardItem
        v-for="(i, index) in topoEndpointDependencyMetrics || []"
        :key="i.uuid"
        :rocketGlobal="rocketGlobal"
        :item="i"
        :index="index"
        :type="type"
        :updateObjects="true"
        :rocketOption="stateDashboardOption"
        :templateTypes="templateType"
        @setTemplates="setMetricsTemplate"
      />
      <div v-show="stateTopo.editDependencyMetrics" class="rk-add-metric-item g-sm-3" @click="addMetrics">
        + Add An Item
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import { State, Getter, Mutation } from 'vuex-class';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import { State as topoState } from '@/store/modules/topology';
  import DependencySankey from '../chart/dependency-sankey.vue';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import { Duration } from '@/types/global';
  import { EndpointDependencyConidition, Call } from '@/types/topo';
  import { DEFAULT, TopologyType } from '@/constants/constant';
  import { Option } from '@/types/global';
  import { uuid } from '@/utils/uuid';

  @Component({
    components: {
      DependencySankey,
      DashboardItem,
    },
  })
  export default class TopoEndpointDependency extends Vue {
    @Getter('durationTime') private durationTime!: Duration;
    @Getter('intervalTime') private intervalTime: any;
    @State('rocketTopo') private stateTopo!: topoState;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @Mutation('rocketTopo/SET_SELECTED_ENDPOINT_CALL') private SET_SELECTED_ENDPOINT_CALL: any;
    @Mutation('SET_ENDPOINT_DEPENDENCY') private SET_ENDPOINT_DEPENDENCY: any;
    @Mutation('rocketTopo/EDIT_DEPENDENCY_METRICS') private EDIT_DEPENDENCY_METRICS: any;
    @Mutation('rocketTopo/IMPORT_TREE_ENDPOINT_DEPENDENCY') private IMPORT_TREE_ENDPOINT_DEPENDENCY: any;
    @Mutation('rocketTopo/ADD_TOPO_ENDPOINT_DEPENDENCY_COMP') private ADD_TOPO_ENDPOINT_DEPENDENCY_COMP: any;
    @Mutation('rocketTopo/UPDATE_TOPO_TEMPLATE_TYPES') private UPDATE_TOPO_TEMPLATE_TYPES: any;
    @Mutation('rocketTopo/SET_TOPO_ENDPOINT_DEPENDENCY') private SET_TOPO_ENDPOINT_DEPENDENCY: any;

    private templateType: string[] = [];
    private topoEndpointDependencyMetrics: any = [];
    private type = TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY;
    private height = 500;
    private templateNameList: Option[] = [];
    private currentType: Option[] = [];

    private beforeMount() {
      this.height = document.body.clientHeight - 133;
    }

    private addMetrics() {
      this.ADD_TOPO_ENDPOINT_DEPENDENCY_COMP();
      this.setMetricsTemplate();
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
        [TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY]: this.currentType,
      };
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
      this.setTemplateTypes();
      this.setMetricsTemplate();
    }

    private deleteTemplateTypes(item: any) {
      let topoTemplateTypes = null;
      const types = this.stateTopo.topoTemplatesType;
      const index = this.currentType.findIndex((d) => item.key === d.key);

      this.currentType.splice(index, 1);
      topoTemplateTypes = {
        ...types,
        [TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY]: this.currentType,
      };
      this.setTemplateTypes();
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
      this.setMetricsTemplate();
    }

    private showEndpointMetrics(data: EndpointDependencyConidition & Call) {
      this.SET_SELECTED_ENDPOINT_CALL(data);
      this.SET_ENDPOINT_DEPENDENCY(data);
      this.setTemplateTypes();
      this.templateNameList = Object.keys(this.stateTopo.topoEndpointDependency).map((item: string) => {
        return { label: item, key: item };
      });
      this.setMetricsTemplate();
    }

    private setMetricsTemplate() {
      this.topoEndpointDependencyMetrics = [];
      let templates: any = {};

      for (const type of Object.keys(this.stateTopo.topoEndpointDependency)) {
        const metricsTemp = this.stateTopo.topoEndpointDependency[type].map((item: any) => {
          item.uuid = item.uuid || uuid();
          return item;
        });
        templates = {
          ...templates,
          [type]: metricsTemp,
        };
      }
      this.SET_TOPO_ENDPOINT_DEPENDENCY(templates);
      for (const type of this.templateType) {
        this.topoEndpointDependencyMetrics = [
          ...this.topoEndpointDependencyMetrics,
          ...this.stateTopo.topoEndpointDependency[type],
        ];
      }
    }

    private setTemplateTypes() {
      if (!this.stateTopo.selectedEndpointCall) {
        return;
      }
      const nodeType = this.stateTopo.selectedEndpointCall.type || DEFAULT;
      const templates = this.stateTopo.topoTemplatesType || {};
      let templateTypes = [];

      if (templates[TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY]) {
        templateTypes = templates[TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY].map((item: Option) => item.key);
      } else {
        templateTypes = this.stateTopo.topoEndpointDependency[nodeType] ? [nodeType] : [DEFAULT];
      }

      this.templateType = templateTypes;
      this.currentType = templateTypes.map((d: Option) => {
        return { key: d, label: d };
      });
    }

    private handleSetEdit() {
      this.EDIT_DEPENDENCY_METRICS(!this.stateTopo.editDependencyMetrics);
    }

    private async importEndpointDependencyMetricsTemplate(event: Event) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        this.IMPORT_TREE_ENDPOINT_DEPENDENCY(data[0]);
        this.setMetricsTemplate();
        const el: any = document.getElementById('endpoint-tool-bar-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }

    private exportTopoEndpointDependencyMetrics() {
      const name = 'topo_endpoint_dependency_metrics.json';
      let group: any = {};

      for (const type of Object.keys(this.stateTopo.topoEndpointDependency)) {
        const metricsTemp = this.stateTopo.topoEndpointDependency[type].map((item: any) => {
          delete item.uuid;
          return item;
        });
        group = {
          ...group,
          [type]: metricsTemp,
        };
      }

      saveFile([group], name);
    }

    @Watch('stateTopo.endpointDependency.nodes')
    private updateMetrics() {
      this.topoEndpointDependencyMetrics = [];
    }

    private beforeDestroy() {
      this.stateTopo.endpointDependency = {
        calls: [],
        nodes: [],
      };
    }
  }
</script>
<style lang="scss" scoped>
  @import url('../styles/common.scss');
  .rk-endpoint-dependency {
    background: #333840;
    display: flex;
    flex-direction: column;
    .endpoint-dependency-chart {
      height: 75%;
      min-height: 500px;
    }
    .endpoint-dependency-empty {
      color: #fff;
      text-align: center;
      height: 500px;
      line-height: 500px;
    }
  }
  .endpoint-dependency-metrics {
    background: #333840;
    height: 25%;
    overflow: auto;
    min-height: 210px;
  }
  .header {
    z-index: 1;
  }
  #endpoint-tool-bar-file {
    display: none;
  }
  .topo-tool-btn {
    cursor: pointer;
    color: #fff;
    margin-right: 5px;
  }
  .rk-add-metric-item {
    color: #eee;
  }
  .type {
    width: 100px;
  }
  .content {
    width: 400px;
  }
</style>
