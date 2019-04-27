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
    <ToolGroup :rocketGlobal="rocketGlobal" :rocketComps="rocketComps"/>
    <ToolBar  :compType="compType" :durationTime="durationTime"  :stateDashboard='stateDashboard'/>
    <ToolNav :rocketGlobal="rocketGlobal" :rocketComps="rocketComps"/>
    <DashboardInner  v-if="isRouterAlive" :rocketGlobal="rocketGlobal" :stateDashboard='stateDashboard' :rocketComps="rocketComps"/>
    <DashboardComp v-if="rocketGlobal.edit" :compType="compType" :rocketComps="rocketComps"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';
import ToolBar from '@/views/components/dashboard/tool-bar.vue';
import ToolGroup from '@/views/components/dashboard/tool-group.vue';
import ToolNav from '@/views/components/dashboard/tool-nav.vue';
import DashboardInner from '@/views/components/dashboard/dashboard-inner.vue';
import DashboardComp from '@/views/components/dashboard/dashboard-comp.vue';
import dashboard from '../../store/modules/dashboard';

@Component({
  components: {
    ToolBar,
    ToolGroup,
    ToolNav,
    DashboardInner,
    DashboardComp,
  },
})
export default class Dashboard extends Vue {
  @State('rocketbot') private rocketGlobal: any;
  @State('rocketDashboard') private stateDashboard!: any;
  @State('rocketComps') private rocketComps: any;
  @Mutation('SET_EVENTS') private SET_EVENTS: any;
  @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
  @Mutation('SET_CURRENT_COMPS') private SET_CURRENT_COMPS: any;
  @Action('rocketDashboard/MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
  @Action('rocketDashboard/MIXHANDLE_GET_DASHBOARD') private MIXHANDLE_GET_DASHBOARD: any;
  @Getter('durationTime') private durationTime: any;
  private isRouterAlive: boolean = true;
  public reload(): void {
    this.isRouterAlive = false;
    this.$nextTick(() => { this.isRouterAlive = true; });
  }
  private get compType() {
    return this.rocketComps.tree[this.rocketComps.group].type;
  }
  private handleRefresh() {
    this.MIXHANDLE_GET_DASHBOARD({compType: this.compType, duration: this.durationTime});
  }
  private handleOption() {
    return this.MIXHANDLE_GET_OPTION({compType: this.compType, duration: this.durationTime})
      .then(() => {
        this.handleRefresh();
      });
  }
  private beforeCreate() {
    this.$store.registerModule('rocketDashboard', dashboard);
  }
  private beforeMount() {
    if (window.localStorage.getItem('dashboard')) {
      const data: string = `${window.localStorage.getItem('dashboard')}`;
      this.SET_COMPS_TREE(JSON.parse(data));
    }
    this.handleOption();
    this.SET_EVENTS([this.handleRefresh]);
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketDashboard');
  }
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

