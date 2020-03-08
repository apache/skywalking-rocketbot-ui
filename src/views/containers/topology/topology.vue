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
  <div class="rk-topo">
    <Topo :current="current" @setDialog="(type) => dialog = type" @setCurrent="setCurrent" :nodes="stateTopo.nodes" :links="stateTopo.calls"/>
    <TopoAside />
    <TopoGroup />
    <rk-sidebox :show="dialog.length" @update:show="dialog = ''" :fixed="true" width="80%">
      <window-endpoint
        v-if="dialog === 'endpoint'"
        :current="this.current"
      />
      <window-instance
        v-if="dialog === 'instance'"
        :current="this.current"
      />
      <window-trace
        v-if="dialog === 'trace'"
        :current="this.current"
      />
      <window-alarm
        v-if="dialog === 'alarm'"
        :current="this.current"
      />
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { AxiosResponse } from 'axios';
  import WindowEndpoint from '@/views/containers/topology/endpoint/index.vue';
  import WindowInstance from '@/views/containers/topology/instance/index.vue';
  import WindowTrace from '@/views/containers/topology/trace/index.vue';
  import WindowAlarm from '@/views/containers/topology/alarm/index.vue';
  import Topo from '../../components/topology/chart/topo.vue';
  import TopoAside from '../../components/topology/topo-aside.vue';
  import TopoGroup from '../../components/topology/topo-group/index.vue';
  import { State as topoState } from '@/store/modules/topology';

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
    @State('rocketOption') private stateDashboardOption!: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Action('rocketTopo/GET_TOPO') private GET_TOPO: any;
    @Action('rocketTopo/CLEAR_TOPO') private CLEAR_TOPO: any;
    @Action('rocketTopo/CLEAR_TOPO_INFO') private CLEAR_TOPO_INFO: any;
    @Getter('durationTime') private durationTime: any;

    private current: any = {};
    private dialog: string = '';
    private setCurrent(d: any): void {
      this.current = d;
    }
    private beforeMount(): void {
      this.SET_EVENTS([this.getTopo]);
    }
    private mounted() {
      this.getTopo();
    }
    private getTopo() {
      this.GET_TOPO({ duration: this.durationTime });
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
