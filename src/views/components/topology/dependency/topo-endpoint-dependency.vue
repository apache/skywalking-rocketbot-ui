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
    </div>
    <div v-if="stateTopo.selectedEndpointCall" class="endpoint-dependency-metrics scroll_bar_style">
      <DashboardItem
        v-for="(i, index) in topoEndpointDependencyMetrics || []"
        :key="index"
        :rocketGlobal="rocketGlobal"
        :item="i"
        :index="index"
        :type="type"
        :updateObjects="true"
        :rocketOption="stateDashboardOption"
        :templateType="templateType"
      />
      <div
        v-show="stateTopo.editDependencyMetrics"
        class="rk-add-metric-item g-sm-3"
        @click="ADD_TOPO_ENDPOINT_DEPENDENCY_COMP"
      >
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

    private templateType: string = '';
    private topoEndpointDependencyMetrics: any = [];
    private type = TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY;
    private height = 500;

    private beforeMount() {
      this.height = document.body.clientHeight - 133;
    }

    private showEndpointMetrics(data: EndpointDependencyConidition & Call) {
      this.SET_SELECTED_ENDPOINT_CALL(data);
      this.SET_ENDPOINT_DEPENDENCY(data);
      this.templateType = DEFAULT;

      if (!this.templateType) {
        return;
      }
      if (!this.stateTopo.topoEndpointDependency[this.templateType]) {
        return;
      }
      this.topoEndpointDependencyMetrics = this.stateTopo.topoEndpointDependency[this.templateType];
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
        const el: any = document.getElementById('endpoint-tool-bar-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }

    private exportTopoEndpointDependencyMetrics() {
      const group = this.stateTopo.topoEndpointDependency;
      const name = 'topo_endpoint_dependency_metrics.json';

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
</style>
