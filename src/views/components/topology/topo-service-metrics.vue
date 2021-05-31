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
      v-for="(i, index) in serviceComps || []"
      :key="index + i.title + i.width"
      :rocketGlobal="rocketGlobal"
      :item="i"
      :index="index"
      :type="type"
      :updateObjects="true"
      :rocketOption="stateDashboardOption"
      :templateTypes="templateTypes()"
    />
    <div v-show="rocketGlobal.edit" class="rk-add-metric-item g-sm-3" @click="ADD_TOPO_SERVICE_COMP">
      + Add An Item
    </div>
  </div>
</template>
<script lang="ts">
  import { State as topoState } from '@/store/modules/topology';
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { State, Mutation } from 'vuex-class';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';
  import { DEFAULT, TopologyType } from '@/constants/constant';
  import { Option } from '@/types/global';

  @Component({
    components: {
      DashboardItem,
    },
  })
  export default class TopoServiceMetrics extends Vue {
    @Prop() private currentType!: Option;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @State('rocketTopo') private stateTopo!: topoState;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;
    @Mutation('rocketTopo/ADD_TOPO_SERVICE_COMP') private ADD_TOPO_SERVICE_COMP: any;

    private serviceComps: unknown[] = [];
    private height: number = 800;
    private default = DEFAULT;
    private type: string = '';

    private beforeMount() {
      this.type = TopologyType.TOPOLOGY_SERVICE;
      this.height = document.body.clientHeight - 230;
      this.setServiceTemplates();
    }

    private setServiceTemplates() {
      const templateTypes = this.templateTypes();

      this.serviceComps = [];

      for (const type of templateTypes) {
        this.serviceComps = [...this.serviceComps, ...this.stateTopo.topoServices[type]];
      }
    }

    private templateTypes() {
      let templateTypes = [];
      const nodeType = this.stateTopo.currentNode.type;
      const templates = this.stateTopo.topoTemplatesType;

      if (templates[TopologyType.TOPOLOGY_SERVICE]) {
        templateTypes = templates[TopologyType.TOPOLOGY_SERVICE].map((item: Option) => item.key);
      } else {
        templateTypes = this.stateTopo.topoServices[nodeType] ? [nodeType] : [DEFAULT];
      }

      return templateTypes;
    }

    @Watch('currentType')
    private updateServiceMetrics() {
      this.setServiceTemplates();
    }
  }
</script>
<style lang="scss">
  .service-metrics {
    overflow: auto;
  }
  .rk-add-metric-item {
    height: 200px;
    text-align: center;
    line-height: 250px;
    border: 1px dashed rgba(196, 200, 225, 0.5);
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    width: 340px;
    margin-left: 5px;
  }
</style>
