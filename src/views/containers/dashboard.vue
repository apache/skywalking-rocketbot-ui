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
  <div class="flex-v wrapper" style="flex-grow:1;">
    <ToolGroup :rocketGlobal="rocketGlobal" :rocketComps="stateDashboardComps"/>
    <ToolBar :rocketGlobal="rocketGlobal" :compType="compType" :durationTime="durationTime"  :stateDashboard='stateDashboardOption'/>
    <ToolNav :rocketGlobal="rocketGlobal" :rocketComps="stateDashboardComps"/>
    <DashboardInner :rocketGlobal="rocketGlobal" :rocketComps="stateDashboardComps"/>
    <DashboardEdit :rocketGlobal="rocketGlobal" :rocketComps="stateDashboardComps"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';
import ToolBar from '@/views/components/dashboard/tool-bar.vue';
import ToolGroup from '@/views/components/dashboard/tool-group.vue';
import ToolNav from '@/views/components/dashboard/tool-nav.vue';
import DashboardInner from '@/views/components/dashboard/dashboard-inner.vue';
import { State as RocketOptionState } from '../../store/modules/dashboard/modules/dashboard-option';
import DashboardEdit from '@/views/components/dashboard/dashboard-edit.vue';
// import dashboard from '../../store/modules/dashboard';

@Component({
  components: {
    ToolBar,
    ToolGroup,
    ToolNav,
    DashboardInner,
    DashboardEdit,
    // DashboardComp,
  },
})
export default class Dashboard extends Vue {
  @Getter('durationTime') private durationTime: any;
  @State('rocketbot') private rocketGlobal: any;
  @State('rocketOption') private stateDashboardOption!: RocketOptionState;
  @State('rocketData') private stateDashboardComps!: any;
  @Mutation('SET_EVENTS') private SET_EVENTS: any;
  @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
  @Mutation('SET_CURRENT_COMPS') private SET_CURRENT_COMPS: any;
  @Action('rocketOption/MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
  @Action('GET_QUERY') private GET_QUERY: any;
  // @Action('dashboard/MIXHANDLE_GET_DASHBOARD') private MIXHANDLE_GET_DASHBOARD: any;
  private get compType() {
    return this.stateDashboardComps.tree[this.stateDashboardComps.group].type;
  }
  private handleRefresh() {
    this.GET_QUERY({
      serviceId: this.stateDashboardOption.currentService.key,
      endpointId: this.stateDashboardOption.currentEndpoint.key,
      endpointName: this.stateDashboardOption.currentEndpoint.label,
      instanceId: this.stateDashboardOption.currentInstance.key,
      databaseId: this.stateDashboardOption.currentDatabase.key,
      duration: this.durationTime,
    });
  }
  private handleOption() {
    return this.MIXHANDLE_GET_OPTION({compType: this.compType, duration: this.durationTime})
      .then(() => {this.handleRefresh(); });
  }
  // private beforeCreate() {
  //   this.$store.registerModule('rocketDashboard', dashboard);
  // }
  private beforeMount() {
    if (window.localStorage.getItem('dashboard')) {
      const data: string = `${window.localStorage.getItem('dashboard')}`;
      this.SET_COMPS_TREE(JSON.parse(data));
    }
    this.handleOption();
    this.SET_EVENTS([this.handleRefresh]);
  }
  // private beforeDestroy() {
  //   this.$store.unregisterModule('rocketDashboard');
  // }
}
</script>
<style lang="scss">
.dashboard-container{
  overflow: auto;
  padding:20px 15px;
  height: 100%;
  flex-grow: 1;
}
</style>

