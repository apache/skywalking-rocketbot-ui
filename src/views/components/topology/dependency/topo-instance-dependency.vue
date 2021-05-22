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
    </div>
    <div class="rk-instance-metric-box">
      <div v-if="!stateTopo.instanceDependency.nodes.length">
        No Instance Dependency
      </div>
      <div v-if="stateTopo.selectedInstanceCall" class="rk-instance-metric-content">
        <div class="mb-5 clear header">
          <span class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
          <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('CLIENT')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{ active: stateTopo.instanceDependencyMode === 'client' }"
            @click="setMode('client')"
            >{{ $t('client') }}</span
          >
          <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('SERVER')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{ active: stateTopo.instanceDependencyMode === 'server' }"
            @click="setMode('server')"
            >{{ $t('server') }}</span
          >
        </div>
        <div
          v-if="stateTopo.selectedInstanceCall"
          class="rk-instance-dependency-metrics scroll_bar_style"
          :style="`height: ${height}px`"
        >
          <DashboardItem
            v-for="(i, index) in serviceInstanceDependencyComps || []"
            :key="index"
            :rocketGlobal="rocketGlobal"
            :item="i"
            :index="index"
            :type="'TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY'"
            :updateObjects="true"
            :rocketOption="stateDashboardOption"
            :templateType="templateType"
            :templateMode="stateTopo.instanceDependencyMode"
          />
          <!-- <div v-show="rocketGlobal.edit" class="rk-add-metric-item g-sm-3" @click="ADD_TOPO_SERVICE_DEPENDENCY_COMP">
            + Add An Item
          </div> -->
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
  import Topo from '../chart/topo.vue';
  import DependencySankey from '../chart/dependency-sankey.vue';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';

  @Component({
    components: {
      Topo,
      DependencySankey,
      DashboardItem,
    },
  })
  export default class TopoInstanceDependency extends Vue {
    @Getter('durationTime') private durationTime: any;
    @State('rocketTopo') private stateTopo!: topoState;
    @Getter('intervalTime') private intervalTime: any;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @Mutation('rocketTopo/SET_INSTANCE_DEPENDENCY_MODE_STATUS') private SET_INSTANCE_DEPENDENCY_MODE_STATUS: any;
    @Mutation('rocketTopo/SET_SELECTED_INSTANCE_CALL') private SET_SELECTED_INSTANCE_CALL: any;
    @Mutation('SET_SERVICE_INSTANCE_DEPENDENCY') private SET_SERVICE_INSTANCE_DEPENDENCY: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;

    private showInfo: boolean = true;
    private height: number = 500;
    private serviceInstanceDependencyComps: any = [];
    private mode: string = 'server';
    private templateType: string = '';
    private templateMode: string = '';

    private beforeMount() {
      this.height = document.body.clientHeight - 200;
    }

    private setMode(mode: any) {
      this.SET_INSTANCE_DEPENDENCY_MODE_STATUS(mode);
      const call: any = this.stateTopo.selectedInstanceCall || { sourceObj: {} };
      this.templateType = call.sourceObj.type || 'SpringMVC';
      if (!this.templateType) {
        return;
      }
      if (!this.stateTopo.topoServicesInstanceDependency[this.templateType][mode]) {
        return;
      }
      this.serviceInstanceDependencyComps = this.stateTopo.topoServicesInstanceDependency[this.templateType][mode];
      this.UPDATE_DASHBOARD();
    }
    private showDependencyMetrics(data: any) {
      this.SET_INSTANCE_DEPENDENCY_MODE_STATUS(data.detectPoints[0].toLowerCase());
      this.SET_SELECTED_INSTANCE_CALL(data);
      this.SET_SERVICE_INSTANCE_DEPENDENCY(data);
      const mode = this.stateTopo.instanceDependencyMode as any;

      this.templateType = data.sourceObj.type || 'SpringMVC';
      if (!this.templateType) {
        return;
      }
      if (!this.stateTopo.topoServicesInstanceDependency[this.templateType][mode]) {
        return;
      }
      this.serviceInstanceDependencyComps = this.stateTopo.topoServicesInstanceDependency[this.templateType][mode];
    }
  }
</script>
<style lang="scss" scoped>
  .rk-topo-instance-dependency {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #2b3037;
  }
  .rk-instance-metric-box {
    display: flex;
    flex-direction: column;
    background: #252a2f;
  }
  .rk-instance-dependency-metrics {
    width: 320px;
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
</style>
