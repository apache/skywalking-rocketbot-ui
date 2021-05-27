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
  <div class="dashboard-container clear">
    <DashboardItem
      v-for="(i, index) in topoEndpoints || []"
      :key="index + i.title + i.width"
      :rocketGlobal="rocketGlobal"
      :item="i"
      :index="index"
      :type="type"
      :updateObjects="updateObjects"
      :rocketOption="stateDashboardOption"
      :templateType="templateType"
    />
    <div v-show="rocketGlobal.edit" class="rk-add-dashboard-item g-sm-3" @click="ADD_TOPO_ENDPOINT_COMP">
      + Add An Item
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, Mutation } from 'vuex-class';
  import { State as topoState } from '@/store/modules/topology';
  import { State as optionState } from '@/store/modules/global/selectors';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';
  import { TopologyType, DEFAULT } from '@/constants/constant';

  @Component({
    components: {
      DashboardItem,
    },
  })
  export default class InstancesSurvey extends Vue {
    @State('rocketTopo') private stateTopo!: topoState;
    @State('rocketbot') private rocketGlobal: any;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @Mutation('rocketTopo/ADD_TOPO_ENDPOINT_COMP') private ADD_TOPO_ENDPOINT_COMP: any;
    @Prop() private updateObjects!: boolean;

    private type = TopologyType.TOPOLOGY_ENDPOINT;
    private topoEndpoints: unknown = [];
    private templateType: string = '';

    private beforeMount() {
      const templateType = this.stateTopo.currentNode.type;

      this.templateType = this.stateTopo.topoEndpoints[templateType] ? templateType : DEFAULT;
      this.topoEndpoints = this.stateTopo.topoEndpoints[this.templateType];
    }
  }
</script>
<style lang="scss" scoped>
  .rk-add-dashboard-item {
    height: 342px;
    text-align: center;
    line-height: 250px;
    border: 1px dashed rgba(196, 200, 225, 0.5);
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
  }
  .dashboard-container {
    overflow: auto;
    padding: 20px 15px;
    height: 100%;
    flex-grow: 1;
  }
</style>
