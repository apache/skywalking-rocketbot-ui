/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */
<template>
  <div class="flex-v wrapper" style="flex-grow:1;height: 100%;overflow:hidden">
    <ToolGroup :rocketGlobal="rocketGlobal" :rocketComps="rocketComps" />
    <ToolBar
      :rocketGlobal="rocketGlobal"
      :compType="compType"
      :durationTime="durationTime"
      :stateDashboard="stateDashboardOption"
    />
    <ToolNav :rocketGlobal="rocketGlobal" :rocketComps="rocketComps" />
    <div class="dashboard-container clear">
      <DashboardItem
        v-for="(i, index) in rocketComps.tree[this.rocketComps.group].children[this.rocketComps.current].children"
        :key="index + i.t + i.w + i.d"
        :index="index"
        :rocketGlobal="rocketGlobal"
        :i="i"
        :dragIndex="dragIndex"
        @dragStart="dragStart"
      >
      </DashboardItem>
    </div>
    <DashboardComp v-if="rocketGlobal.edit" :compType="compType" :rocketComps="rocketComps" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import ToolBar from '@/views/components/dashboard/tool-bar.vue';
  import ToolGroup from '@/views/components/dashboard/tool-group.vue';
  import ToolNav from '@/views/components/dashboard/tool-nav.vue';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';
  import DashboardComp from '@/views/components/dashboard/dashboard-comp.vue';

  @Component({
    components: {
      ToolBar,
      ToolGroup,
      ToolNav,
      DashboardItem,
      DashboardComp,
    },
  })
  export default class Dashboard extends Vue {
    @State('rocketbot') private rocketGlobal: any;
    @State('rocketOption') private stateDashboardOption!: any;
    @State('rocketData') private rocketComps!: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
    @Mutation('SET_CURRENT_COMPS') private SET_CURRENT_COMPS: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @Getter('durationTime') private durationTime: any;
    private isRouterAlive: boolean = true;
    private dragIndex: number = NaN;
    public dragStart(index: number) {
      this.dragIndex = index;
    }
    public reload(): void {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
    private get compType() {
      return this.rocketComps.tree[this.rocketComps.group].type;
    }
    private handleRefresh() {
      this.GET_QUERY({
        serviceId: this.stateDashboardOption.currentService.key || '',
        endpointId: this.stateDashboardOption.currentEndpoint.key || '',
        endpointName: this.stateDashboardOption.currentEndpoint.label || '',
        instanceId: this.stateDashboardOption.currentInstance.key || '',
        databaseId: this.stateDashboardOption.currentDatabase.key || '',
        duration: this.durationTime,
      });
    }
    private handleOption() {
      return this.MIXHANDLE_GET_OPTION({
        compType: this.compType,
        duration: this.durationTime,
      }).then(() => {
        this.handleRefresh();
      });
    }
    private beforeMount() {
      if (window.localStorage.getItem('dashboard')) {
        const data: string = `${window.localStorage.getItem('dashboard')}`;
        this.SET_COMPS_TREE(JSON.parse(data));
      }
      this.handleOption();
      this.SET_EVENTS([this.handleRefresh]);
    }
  }
</script>
<style lang="scss">
  .dashboard-container {
    overflow: auto;
    padding: 20px 15px;
    height: 100%;
    flex-grow: 1;
  }
</style>
