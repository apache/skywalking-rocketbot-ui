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
      title="Instances"
      :visible.sync="isShowSync"
      direction="rtl"
      size="80%">
      <div class="rk-dashboard-bar flex-h">
        <ToolBarSelect
            :selectable="false"
            :title="this.$t('currentService')"
            :current="stateDashboardOption.currentService"
            :data="stateDashboardOption.services" icon="package"/>
        <ToolBarSelect
            @onChoose="selectInstance"
            :title="$t('currentInstance')"
            :current="stateDashboardOption.currentInstance"
            :data="instances" icon="disk"/>
      </div>
      <instances-survey v-if="isShowSync" :style="`overflow: auto; height: ${instancesSurveyHeight}`" />
    </el-drawer>
  </div>
</template>

<script lang="ts">
  import InstancesSurvey from '@/views/components/topology/instances-survey.vue';
  import ToolBarSelect from '@/views/components/dashboard/tool-bar-select.vue';
  import ToolBarEndpointSelect from '@/views/components/dashboard/tool-bar-endpoint-select.vue';
  import _ from 'lodash';
  import Vue from 'vue';
  import { Component, PropSync, Watch } from 'vue-property-decorator';
  import { Action, Getter, State } from 'vuex-class';

  interface Instance {
    label: string,
    key: string,
    name?: string
  }

  @Component({
    components: {
      InstancesSurvey,
      ToolBarSelect,
      ToolBarEndpointSelect
    },
  })
  export default class InstancesSurveyWindow extends Vue {
    @State('rocketOption') private stateDashboardOption!: any;
    @State('rocketData') private rocketComps!: any;
    @Getter('durationTime') private durationTime: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT') private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @PropSync('isShow', { default: false })
    isShowSync!: boolean;
    instancesSurveyHeight = '100%';

    tabsLoading = true;
    instanceName: string = '0';
    instances: any[] = [];

    serviceName!: string;
    clusterName!: string;

    private dragIndex: number = NaN;

    public dragStart(index: number) {
      this.dragIndex = index;
    }

    private selectInstance(tab: any) {
      const instance = _.find(this.stateDashboardOption.instances, { name: tab.name });
      if (instance) {
        this.SELECT_INSTANCE({ instance, duration: this.durationTime });
        this.instanceName = tab.name;
      }
    }

    private handleRefresh() {
      this.GET_QUERY({
        serviceId: this.stateDashboardOption.currentService.key || '',
        duration: this.durationTime,
      });
    }

    private handleOption() {
      this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 3 });
      return this.MIXHANDLE_GET_OPTION({ compType: 'service', duration: this.durationTime })
      .then(() => {
        this.handleRefresh();
      });
    }

    @Watch('stateDashboardOption.instances')
    watchInstances(instances: Instance[]) {
      _.forEach(instances, instance => {
        instance.name = instance.label.includes('@') ? instance.label.split('@')[1] : instance.label;
      });
      this.instances = instances;
      if (instances.length > 0 && (this.instanceName = '0')) {
        this.SELECT_INSTANCE({ instance: instances[0], duration: this.durationTime });
        instances[0].name && (this.instanceName = instances[0].name);
      }
      this.tabsLoading = false;
    }

    beforeMount() {
      this.serviceName = this.stateDashboardOption.currentService.label;
      this.clusterName = '';
      this.handleOption();
    }

    mounted(){
      this.resize();
      window.addEventListener('resize', this.resize);
    }

    resize() {
      this.instancesSurveyHeight = `${document.body.clientHeight - 101}px`;
    }

    beforeDestroy(){
      window.removeEventListener('resize', this.resize);
    }
  }
</script>

<style lang="less" scoped>

</style>
