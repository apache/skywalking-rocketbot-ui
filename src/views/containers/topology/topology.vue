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
  <div class="rk-topo">
    <Topo
      :current="current"
      @setDialog="(type) => (dialog = type)"
      @setCurrent="setCurrent"
      :nodes="stateTopo.nodes"
      :links="stateTopo.calls"
    />
    <TopoAside />
    <TopoGroup />
    <rk-sidebox :show="dialog.length" @update:show="dialog = ''" :fixed="true" width="100%">
      <window-endpoint
        v-if="dialog === 'endpoint'"
        :current="this.current"
        :endpointComps="stateTopo.topoEndpoints"
        @changeEndpointComps="changeEndpointComps"
        :updateObjects="updateObjects"
      />
      <window-instance
        v-if="dialog === 'instance'"
        :current="this.current"
        :instanceComps="stateTopo.topoInstances"
        @changeInstanceComps="changeInstanceComps"
        :updateObjects="updateObjects"
      />
      <window-trace v-if="dialog === 'trace'" :current="this.current" />
      <window-alarm v-if="dialog === 'alarm'" :current="this.current" />
      <window-endpoint-dependency
        v-if="dialog === 'endpoint_dependency'"
        @changeEndpointComps="changeEndpointComps"
        :current="this.current"
      />
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { AxiosResponse } from 'axios';
  import { State as topoState } from '@/store/modules/topology';
  import { TopologyType } from '../../../constants/constant';
  import WindowEndpoint from '@/views/containers/topology/endpoint/index.vue';
  import WindowInstance from '@/views/containers/topology/instance/index.vue';
  import WindowTrace from '@/views/containers/topology/trace/index.vue';
  import WindowAlarm from '@/views/containers/topology/alarm/index.vue';
  import Topo from '../../components/topology/chart/topo.vue';
  import TopoAside from '../../components/topology/topo-aside.vue';
  import TopoGroup from '../../components/topology/topo-group/index.vue';
  import WindowEndpointDependency from '@/views/containers/topology/endpoint-dependency/index.vue';

  @Component({
    components: {
      Topo,
      TopoAside,
      TopoGroup,
      WindowEndpoint,
      WindowInstance,
      WindowTrace,
      WindowAlarm,
      WindowEndpointDependency,
    },
  })
  export default class Topology extends Vue {
    @State('rocketTopo') private stateTopo!: topoState;
    @Action('rocketTopo/CLEAR_TOPO') private CLEAR_TOPO: any;
    @Action('rocketTopo/CLEAR_TOPO_INFO') private CLEAR_TOPO_INFO: any;
    @Action('GET_ALL_TEMPLATES') private GET_ALL_TEMPLATES: any;
    @Mutation('rocketTopo/SET_TOPO_ENDPOINT') private SET_TOPO_ENDPOINT: any;
    @Mutation('rocketTopo/SET_TOPO_INSTANCE') private SET_TOPO_INSTANCE: any;
    @Mutation('SET_CURRENT_SERVICE') private SET_CURRENT_SERVICE: any;
    @Getter('durationTime') private durationTime: any;

    private current: any = {};
    private dialog: string = '';
    private updateObjects: string = '';

    private created() {
      if (window.localStorage.getItem('topologyInstances') || window.localStorage.getItem('topologyEndpoints')) {
        const instanceComps: string = `${window.localStorage.getItem('topologyInstances')}`;
        const topoInstance = instanceComps ? JSON.parse(instanceComps) : [];
        const endpointComps: string = `${window.localStorage.getItem('topologyEndpoints')}`;
        const topoEndpoint = endpointComps ? JSON.parse(endpointComps) : [];
        this.SET_TOPO_INSTANCE(topoInstance);
        this.SET_TOPO_ENDPOINT(topoEndpoint);
      } else {
        this.queryTemplates();
      }
    }
    private queryTemplates() {
      this.GET_ALL_TEMPLATES().then(
        (
          allTemplates: Array<{
            name: string;
            type: string;
            configuration: string;
            activated: boolean;
            disabled: boolean;
          }>,
        ) => {
          const template =
            allTemplates.filter((item: any) => item.type === TopologyType.TOPOLOGY_INSTANCE && item.activated)[0] || {};
          const instanceComps = JSON.parse(template.configuration) || [];
          this.SET_TOPO_INSTANCE(instanceComps);
          const endpointTemplate =
            allTemplates.filter((item: any) => item.type === TopologyType.TOPOLOGY_ENDPOINT && item.activated)[0] || {};
          const endpointComps = JSON.parse(endpointTemplate.configuration) || [];
          this.SET_TOPO_ENDPOINT(endpointComps);
        },
      );
    }
    private setCurrent(d: any): void {
      this.current = d;
      if (d.isReal) {
        this.SET_CURRENT_SERVICE(d);
      }
    }
    private changeInstanceComps(data: { type: string; json: any }) {
      this.updateObjects = data.type;
      if (!data.json) {
        return;
      }
      this.SET_TOPO_INSTANCE(data.json);
    }
    private changeEndpointComps(data: { type: string; json: any }) {
      this.updateObjects = data.type;
      if (!data.json) {
        return;
      }
      this.SET_TOPO_ENDPOINT(data.json);
    }
    private beforeDestroy() {
      this.CLEAR_TOPO_INFO();
      this.CLEAR_TOPO();
    }
  }
</script>
<style lang="scss">
  .rk-topo {
    position: relative;
    height: 100%;
    min-height: 0;
    display: flex;
    background: #333840;
  }
</style>
