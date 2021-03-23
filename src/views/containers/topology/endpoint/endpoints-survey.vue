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
      v-for="(i, index) in endpointComps || []"
      :key="index + i.title + i.width"
      :rocketGlobal="rocketGlobal"
      :item="i"
      :index="index"
      :type="'TOPOLOGY_ENDPOINT'"
      :updateObjects="updateObjects"
      :rocketOption="stateDashboardOption"
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
  import { State as optionState } from '@/store/modules/global/selectors';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';

  @Component({
    components: {
      DashboardItem,
    },
  })
  export default class InstancesSurvey extends Vue {
    @State('rocketbot') private rocketGlobal: any;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @Mutation('rocketTopo/ADD_TOPO_ENDPOINT_COMP') private ADD_TOPO_ENDPOINT_COMP: any;
    @Prop() private endpointComps: any;
    @Prop() private updateObjects!: string;
  }
</script>
