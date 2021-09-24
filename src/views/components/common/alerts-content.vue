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
  <div class="alert-content">
    <rk-alert
      v-for="(msg, index) in Object.keys(stateOption.selectorErrors)"
      :key="msg + index"
      :show.sync="stateOption.selectorErrors[msg]"
      type="error"
      :message="msg"
      :description="stateOption.selectorErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(rocketData.dashboardErrors)"
      :key="msg + index"
      :show.sync="rocketData.dashboardErrors[msg]"
      type="error"
      :message="msg"
      :description="rocketData.dashboardErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(stateTopo.topoErrors)"
      :key="msg + index"
      :show.sync="stateTopo.topoErrors[msg]"
      type="error"
      :message="msg"
      :description="stateTopo.topoErrors[msg]"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { State as topoState } from '@/store/modules/topology';

  @Component
  export default class AlertsContent extends Vue {
    @State('rocketOption') private stateOption!: optionState;
    @State('rocketData') private rocketData!: rocketData;
    @State('rocketTopo') private stateTopo!: topoState;
  }
</script>
<style lang="scss" scoped>
  .alert-content {
    position: fixed;
    top: 60px;
    right: 5px;
    z-index: 1000;
  }
</style>
