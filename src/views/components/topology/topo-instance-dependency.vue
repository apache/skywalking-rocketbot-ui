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
    <div v-if="showInfo" class="rk-instance-dependency-metrics">
      <div class="mb-5 clear">
        <span v-if="stateTopo.selectedCallId" class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
        <span v-else-if="showServerInfo" class="b dib mr-20 vm">{{ $t('serviceDetail') }}</span>
        <span
            v-if="stateTopo.detectPoints.indexOf('CLIENT') !== -1"
            :class="{'active':!stateTopo.mode}"
            class="link-topo-aside-box-btn tc r sm cp b"
            @click="setMode(false)"
        >{{ this.$t('client') }}</span>
        <span
            v-if="stateTopo.detectPoints.indexOf('SERVER') !== -1"
            :class="{'active':stateTopo.mode}"
            class="link-topo-aside-box-btn tc r sm cp b"
            @click="setMode(true)"
        >{{ this.$t('server') }}</span>
      </div>
      <div v-if="stateTopo.selectedCallId">
        <TopoChart
            v-if="stateTopo.getResponseTimeTrend.length"
            :data="stateTopo.getResponseTimeTrend"
            :intervalTime="intervalTime"
            :title="$t('avgResponseTime')"
            unit="ms"
        />
        <TopoChart
            v-if="stateTopo.getThroughputTrend.length"
            :data="stateTopo.getThroughputTrend"
            :intervalTime="intervalTime"
            :title="$t('avgThroughput')"
            unit="cpm"
        />
        <TopoChart
            v-if="stateTopo.getSLATrend.length"
            :data="stateTopo.getSLATrend"
            :intervalTime="intervalTime"
            :precent="true"
            :title="$t('avgSLA')"
            unit="%"
        />
        <ChartResponse
            v-if="stateTopo.p50.length"
            :data="stateTopo"
            :intervalTime="intervalTime"
            :title="$t('percentResponse')"
        />
      </div>
      <div v-else-if="showServerInfo">
        <TopoChart
            v-if="rocketDashboard.instanceResponseTime.ResponseTime.length"
            :data="rocketDashboard.instanceResponseTime.ResponseTime"
            :intervalTime="intervalTime"
            title="Service ResponseTime"
            unit="ms"
        />
        <TopoChart
            v-if="rocketDashboard.instanceThroughput.Throughput.length"
            :data="rocketDashboard.instanceThroughput.Throughput"
            :intervalTime="intervalTime"
            title="Service Throughput"
            unit="cpm"
        />
        <ChartResponse
            v-if="rocketDashboard.instancePercent.p50.length"
            :data="rocketDashboard.instancePercent"
            :intervalTime="intervalTime"
            title="Service Response Time Percentile"
            unit="ms"
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

  private showInfo: boolean = true;

  private created() {
    if (!this.stateTopo.selectedCallId) {
      return;
    }
    const selectedIds = this.stateTopo.selectedCallId.split('_');
    this.GET_INSTANCE_DEPENDENCY({
      serverServiceId: selectedIds[0],
      clientServiceId: selectedIds[1],
      duration: this.durationTime,
    });
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
