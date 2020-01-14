/** * Licensed to the Apache Software Foundation (ASF) under one or more *
contributor license agreements. See the NOTICE file distributed with * this work
for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you
may not use this file except in compliance with * the License. You may obtain a
copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under
the License is distributed on an "AS IS" BASIS, * WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. * See the License for the
specific language governing permissions and * limitations under the License. */

<template>
  <div>
    <div class="rk-dashboard-bar flex-h">
      <ToolBarSelect
        :selectable="false"
        :title="this.$t('currentService')"
        :current="stateDashboardOption.currentService"
        :data="stateDashboardOption.services"
        icon="package"
      />
      <ToolBarEndpointSelect
        @onChoose="selectEndpoint"
        :title="$t('currentEndpoint')"
        :current="stateDashboardOption.currentEndpoint"
        :data="endpoints"
        icon="code"
      >
      </ToolBarEndpointSelect>
    </div>
    <endpoints-survey
      v-if="!rocketComps.loading"
      :style="`overflow: auto; height: ${endpointsSurveyHeight}`"
    />
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
  label: string;
  key: string;
  name?: string;
}

@Component({
  components: {
    EndpointsSurvey,
    ToolBarSelect,
    ToolBarEndpointSelect,
  },
})
export default class WindowEndpoint extends Vue {
  @State('rocketOption') private stateDashboardOption!: any;
  @State('rocketData') private rocketComps!: any;
  @Getter('durationTime') private durationTime: any;
  @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
  @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT')
  private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
  @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
  @Action('GET_QUERY') private GET_QUERY: any;
  @PropSync('isShow', { default: false })
  private isShowSync!: boolean;
  private endpointsSurveyHeight = '100%';

  private tabsLoading = true;
  private endpointName: string = '0';
  private endpointKey: string = '0';
  private endpoints: any[] = [];

  private dragIndex: number = NaN;

  public dragStart(index: number) {
    this.dragIndex = index;
  }

  private selectEndpoint(i: any) {
    this.SELECT_ENDPOINT({ endpoint: i, duration: this.durationTime });
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
    return this.MIXHANDLE_GET_OPTION({
      compType: 'service',
      duration: this.durationTime,
    }).then(() => {
      this.handleRefresh();
    });
  }

  @Watch('stateDashboardOption.endpoints')
  private watchInstances(endpoints: Endpoint[]) {
    _.forEach(endpoints, ( endpoint ) => {
      endpoint.name = endpoint.label;
    });
    this.endpoints = endpoints;
    if (endpoints.length > 0 && this.endpointName === '0') {
      this.SELECT_ENDPOINT({
        endpoint: endpoints[0],
        duration: this.durationTime,
      });
      if (endpoints[0].name) {
        this.endpointName = endpoints[0].name;
        this.endpointKey = endpoints[0].key;
      }
    }
    this.tabsLoading = false;
  }

  private beforeMount() {
    this.handleOption();
  }

  private mounted() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private resize() {
    this.endpointsSurveyHeight = `${document.body.clientHeight - 101}px`;
  }

  private beforeDestroy() {
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
