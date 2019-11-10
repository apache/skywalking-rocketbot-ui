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
  <div class="performance-metrics-window">
    <el-drawer
      :destroy-on-close="true"
      :visible.sync="isShowSync"
      direction="rtl"
      size="80%">
      <div class="rk-dashboard-bar flex-h">
        <ToolBarSelect
            :selectable="false"
            :title="this.$t('currentService')"
            :current="stateDashboardOption.currentService"
            :data="stateDashboardOption.services"
            icon="package"/>
        <ToolBarEndpointSelect @onChoose="selectInstance" :title="$t('currentEndpoint')"
                               :current="stateDashboardOption.currentEndpoint" :data="endpoints" icon="code">
        </ToolBarEndpointSelect>
      </div>
      <endpoints-survey v-if="!rocketComps.loading" :style="`overflow: auto; height: ${instancesSurveyHeight}`" />
<!--      <el-tabs v-model="endpointName" @tab-click="selectInstance">-->
<!--        <el-tab-pane v-for="(endpoint) in endpoints" :key="endpoint.key"-->
<!--                     :label="endpoint.name" :name="endpoint.name" :lazy="true"-->
<!--        >-->
<!--          <endpoints-survey v-if="!rocketComps.loading" :style="`overflow: auto; height: ${instancesSurveyHeight}`" />-->
<!--        </el-tab-pane>-->
<!--      </el-tabs>-->
    </el-drawer>
  </div>
</template>

<script lang="ts">
  import EndpointsSurvey from '@/views/components/topology/endpoints-survey.vue';
  import ToolBarSelect from '@/views/components/dashboard/tool-bar-select.vue';
  import ToolBarEndpointSelect from '@/views/components/dashboard/tool-bar-endpoint-select.vue';
  import _ from 'lodash';
  import Vue from 'vue';
  import { Component, PropSync, Watch } from 'vue-property-decorator';
  import { Action, Getter, State } from 'vuex-class';

  interface Endpoint {
    label: string,
    key: string,
    name?: string
  }

  @Component({
    components: {
      EndpointsSurvey,
      ToolBarSelect,
      ToolBarEndpointSelect
    },
  })
  export default class InstancesSurveyWindow extends Vue {
    @State('rocketOption') private stateDashboardOption!: any;
    @State('rocketData') private rocketComps!: any;
    @Getter('durationTime') private durationTime: any;
    @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT') private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @PropSync('isShow', { default: false })
    isShowSync!: boolean;
    instancesSurveyHeight = '100%';

    tabsLoading = true;
    endpointName: string = '0';
    endpointKey: string = '0';
    endpoints: any[] = [];

    serviceName!: string;
    clusterName!: string;

    private dragIndex: number = NaN;

    public dragStart(index: number) {
      this.dragIndex = index;
    }

    private selectInstance(tab: any) {
      const endpoint = _.find(this.stateDashboardOption.endpoints, { name: tab.name });
      if (endpoint) {
        this.SELECT_ENDPOINT({ endpoint, duration: this.durationTime });
        this.endpointName = tab.name;
      }
    }

    private handleRefresh() {
      this.GET_QUERY({
        serviceId: this.stateDashboardOption.currentService.key || '',
        endpointId: this.endpointKey || '',
        endpointName: this.endpointName || '',
        duration: this.durationTime,
      });
    }

    private handleOption() {
      this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 2 });
      return this.MIXHANDLE_GET_OPTION({ compType: 'service', duration: this.durationTime })
      .then(() => {
        this.handleRefresh();
      });
    }

    private selectEndpoint(i: any) {
      this.SELECT_ENDPOINT({endpoint: i, duration: this.durationTime});
    }

    @Watch('stateDashboardOption.endpoints')
    watchInstances(endpoints: Endpoint[]) {
      _.forEach(endpoints, endpoint => {
        endpoint.name = endpoint.label;
      });
      this.endpoints = endpoints;
      if (endpoints.length > 0 && (this.endpointName = '0')) {
        this.SELECT_ENDPOINT({ endpoint: endpoints[0], duration: this.durationTime });
        endpoints[0].name && (this.endpointName = endpoints[0].name) && (this.endpointKey = endpoints[0].key);
      }
      this.tabsLoading = false;
    }

    beforeMount() {
      this.serviceName = this.stateDashboardOption.currentService.label;
      this.serviceName = this.stateDashboardOption.currentService.label;
      this.clusterName = '';
      this.handleOption();
    }

    mounted(){
      this.resize();
      window.addEventListener('resize', this.resize);
    }

    resize() {
      this.instancesSurveyHeight = `${document.body.clientHeight - 145}px`;
    }

    beforeDestroy(){
      window.removeEventListener('resize', this.resize);
    }
  }
</script>

<style lang="scss">
  .rk-dashboard-bar {
    flex-shrink: 0;
    color: #efefef;
    background-color: #333840;
  }
</style>
