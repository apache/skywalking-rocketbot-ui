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
  <div class="service-metrics scroll_bar_style" :style="`height: ${height}px`">
    <DashboardItem
      v-for="(i, index) in serviceDependencyComps || []"
      :key="index"
      :rocketGlobal="rocketGlobal"
      :item="i"
      :index="index"
      :type="pageType"
      :updateObjects="true"
      :rocketOption="stateDashboardOption"
      :templateTypes="templateType"
      :templateMode="templateMode"
    />
    <div v-show="rocketGlobal.edit" class="rk-add-metric-item g-sm-3" @click="ADD_TOPO_SERVICE_DEPENDENCY_COMP">
      + Add An Item
    </div>
  </div>
</template>
<script lang="ts">
  import { State, Mutation } from 'vuex-class';
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  import { State as topoState } from '@/store/modules/topology';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';
  import { TopologyType, DEFAULT } from '@/constants/constant';
  import { Option } from '@/types/global';

  @Component({
    components: {
      DashboardItem,
    },
  })
  export default class TopoServiceDependency extends Vue {
    @Prop() private currentType: any;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @State('rocketTopo') private stateTopo!: topoState;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;
    @Mutation('rocketTopo/ADD_TOPO_SERVICE_DEPENDENCY_COMP') private ADD_TOPO_SERVICE_DEPENDENCY_COMP: any;

    private serviceDependencyComps: any[] = [];
    private height = 800;
    private templateType: string[] = [DEFAULT];
    private templateMode: any = 'server';
    private pageType: string = TopologyType.TOPOLOGY_SERVICE_DEPENDENCY;

    private beforeMount() {
      this.templateMode = this.stateTopo.mode ? 'server' : 'client';
      this.height = document.body.clientHeight - 280;
      this.setServiceDependencyTemplates();
    }

    private templateTypes() {
      let templateTypes = [];
      const nodeType = this.stateTopo.currentNode.type;
      const templates = this.stateTopo.topoTemplatesType;

      if (templates[TopologyType.TOPOLOGY_SERVICE_DEPENDENCY]) {
        templateTypes = templates[TopologyType.TOPOLOGY_SERVICE_DEPENDENCY].map((item: Option) => item.key);
      } else {
        templateTypes = this.stateTopo.topoServicesDependency[nodeType] ? [nodeType] : [DEFAULT];
      }

      this.templateType = templateTypes;
    }

    private setServiceDependencyTemplates() {
      this.templateTypes();
      this.templateMode = this.stateTopo.mode ? 'server' : 'client';
      this.serviceDependencyComps = [];

      for (const type of this.templateType) {
        this.serviceDependencyComps = [
          ...this.serviceDependencyComps,
          ...this.stateTopo.topoServicesDependency[type][this.templateMode],
        ];
      }
    }

    @Watch('stateTopo.mode')
    private updateServiceDependency() {
      this.templateMode = this.stateTopo.mode ? 'server' : 'client';
      this.setServiceDependencyTemplates();
      this.UPDATE_DASHBOARD();
    }
    @Watch('currentType')
    private updateServiceMetrics() {
      this.updateServiceDependency();
    }
  }
</script>
<style lang="scss" scoped>
  @import url('../styles/common.scss');
  .service-metrics {
    overflow: auto;
  }
</style>
