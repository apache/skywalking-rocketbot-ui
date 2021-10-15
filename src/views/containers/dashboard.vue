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
  <div class="flex-v wrapper" style="flex-grow:1;height: 100%;overflow:hidden">
    <ToolGroup :rocketGlobal="rocketGlobal" :rocketComps="rocketComps" />
    <ToolBar
      :rocketGlobal="rocketGlobal"
      :rocketComps="rocketComps"
      :compType="compType"
      :durationTime="durationTime"
      :stateDashboard="stateDashboardOption"
    />
    <ToolNav :rocketGlobal="rocketGlobal" :rocketComps="rocketComps" />
    <div class="dashboard-container clear">
      <DashboardItem
        v-for="(i, index) in rocketComps.tree[rocketComps.group] &&
          rocketComps.tree[rocketComps.group].children[rocketComps.current] &&
          rocketComps.tree[rocketComps.group].children[rocketComps.current].children"
        :key="index + i.title + i.width"
        :index="index"
        :rocketGlobal="rocketGlobal"
        :item="i"
        :updateObjects="true"
        :rocketOption="stateDashboardOption"
      >
      </DashboardItem>
      <div v-show="rocketGlobal.edit" class="rk-add-dashboard-item g-sm-3" @click="ADD_COMP">
        + Add An Item
      </div>
    </div>
    <rk-modal :show.sync="showCacheModal" :title="$t('cacheModalTitle')">
      <div class="reminder-content">{{ $t('cacheReminderContent') }}</div>
      <div class="reminder-btns">
        <a class="rk-cache-modal-btn bg-blue mr-10" @click="clearDashboardTemps">
          {{ $t('yes') }}
        </a>
        <a class="rk-cache-modal-btn mr-10" @click="closeCacheModal">
          {{ $t('no') }}
        </a>
      </div>
    </rk-modal>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import ToolBar from '@/views/components/dashboard/tool-bar/tool-bar.vue';
  import ToolGroup from '@/views/components/dashboard/tool-group.vue';
  import ToolNav from '@/views/components/dashboard/tool-nav.vue';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';
  import { State as globalState } from '@/store/modules/global';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as dataState } from '@/store/modules/dashboard/dashboard-data';
  import { State as layoutState } from '@/store/modules/dashboard/dashboard-data-layout';
  import { PageTypes } from '@/constants/constant';

  interface ITemplate {
    name: string;
    type: string;
    configuration: string;
    activated: boolean;
    disabled: boolean;
  }
  @Component({
    components: {
      ToolBar,
      ToolGroup,
      ToolNav,
      DashboardItem,
    },
  })
  export default class Dashboard extends Vue {
    @State('rocketbot') private rocketGlobal!: globalState;
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketData') private rocketComps!: dataState & layoutState;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('GET_ALL_TEMPLATES') private GET_ALL_TEMPLATES: any;
    @Getter('durationTime') private durationTime: any;
    @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
    @Mutation('ADD_COMP') private ADD_COMP: any;
    @Mutation('SET_EDIT') private SET_EDIT: any;
    @Mutation('SET_TEMPLATES') private SET_TEMPLATES: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;

    private isRouterAlive: boolean = true;
    private templatesErrors: boolean = false;
    private showCacheModal: boolean = false;
    private intervalCache: any;
    public reload(): void {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
    private get compType() {
      return (
        (this.rocketComps.tree[this.rocketComps.group] && this.rocketComps.tree[this.rocketComps.group].type) ||
        'service'
      );
    }
    private handleOption() {
      this.MIXHANDLE_GET_OPTION({
        compType: this.compType,
        duration: this.durationTime,
        keywordServiceName:
          this.rocketComps.tree[this.rocketComps.group] && this.rocketComps.tree[this.rocketComps.group].serviceGroup,
        pageType: PageTypes.DASHBOARD,
      });
    }
    private beforeMount() {
      this.GET_ALL_TEMPLATES().then((templateResp: ITemplate[]) => {
        const dashboardTemplate = templateResp.filter((item: ITemplate) => item.type === 'DASHBOARD');
        const templatesConfig = dashboardTemplate.map((item: ITemplate) => {
          return { ...JSON.parse(item.configuration)[0], activated: item.activated, disabled: item.disabled };
        });
        this.SET_TEMPLATES(templatesConfig);
        if (window.localStorage.getItem('version') === '8.0') {
          const data: string = `${window.localStorage.getItem('dashboard')}`;
          this.SET_COMPS_TREE(JSON.parse(data));
        } else {
          window.localStorage.removeItem('dashboard');
          const template = templateResp.filter((item: ITemplate) => item.type === 'DASHBOARD' && item.activated);
          const templatesConfiguration = template.map((item: ITemplate) => JSON.parse(item.configuration)).flat(1);
          this.SET_COMPS_TREE(templatesConfiguration || []);
          window.localStorage.setItem('version', '8.0');
          window.localStorage.setItem('dashboard', JSON.stringify(templatesConfiguration));
        }
        this.handleOption();
        this.checkCacheTime();
        this.intervalCache = setInterval(() => {
          this.checkCacheTime();
        }, 3600000); // 1h
      });
    }
    private checkCacheTime() {
      const templatesCacheTime = localStorage.getItem('templatesCacheTime');
      if (templatesCacheTime) {
        const diffTime = new Date().getTime() - Number(templatesCacheTime);
        const diffDay = diffTime / 1000 / (60 * 60 * 24);
        if (diffDay >= 3) {
          const isUpdatedTemplates = localStorage.getItem('isUpdatedTemplates');
          if (isUpdatedTemplates === 'true') {
            this.showCacheModal = true;
          }
        }
      } else {
        this.showCacheModal = true;
        localStorage.setItem('templatesCacheTime', String(new Date().getTime()));
      }
    }
    private clearDashboardTemps() {
      const templatesConfiguration = this.rocketComps.templates.filter((item: any) => item.activated);
      this.SET_COMPS_TREE(templatesConfiguration || []);
      localStorage.setItem('dashboard', JSON.stringify(templatesConfiguration));
      localStorage.setItem('templatesCacheTime', String(new Date().getTime()));
      this.UPDATE_DASHBOARD();
      this.showCacheModal = false;
    }
    private closeCacheModal() {
      this.showCacheModal = false;
      localStorage.setItem('templatesCacheTime', String(new Date().getTime()));
    }
    private beforeDestroy() {
      this.SET_EDIT(false);
      clearInterval(this.intervalCache);
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
  .rk-add-dashboard-item {
    height: 342px;
    text-align: center;
    line-height: 250px;
    border: 1px dashed rgba(196, 200, 225, 0.5);
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
  }
  .reminder-btns {
    margin-top: 15px;
    text-align: right;
  }
  .rk-cache-modal-btn {
    display: inline-block;
    height: 30px;
    width: 80px;
    text-align: center;
    line-height: 26px;
    border-radius: 3px;
    border: 1px solid #ddd;
    color: #333;
    outline: none;
    cursor: pointer;
  }
  .bg-blue {
    color: #fff;
  }
</style>
