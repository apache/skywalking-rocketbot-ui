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
  <div class="rk-dashboard-bar flex-h">
    <ToolBarBtns
      :rocketGlobal="rocketGlobal"
      :rocketComps="rocketComps"
      :compType="compType"
      :durationTime="durationTime"
    />
    <div class="dashboard-selectors flex-h" v-if="compType === dashboardType.SERVICE">
      <div class="flex-h">
        <div class="sm grey service-search">
          <div>{{ $t('serviceGroup') }}</div>
          <input
            type="text"
            :value="rocketComps.tree[rocketComps.group].serviceGroup"
            @change="searchServices($event.target.value)"
          />
        </div>
        <ToolBarSelect
          @onChoose="selectService"
          :title="$t('currentService')"
          :current="stateDashboard.currentService"
          :data="stateDashboard.services"
          icon="package"
        />
        <ToolBarEndpointSelect
          @onChoose="selectEndpoint"
          :title="$t('currentEndpoint')"
          :current="stateDashboard.currentEndpoint"
          :data="stateDashboard.endpoints"
          :currentService="stateDashboard.currentService"
          icon="code"
        />
        <ToolBarSelect
          @onChoose="selectInstance"
          :title="$t('currentInstance')"
          :current="stateDashboard.currentInstance"
          :data="stateDashboard.instances"
          icon="disk"
        />
        <a
          class="rk-view-instance-attributes r"
          @click="() => (dialogAttributesVisible = true)"
          v-tooltip:bottom="{ content: $t('instanceAttributes') }"
        >
          <rk-icon icon="info_outline" />
        </a>
        <rk-sidebox
          width="600px"
          :fixed="true"
          :title="`${$t('instanceAttributes')} of ${stateDashboard.currentInstance.label}`"
          :show.sync="dialogAttributesVisible"
          class="instance-attributes-box"
        >
          <div
            class="instance-attr"
            v-for="(attr, index) in stateDashboard.currentInstance.attributes"
            :key="attr.name + index"
          >
            {{ attr.name + ' : ' + attr.value }}
          </div>
        </rk-sidebox>
      </div>
      <DashboardEvent
        :rocketComps="rocketComps"
        :stateDashboard="stateDashboard"
        :durationTime="durationTime"
        :type="pageEventsType.DASHBOARD_EVENTS"
      />
    </div>
    <div class="flex-h" v-else-if="compType === dashboardType.BROWSER">
      <ToolBarSelect
        @onChoose="selectService"
        :title="$t('currentService')"
        :current="stateDashboard.currentService"
        :data="stateDashboard.services"
        icon="package"
      />
      <ToolBarSelect
        @onChoose="selectInstance"
        :title="$t('currentVersion')"
        :current="stateDashboard.currentInstance"
        :data="stateDashboard.instances"
        icon="disk"
      />
      <ToolBarEndpointSelect
        @onChoose="selectEndpoint"
        :title="$t('currentPage')"
        :current="stateDashboard.currentEndpoint"
        :data="stateDashboard.endpoints"
        :currentService="stateDashboard.currentService"
        icon="code"
      />
    </div>
    <div class="flex-h" v-else-if="compType === dashboardType.DATABASE">
      <ToolBarSelect
        @onChoose="SELECT_DATABASE"
        :title="$t('currentDatabase')"
        :current="stateDashboard.currentDatabase"
        :data="stateDashboard.databases"
        icon="epic"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import ToolBarSelect from './tool-bar-select.vue';
  import ToolBarEndpointSelect from './tool-bar-endpoint-select.vue';
  import ToolBarBtns from './tool-bar-btns.vue';
  import { Action, Mutation } from 'vuex-class';
  import { EntityType } from '../charts/constant';
  import { DurationTime, Option } from '@/types/global';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { State as rocketGlobal } from '@/store/modules/global';
  import { State as optionState } from '@/store/modules/global/selectors';
  import DashboardEvent from './dashboard-events.vue';
  import { DASHBOARDTYPE } from '../constant';
  import { PageEventsType, PageTypes } from '@/constants/constant';

  @Component({ components: { ToolBarSelect, ToolBarBtns, ToolBarEndpointSelect, DashboardEvent } })
  export default class ToolBar extends Vue {
    @Prop() private compType!: string;
    @Prop() private stateDashboard!: optionState;
    @Prop() private rocketGlobal!: rocketGlobal;
    @Prop() private rocketComps!: rocketData;
    @Prop() private durationTime!: DurationTime;
    @Mutation('SET_CURRENT_SERVICE_GROUP') private SET_CURRENT_SERVICE_GROUP: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;
    @Action('SELECT_SERVICE') private SELECT_SERVICE: any;
    @Action('SELECT_DATABASE') private SELECT_DATABASE: any;
    @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('GET_EVENT') private GET_EVENT: any;
    private dialogAttributesVisible: boolean = false;
    private dashboardType = DASHBOARDTYPE;
    private pageEventsType = PageEventsType;
    get lastKey() {
      const current = this.rocketComps.tree[this.rocketComps.group].children[this.rocketComps.current].children;
      if (!current.length) {
        return 0;
      }
      return current[current.length - 1].k;
    }
    private selectService(i: Option) {
      if (!this.rocketComps.enableEvents) {
        this.SELECT_SERVICE({ service: i, duration: this.durationTime });
        return;
      }
      this.SELECT_SERVICE({ service: i, duration: this.durationTime, callback: this.GET_EVENT });
      this.GET_EVENT({
        condition: {
          time: this.durationTime,
          size: 20,
          source: {
            service: i.label,
          },
        },
        type: EntityType[0].key,
      });
    }
    private selectEndpoint(i: Option) {
      if (!this.rocketComps.enableEvents) {
        this.SELECT_ENDPOINT({ endpoint: i, duration: this.durationTime });
        return;
      }
      this.GET_EVENT({
        condition: {
          time: this.durationTime,
          size: 20,
          source: {
            service: this.stateDashboard.currentService.label,
            endpoint: i.label,
          },
        },
        type: EntityType[2].key,
      }).then(() => {
        this.SELECT_ENDPOINT({ endpoint: i, duration: this.durationTime });
      });
    }
    private selectInstance(i: Option) {
      if (!this.rocketComps.enableEvents) {
        this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
        return;
      }
      this.GET_EVENT({
        condition: {
          time: this.durationTime,
          size: 20,
          source: {
            service: this.stateDashboard.currentService.label,
            serviceInstance: i.label,
          },
        },
        type: EntityType[3].key,
      }).then(() => {
        this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
      });
    }
    private searchServices(value: string) {
      this.SET_CURRENT_SERVICE_GROUP(value);
      this.MIXHANDLE_GET_OPTION({
        compType: this.dashboardType.SERVICE,
        duration: this.durationTime,
        keywordServiceName: value,
        pageType: PageTypes.DASHBOARD,
      }).then(() => {
        this.UPDATE_DASHBOARD();
      });
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-bar {
    flex-shrink: 0;
    color: #efefef;
    background-color: #333840;
    .dashboard-selectors {
      width: calc(100% - 150px);
      justify-content: space-between;
    }
    .instance-attributes-box {
      color: #252a2f;
    }
    .instance-attr {
      padding: 20px 0 0 20px;
      font-size: 13px;
    }
    .service-search {
      padding: 0 5px;
      border-right: 2px solid #252a2f;
      input {
        border-style: unset;
        outline: 0;
        padding: 2px 5px;
        border-radius: 2px;
        width: 120px;
      }
      div {
        padding: 0 2px;
      }
    }
    .rk-view-instance-attributes {
      background-color: rgba(255, 255, 255, 0.07);
      border-radius: 4px;
      margin-left: 5px;
      padding: 3px;
      color: #efefef;
    }
  }
</style>
