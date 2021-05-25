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
  <div class="rk-endpoint-dependency">
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
    <div v-if="stateTopo.selectedEndpointCall" class="endpoint-dependency-metrics scroll_bar_style">
      <DashboardItem
        v-for="(i, index) in topoEndpointDependencyMetrics || []"
        :key="index"
        :rocketGlobal="rocketGlobal"
        :item="i"
        :index="index"
        :type="'TOPOLOGY_ENDPOINT_DEPENDENCY'"
        :updateObjects="true"
        :rocketOption="stateDashboardOption"
        :templateType="templateType"
      />
      <!-- <div
        v-show="stateTopo.editInstanceDependencyMetrics"
        class="rk-add-metric-item g-sm-3"
        @click="ADD_TOPO_INSTANCE_DEPENDENCY_COMP"
      >
        + Add An Item
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import { State as topoState, EndpointDependencyConidition, Call, Duration } from '@/store/modules/topology';
  import DependencySankey from '../chart/dependency-sankey.vue';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';

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
    @Action('rocketTopo/GET_ENDPOINT_DEPENDENCY_METRICS') private GET_ENDPOINT_DEPENDENCY_METRICS: any;

    private templateType: string = '';
    private topoEndpointDependencyMetrics: any = [];

    private showEndpointMetrics(data: EndpointDependencyConidition & Call) {
      this.SET_SELECTED_ENDPOINT_CALL(data);
      this.SET_ENDPOINT_DEPENDENCY(data);
      this.templateType = 'SpringMVC';

      if (!this.templateType) {
        return;
      }
      if (!this.stateTopo.topoEndpointDependency[this.templateType]) {
        return;
      }
      this.topoEndpointDependencyMetrics = this.stateTopo.topoEndpointDependency[this.templateType];
    }

    @Watch('stateTopo.endpointDependency.nodes')
    private updateMetrics() {}

    private beforeDestroy() {
      this.stateTopo.endpointDependency = {
        calls: [],
        nodes: [],
      };
    }
  }
</script>
<style lang="scss" scoped>
  .rk-endpoint-dependency {
    background: #333840;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .endpoint-dependency-chart {
      height: 80%;
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
    // display: flex;
    // flex-direction: row;
  }
</style>
