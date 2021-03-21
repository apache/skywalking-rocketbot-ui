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
  <div class="rk-topo-instance-dependency">
    <div class="rk-dependency-chart">
      <DependencySankey :data="stateTopo.instanceDependency" @showMetrics="showDependencyMetrics" />
    </div>
    <div class="rk-instance-metric-box">
      <div v-if="!stateTopo.instanceDependency.nodes.length">
        No Instance Dependency
      </div>
      <div v-if="stateTopo.selectedInstanceCall" class="rk-instance-dependency-metrics">
        <div class="mb-5 clear">
          <span class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
          <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('CLIENT')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{ active: stateTopo.queryInstanceMetricsType === 'CLIENT' }"
            @click="setMode('CLIENT')"
            >{{ $t('client') }}</span
          >
          <span
            v-if="stateTopo.selectedInstanceCall.detectPoints.includes('SERVER')"
            class="link-topo-aside-box-btn tc r sm cp b"
            :class="{ active: stateTopo.queryInstanceMetricsType === 'SERVER' }"
            @click="setMode('SERVER')"
            >{{ $t('server') }}</span
          >
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
          <ChartLine
            v-if="stateTopo.instanceDependencyMetrics.percentResponse"
            :data="stateTopo.instanceDependencyMetrics.percentResponse"
            :intervalTime="intervalTime"
            :title="$t('percentResponse')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { State as topoState } from '@/store/modules/topology';
  import Topo from './chart/topo.vue';
  import TopoChart from './topo-chart.vue';
  import DependencySankey from './dependency-sankey.vue';
  import ChartLine from './chart-line.vue';

  @Component({
    components: {
      Topo,
      ChartLine,
      TopoChart,
      DependencySankey,
    },
  })
  export default class TopoInstanceDependency extends Vue {
    @Getter('durationTime') private durationTime: any;
    @State('rocketTopo') private stateTopo!: topoState;
    @Getter('intervalTime') private intervalTime: any;
    @Mutation('rocketTopo/SET_INSTANCE_DEPEDENCE_TYPE')
    private SET_MODE_STATUS: any;
    @Action('rocketTopo/GET_INSTANCE_DEPENDENCY_METRICS')
    private GET_INSTANCE_DEPENDENCY_METRICS: any;

    private showInfo: boolean = true;

    private setMode(mode: string) {
      this.GET_INSTANCE_DEPENDENCY_METRICS({
        ...this.stateTopo.selectedInstanceCall,
        durationTime: this.durationTime,
        mode,
      });
    }
    private showDependencyMetrics(data: any) {
      this.GET_INSTANCE_DEPENDENCY_METRICS({
        ...data,
        durationTime: this.durationTime,
        mode: data.detectPoints[0],
      });
    }
  }
</script>
<style lang="scss">
  .rk-topo-instance-dependency {
    height: 100%;
    display: flex;
    flex-direction: row;
    & > :first-child {
      line-height: 400px;
      text-align: center;
      width: 100%;
    }
    .rk-instance-metric-box {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .rk-instance-dependency-metrics {
      width: 320px;
      height: 650px;
      margin-top: 10px;
      background: #252a2f;
      padding: 20px;
    }
    .rk-dependency-chart {
      width: 850px;
      height: 100%;
    }
  }
</style>
