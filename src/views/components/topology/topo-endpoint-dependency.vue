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
  <div class="rk-endpoint-dependency">
    <div class="endpoint-dependency-chart">
      <DependencySankey
        v-if="stateTopo.endpointDependency.nodes.length"
        :data="stateTopo.endpointDependency"
        @showMetrics="showEndpointMetrics"
      />
      <div v-else class="endpoint-dependency-empty">
        No Endpoint Dependency
      </div>
    </div>
    <div class="endpoint-dependency-metrics">
      <div v-if="respTime.length">
        <TopoChart :data="respTime" :intervalTime="intervalTime" :title="$t('avgResponseTime')" unit="ms" />
      </div>
      <div v-if="cpm.length">
        <TopoChart :data="cpm" :intervalTime="intervalTime" :title="$t('avgThroughput')" unit="cpm" />
      </div>
      <div v-if="sla.length">
        <TopoChart :data="sla" :intervalTime="intervalTime" :precent="true" :title="$t('avgSLA')" unit="" />
      </div>
      <div v-if="percentile.p50">
        <ChartLine :data="percentile" :intervalTime="intervalTime" :title="$t('percentResponse')" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { State as topoState, EndpointDependencyConidition, Call, Duration } from '@/store/modules/topology';
  import TopoChart from './topo-chart.vue';
  import DependencySankey from './dependency-sankey.vue';
  import ChartLine from './chart-line.vue';

  @Component({
    components: {
      ChartLine,
      TopoChart,
      DependencySankey,
    },
  })
  export default class TopoEndpointDependency extends Vue {
    @Getter('durationTime') private durationTime!: Duration;
    @Getter('intervalTime') private intervalTime: any;
    @State('rocketTopo') private stateTopo!: topoState;
    @Action('rocketTopo/GET_ENDPOINT_DEPENDENCY_METRICS') private GET_ENDPOINT_DEPENDENCY_METRICS: any;

    private respTime: number[] = [];
    private cpm: number[] = [];
    private sla: number[] = [];
    private percentile: { [key: string]: number[] } = {};

    private showEndpointMetrics(data: EndpointDependencyConidition & Call) {
      this.GET_ENDPOINT_DEPENDENCY_METRICS({
        serviceName: data.serviceName,
        endpointName: data.endpointName,
        destServiceName: data.destServiceName,
        destEndpointName: data.destEndpointName,
        duration: this.durationTime,
      }).then(() => {
        this.updateMetrics();
      });
    }

    @Watch('stateTopo.endpointDependency.nodes')
    private updateMetrics() {
      this.respTime = this.stateTopo.endpointDependencyMetrics.respTime;
      this.cpm = this.stateTopo.endpointDependencyMetrics.cpm;
      this.sla = this.stateTopo.endpointDependencyMetrics.sla;
      this.percentile = this.stateTopo.endpointDependencyMetrics.percentile;
    }

    private beforeDestroy() {
      this.stateTopo.endpointDependency = {
        calls: [],
        nodes: [],
      };
    }
  }
</script>
<style lang="scss">
  .rk-endpoint-dependency {
    background: #333840;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .endpoint-dependency-chart {
      height: 80%;
      min-height: 500px;
    }
    .endpoint-dependency-metrics {
      height: 20%;
      min-height: 100px;
      display: flex;
      flex-direction: row;
      padding-left: 10px;
      > div {
        width: 25%;
        height: 100%;
      }
    }
    .endpoint-dependency-empty {
      color: #fff;
      text-align: center;
      height: 500px;
      line-height: 500px;
    }
  }
</style>
