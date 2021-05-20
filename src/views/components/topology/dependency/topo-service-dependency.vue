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
      :type="'TOPOLOGY_SERVICE_DEPENDENCY'"
      :updateObjects="true"
      :rocketOption="stateDashboardOption"
      :templateType="templateType"
      :templateMode="templateMode"
    />
    <!-- <div v-show="rocketGlobal.edit" class="rk-add-metric-item g-sm-3" @click="ADD_TOPO_SERVICE_COMP">
      + Add An Item
    </div> -->
  </div>
</template>
<script lang="ts">
  import { State } from 'vuex-class';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { State as topoState } from '@/store/modules/topology';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import DashboardItem from '../../dashboard/dashboard-item.vue';

  @Component({
    components: {
      DashboardItem,
    },
  })
  export default class TopoServiceDependency extends Vue {
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @State('rocketTopo') private stateTopo!: topoState;

    private serviceDependencyComps: any[] = [];
    private height = 800;
    private templateType: string = '';
    private templateMode: any = 'server';

    private beforeMount() {
      const { type } = this.stateTopo.currentLink.source;
      this.templateMode = this.stateTopo.mode ? 'server' : 'client';

      this.serviceDependencyComps = this.stateTopo.topoServicesDependency[type][this.templateMode];
      this.templateType = type;
      this.height = document.body.clientHeight - 230;
    }

    @Watch('stateTopo.mode')
    private updateServiceDependency() {
      this.templateMode = this.stateTopo.mode ? 'server' : 'client';
      this.serviceDependencyComps = this.stateTopo.topoServicesDependency[this.templateType][this.templateMode];
    }
  }
</script>
<style lang="scss" scoped>
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
    width: 399px;
    margin-left: 5px;
  }
</style>
