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
  <div class="endpoint-dependency-page">
    <div class="rk-dashboard-bar flex-h">
      <ToolBarSelect :selectable="false" :title="$t('currentService')" :current="current" icon="package" />
      <ToolBarEndpointSelect
        @onChoose="selectEndpoint"
        :title="$t('currentEndpoint')"
        :current="stateDashboardOption.currentEndpoint"
        :data="stateDashboardOption.endpoints"
        icon="code"
      />
      <ToolBarEndpointSelect
        @onChoose="selectDepth"
        :title="$t('currentDepth')"
        :current="rocketTopo.currentEndpointDepth"
        :data="depths"
        icon="code"
      />
    </div>
    <TopoEndpointDependency />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Watch, Prop } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import ToolBarSelect from '@/views/components/dashboard/tool-bar/tool-bar-select.vue';
  import ToolBarEndpointSelect from '@/views/components/dashboard/tool-bar/tool-bar-endpoint-select.vue';
  import TopoEndpointDependency from '@/views/components/topology/topo-endpoint-dependency.vue';

  @Component({
    components: {
      ToolBarSelect,
      ToolBarEndpointSelect,
      TopoEndpointDependency,
    },
  })
  export default class WindowEndpointDependency extends Vue {
    @State('rocketOption') private stateDashboardOption!: any;
    @State('rocketTopo') private rocketTopo!: any;
    @Getter('durationTime') private durationTime: any;
    @Mutation('SET_CURRENT_SERVICE') private SET_CURRENT_SERVICE: any;
    @Mutation('SET_EDIT') private SET_EDIT: any;
    @Mutation('rocketTopo/SET_ENDPOINT_DEPENDENCY_METRICS') private SET_ENDPOINT_DEPENDENCY_METRICS: any;
    @Mutation('rocketTopo/SET_ENDPOINT_DEPTH') private SET_ENDPOINT_DEPTH: any;
    @Action('GET_SERVICE_ENDPOINTS') private GET_SERVICE_ENDPOINTS: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT') private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
    @Action('rocketTopo/GET_ALL_ENDPOINT_DEPENDENCY') private GET_ALL_ENDPOINT_DEPENDENCY: any;
    @Prop() private current!: { key: number | string; label: string };

    private depths: Array<{ key: number; label: string }> = [{ key: 2, label: '2' }];

    private beforeMount() {
      this.SET_CURRENT_SERVICE(this.current);
      this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 2 });
      this.GET_SERVICE_ENDPOINTS({ duration: this.durationTime, serviceId: this.current.key, keyword: '' }).then(() => {
        this.selectEndpoint(this.stateDashboardOption.endpoints[0] || {});
      });
      this.depths = [1, 2, 3, 4, 5].map((item: number) => ({ key: item, label: String(item) }));
    }

    private selectEndpoint(i: any) {
      this.SELECT_ENDPOINT({ endpoint: i, duration: this.durationTime });
      this.GET_ALL_ENDPOINT_DEPENDENCY({ endpointIds: [i.key], duration: this.durationTime });
      this.SET_ENDPOINT_DEPENDENCY_METRICS({ respTime: [], sla: [], cpm: [], percentile: {} });
    }

    private selectDepth(i: { key: number; label: string }) {
      this.SET_ENDPOINT_DEPTH(i);
      this.GET_ALL_ENDPOINT_DEPENDENCY({
        endpointIds: [this.stateDashboardOption.currentEndpoint.key],
        duration: this.durationTime,
      });

      this.SET_ENDPOINT_DEPENDENCY_METRICS({ respTime: [], sla: [], cpm: [], percentile: {} });
    }

    private beforeDestroy() {
      this.SET_EDIT(false);
      this.SET_ENDPOINT_DEPTH({ key: 2, label: '2' });
      this.$emit('changeEndpointComps', { type: '' });
    }
  }
</script>

<style lang="scss">
  .endpoint-dependency-page {
    height: calc(100% - 48px);
    .rk-dashboard-bar {
      border-bottom: 1px solid #252a2f;
    }
  }
</style>
