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
  <div class="rk-topo-instance-dependency">
    <div v-if="stateTopo.selectedInstanceCall" class="rk-instance-dependency-metrics">
      <div class="mb-5 clear">
        <span class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
        <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('CLIENT')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{'active':stateTopo.queryInstanceMetricsType==='CLIENT'}"
            @click="setMode('CLIENT')"
        >{{ this.$t('client') }}</span>
        <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('SERVER')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{'active':stateTopo.queryInstanceMetricsType==='SERVER' }"
            @click="setMode('SERVER')"
        >{{ this.$t('server') }}</span>
      </div>
      <div v-if="stateTopo.selectedInstanceCall">
        <TopoChart
            v-if="stateTopo.instanceDependencyMetrics.getResponseTimeTrend"
            :data="stateTopo.instanceDependencyMetrics.getResponseTimeTrend"
            :intervalTime="intervalTime"
            :title="$t('avgResponseTime')"
            unit="ms"
        />
        <TopoChart
            v-if="stateTopo.instanceDependencyMetrics.getThroughputTrend"
            :data="stateTopo.instanceDependencyMetrics.getThroughputTrend"
            :intervalTime="intervalTime"
            :title="$t('avgThroughput')"
            unit="cpm"
        />
        <TopoChart
            v-if="stateTopo.instanceDependencyMetrics.getSLATrend"
            :data="stateTopo.instanceDependencyMetrics.getSLATrend"
            :intervalTime="intervalTime"
            :precent="true"
            :title="$t('avgSLA')"
            unit="%"
        />
        <ChartResponse
            v-if="stateTopo.instanceDependencyMetrics.p50"
            :data="stateTopo.instanceDependencyMetrics"
            :intervalTime="intervalTime"
            :title="$t('percentResponse')"
        />
      </div>
    </div>
    <Topo :datas="stateTopo.instanceDependency"/>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';

import { State as topoState} from '@/store/modules/topology';
import Topo from './topo.vue';
import TopoChart from './topo-chart.vue';
import ChartResponse from './topo-response.vue';

@Component({
  components: {
    Topo, ChartResponse, TopoChart,
  },
})
export default class TopoInstanceDependency extends Vue {
  @Action('rocketTopo/GET_TOPO_INSTANCE_DEPENDENCY') private GET_INSTANCE_DEPENDENCY: any;
  @Getter('durationTime') private durationTime: any;
  @State('rocketTopo') private stateTopo!: topoState;
  @State('rocketDashboard') private rocketDashboard: any;
  @Getter('intervalTime') private intervalTime: any;
  @Mutation('rocketTopo/SET_INSTANCE_DEPEDENCE_TYPE') private SET_MODE_STATUS: any;
  @Mutation('rocketTopo/SET_SELECTED_INSTANCE_CALL') private SET_SELECTED_INSTANCE_CALL: any;

  private showInfo: boolean = true;

  private created() {
    if (!(this.stateTopo.selectedServiceCall && this.stateTopo.selectedServiceCall.source)) {
      return;
    }
    this.GET_INSTANCE_DEPENDENCY({
      serverServiceId: this.stateTopo.selectedServiceCall.source.id,
      clientServiceId: this.stateTopo.selectedServiceCall.target.id,
      duration: this.durationTime,
    });
  }
  private setMode(mode: boolean) {
    this.SET_MODE_STATUS(mode);
  }
  private beforeDestroy() {
    this.SET_SELECTED_INSTANCE_CALL(null);
  }
}

</script>
<style lang="scss">
  .rk-topo-instance-dependency {
    height: 100%;
    position: relative;
    .rk-instance-dependency-metrics {
      width: 320px;
      position: absolute;
      left: 0;
      top: -20px;
      background: #111;
      padding: 10px 20px;
    }
  }
</style>
