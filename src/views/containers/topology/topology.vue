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
      <window-endpoint v-if="dialog === 'endpoint'" :current="this.current" />
      <window-instance v-if="dialog === 'instance'" :current="this.current" />
      <window-trace v-if="dialog === 'trace'" :current="this.current" />
      <window-alarm v-if="dialog === 'alarm'" :current="this.current" />
      <window-endpoint-dependency v-if="dialog === 'endpoint_dependency'" :current="this.current" />
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { State, Action, Mutation } from 'vuex-class';
  import { State as topoState } from '@/store/modules/topology';
  import { TopologyType, PageTypes } from '@/constants/constant';
  import WindowEndpoint from '@/views/containers/topology/endpoint/index.vue';
  import WindowInstance from '@/views/containers/topology/instance/index.vue';
  import WindowTrace from '@/views/containers/topology/trace/index.vue';
  import WindowAlarm from '@/views/containers/topology/alarm/index.vue';
  import Topo from '../../components/topology/chart/topo.vue';
  import TopoAside from '../../components/topology/topo-aside.vue';
  import TopoGroup from '../../components/topology/topo-group/index.vue';
  import WindowEndpointDependency from '@/views/containers/topology/endpoint-dependency/index.vue';
  import { Option } from '@/types/global';

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
    @Mutation('rocketTopo/SET_TOPO_SERVICE') private SET_TOPO_SERVICE: any;
    @Mutation('rocketTopo/SET_TOPO_SERVICE_DEPENDENCY') private SET_TOPO_SERVICE_DEPENDENCY: any;
    @Mutation('rocketTopo/SET_TOPO_SERVICE_INSTANCE_DEPENDENCY') private SET_TOPO_SERVICE_INSTANCE_DEPENDENCY: any;
    @Mutation('rocketTopo/EDIT_DEPENDENCY_METRICS') private EDIT_DEPENDENCY_METRICS: any;
    @Mutation('rocketTopo/SET_TOPO_ENDPOINT_DEPENDENCY') private SET_TOPO_ENDPOINT_DEPENDENCY: any;
    @Mutation('SET_CURRENT_SERVICE') private SET_CURRENT_SERVICE: any;
    @Mutation('SET_EDIT') private SET_EDIT: any;
    @Mutation('SET_PAGE_TYPE') private SET_PAGE_TYPE: any;

    private current: any = {};
    private dialog: string = '';

    private created() {
      this.SET_PAGE_TYPE(PageTypes.TOPOLOGY);
      this.initMetricsTemplate();
    }
    private initMetricsTemplate() {
      localStorage.removeItem('topoTemplateTypes');
      localStorage.removeItem('topologyServices');
      localStorage.removeItem('topologyServicesDependency');

      if (window.localStorage.getItem('topologyServices')) {
        const serviceComps: string = `${window.localStorage.getItem('topologyServices')}`;
        const topoService = serviceComps ? JSON.parse(serviceComps) : [];

        this.SET_TOPO_SERVICE(topoService);
      }
      if (window.localStorage.getItem('topologyInstances')) {
        const instanceComps: string = `${window.localStorage.getItem('topologyInstances')}`;
        const topoInstance = instanceComps ? JSON.parse(instanceComps) : [];

        this.SET_TOPO_INSTANCE(topoInstance);
      }
      if (window.localStorage.getItem('topologyEndpoints')) {
        const endpointComps: string = `${window.localStorage.getItem('topologyEndpoints')}`;
        const topoEndpoint = endpointComps ? JSON.parse(endpointComps) : [];

        this.SET_TOPO_ENDPOINT(topoEndpoint);
      }
      if (localStorage.getItem('topologyServicesDependency')) {
        const serviceDependencyComps: string = `${localStorage.getItem('topologyServicesDependency')}`;
        const topoServiceDependency = serviceDependencyComps ? JSON.parse(serviceDependencyComps) : [];

        this.SET_TOPO_SERVICE_DEPENDENCY(topoServiceDependency);
      }
      if (localStorage.getItem('topologyServicesInstanceDependency')) {
        const serviceInstanceDependencyComps: string = `${localStorage.getItem('topologyServicesInstanceDependency')}`;
        const topoServiceInstanceDependency = serviceInstanceDependencyComps
          ? JSON.parse(serviceInstanceDependencyComps)
          : [];

        this.SET_TOPO_SERVICE_INSTANCE_DEPENDENCY(topoServiceInstanceDependency);
      }
      if (localStorage.getItem('topologyEndpointDependency')) {
        const serviceEndpointComps: string = `${localStorage.getItem('topologyEndpointDependency')}`;
        const topoEndpointDependency = serviceEndpointComps ? JSON.parse(serviceEndpointComps) : [];

        this.SET_TOPO_ENDPOINT_DEPENDENCY(topoEndpointDependency);
      }
      if (
        localStorage.getItem('topologyServices') &&
        localStorage.getItem('topologyInstances') &&
        localStorage.getItem('topologyEndpoints') &&
        localStorage.getItem('topologyServicesDependency') &&
        localStorage.getItem('topologyServicesInstanceDependency') &&
        localStorage.getItem('topologyEndpointDependency')
      ) {
        return;
      }
      this.queryTemplates();
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
          if (!window.localStorage.getItem('topologyInstances')) {
            const template =
              allTemplates.filter((item: any) => item.type === TopologyType.TOPOLOGY_INSTANCE && item.activated)[0] ||
              {};
            const instanceComps = JSON.parse(template.configuration) || [];
            this.SET_TOPO_INSTANCE(instanceComps);
          }
          if (!window.localStorage.getItem('topologyEndpoints')) {
            const endpointTemplate =
              allTemplates.filter((item: any) => item.type === TopologyType.TOPOLOGY_ENDPOINT && item.activated)[0] ||
              {};
            const endpointComps = JSON.parse(endpointTemplate.configuration) || [];
            this.SET_TOPO_ENDPOINT(endpointComps);
          }
          if (!window.localStorage.getItem('topologyServices')) {
            const serviceTemplate =
              allTemplates.filter((item: any) => item.type === TopologyType.TOPOLOGY_SERVICE && item.activated)[0] ||
              {};
            const topoService = JSON.parse(serviceTemplate.configuration) || [];
            this.SET_TOPO_SERVICE(topoService);
          }
          if (!localStorage.getItem('topologyServicesDependency')) {
            const serviceDependencyTemplate =
              allTemplates.filter(
                (item: any) => item.type === TopologyType.TOPOLOGY_SERVICE_DEPENDENCY && item.activated,
              )[0] || {};
            const topoServiceDependency = JSON.parse(serviceDependencyTemplate.configuration) || [];
            this.SET_TOPO_SERVICE_DEPENDENCY(topoServiceDependency);
          }
          if (!localStorage.getItem('topologyServicesInstanceDependency')) {
            const serviceInstanceDependencyTemplate =
              allTemplates.filter(
                (item: any) => item.type === TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY && item.activated,
              )[0] || {};
            const topoServiceInstanceDependency = JSON.parse(serviceInstanceDependencyTemplate.configuration) || [];
            this.SET_TOPO_SERVICE_INSTANCE_DEPENDENCY(topoServiceInstanceDependency);
          }
          if (!localStorage.getItem('topologyEndpointDependency')) {
            const serviceEndpointDependencyTemplate =
              allTemplates.filter(
                (item: any) => item.type === TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY && item.activated,
              )[0] || {};
            const topoEndpointDependency = JSON.parse(serviceEndpointDependencyTemplate.configuration) || [];
            this.SET_TOPO_ENDPOINT_DEPENDENCY(topoEndpointDependency);
          }
        },
      );
    }
    private setCurrent(d: Option & { isReal: boolean }): void {
      this.current = d;
      if (d.isReal) {
        this.SET_CURRENT_SERVICE({ key: d.key, label: d.label });
      }
    }
    private beforeDestroy() {
      this.CLEAR_TOPO_INFO();
      this.CLEAR_TOPO();
      this.SET_EDIT(false);
      this.EDIT_DEPENDENCY_METRICS(false);
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
