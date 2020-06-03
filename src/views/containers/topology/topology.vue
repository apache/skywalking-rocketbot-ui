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
    <rk-sidebox :show="dialog.length" @update:show="dialog = ''" :fixed="true" width="80%">
      <window-endpoint
        v-if="dialog === 'endpoint'"
        :current="this.current"
        :endpointComps="endpointComps"
        @changeEndpointComps="changeEndpointComps"
      />
      <window-instance
        v-if="dialog === 'instance'"
        :current="this.current"
        :instanceComps="instanceComps"
        @changeInstanceComps="changeInstanceComps"
      />
      <window-trace v-if="dialog === 'trace'" :current="this.current" />
      <window-alarm v-if="dialog === 'alarm'" :current="this.current" />
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { AxiosResponse } from 'axios';
  import { State as topoState } from '@/store/modules/topology';
  import WindowEndpoint from '@/views/containers/topology/endpoint/index.vue';
  import WindowInstance from '@/views/containers/topology/instance/index.vue';
  import WindowTrace from '@/views/containers/topology/trace/index.vue';
  import WindowAlarm from '@/views/containers/topology/alarm/index.vue';
  import Topo from '../../components/topology/chart/topo.vue';
  import TopoAside from '../../components/topology/topo-aside.vue';
  import TopoGroup from '../../components/topology/topo-group/index.vue';

  @Component({
    components: {
      Topo,
      TopoAside,
      TopoGroup,
      WindowEndpoint,
      WindowInstance,
      WindowTrace,
      WindowAlarm,
    },
  })
  export default class Topology extends Vue {
    @State('rocketTopo') private stateTopo!: topoState;
    @Action('rocketTopo/CLEAR_TOPO') private CLEAR_TOPO: any;
    @Action('rocketTopo/CLEAR_TOPO_INFO') private CLEAR_TOPO_INFO: any;
    @Action('GET_ALL_TEMPLATES') private GET_ALL_TEMPLATES: any;
    @Getter('durationTime') private durationTime: any;

    private current: any = {};
    private dialog: string = '';
    private instanceComps: any = [];
    private endpointComps: any = [];
    private created() {
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
            allTemplates.filter((item: any) => item.type === 'TOPOLOGY_INSTANCE' && item.activated)[0] || {};
          this.instanceComps = JSON.parse(template.configuration) || [];
          const endpointTemplate =
            allTemplates.filter((item: any) => item.type === 'TOPOLOGY_ENDPOINT' && item.activated)[0] || {};
          this.endpointComps = JSON.parse(endpointTemplate.configuration) || [];
        },
      );
    }
    private setCurrent(d: any): void {
      this.current = d;
    }
    private beforeDestroy() {
      this.CLEAR_TOPO_INFO();
      this.CLEAR_TOPO();
    }
    private changeInstanceComps(data: any) {
      this.instanceComps.push(...data);
    }
    private changeEndpointComps(data: any) {
      this.endpointComps.push(...data);
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
