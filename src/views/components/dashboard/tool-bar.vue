/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div>
    <div class="rk-dashboard-bar flex-h" v-if="compType === 'service'">
      <ToolBarSelect @onChoose="SELECT_SERVICE" title="Current Service" :current="stateDashboard.currentService" :data="stateDashboard.services" icon="package"/>
      <ToolBarSelect @onChoose="selectEndpoint" title="Current Endpoint" :current="stateDashboard.currentEndpoint" :data="stateDashboard.endpoints" icon="code"/>
      <ToolBarSelect @onChoose="selectInstance" title="Current Instance" :current="stateDashboard.currentInstance" :data="stateDashboard.instances" icon="disk"/>
    </div>
    <div class="rk-dashboard-bar flex-h" v-if="compType === 'proxy'">
      <ToolBarSelect @onChoose="SELECT_SERVICE" title="Current Proxy" :current="stateDashboard.currentService" :data="stateDashboard.services" icon="package"/>
      <ToolBarSelect @onChoose="selectEndpoint" title="Current Endpoint" :current="stateDashboard.currentEndpoint" :data="stateDashboard.endpoints" icon="code"/>
      <ToolBarSelect @onChoose="selectInstance" title="Current Instance" :current="stateDashboard.currentInstance" :data="stateDashboard.instances" icon="disk"/>
    </div>
    <div class="rk-dashboard-bar flex-h" v-else-if="compType === 'database'">
      <ToolBarSelect @onChoose="SELECT_DATABASE" title="Current Database" :current="stateDashboard.currentDatabase" :data="stateDashboard.databases" icon="epic"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ToolBarSelect from './tool-bar-select.vue';
import { State, Action } from 'vuex-class';
@Component({components: {ToolBarSelect}})
export default class ToolBar extends Vue {
  @Prop() private compType!: any;
  @Prop() private stateDashboard!: any;
  @Prop() private durationTime!: any;
  @Action('rocketDashboard/SELECT_SERVICE') private SELECT_SERVICE: any;
  @Action('rocketDashboard/SELECT_DATABASE') private SELECT_DATABASE: any;
  @Action('rocketDashboard/SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
  @Action('rocketDashboard/SELECT_INSTANCE') private SELECT_INSTANCE: any;

  private selectEndpoint(i: any) {
    this.SELECT_ENDPOINT({endpoint: i, duration: this.durationTime});
  }
  private selectInstance(i: any) {
    this.SELECT_INSTANCE({instance: i, duration: this.durationTime});
  }
}
</script>

<style lang="scss" scoped>
.rk-dashboard-bar {
  flex-shrink: 0;
  color: #efefef;
  background-color: #333840;
}
</style>
