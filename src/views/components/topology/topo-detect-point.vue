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
  <div
    v-if="stateTopo.selectedServiceCall || showServerInfo"
    :class="`link-topo-aside-box link-topo-aside-box-${isMini ? 'min' : 'max'}`"
    :style="`top:55px;position: fixed;right: 30px;${showInfoCount === 0 ? 'animation: unset;' : ''}`"
  >
    <svg
      :style="`position:absolute;left:-48px;top:0;transform: rotate(${isMini ? 0 : 180}deg);`"
      class="link-topo-aside-btn icon cp lg"
      @click="setShowInfo"
    >
      <use xlink:href="#chevron-left" />
    </svg>
    <div class="mb-5 clear">
      <div v-if="stateTopo.selectedServiceCall">
        <span class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
        <span
          v-if="stateTopo.detectPoints.indexOf('CLIENT') !== -1"
          :class="{ active: !stateTopo.mode }"
          class="link-topo-aside-box-btn tc r sm cp b"
          @click="setMode(false)"
          >{{ $t('client') }}</span
        >
        <span
          v-if="stateTopo.detectPoints.indexOf('SERVER') !== -1"
          :class="{ active: stateTopo.mode }"
          class="link-topo-aside-box-btn tc r sm cp b"
          @click="setMode(true)"
          >{{ $t('server') }}</span
        >
      </div>
      <span v-else-if="showServerInfo" class="b dib mr-20 vm">{{ $t('serviceDetail') }}</span>
    </div>
    <div v-if="showInfo">
      <div v-if="stateTopo.selectedServiceCall">
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
          unit=""
        />
        <ChartLine
          v-if="stateTopo.responsePercentile.p50.length"
          :data="stateTopo.responsePercentile"
          :intervalTime="intervalTime"
          :title="$t('percentResponse')"
        />
      </div>
      <div v-else-if="showServerInfo">
        <TopoChart
          v-if="stateTopo.serviceResponseTime.length"
          :data="stateTopo.serviceResponseTime"
          :intervalTime="intervalTime"
          title="Service ResponseTime"
          unit="ms"
        />
        <TopoChart
          v-if="stateTopo.serviceThroughput.length"
          :data="stateTopo.serviceThroughput"
          :intervalTime="intervalTime"
          title="Service Throughput"
          unit="cpm"
        />
        <ChartLine
          v-if="stateTopo.servicePercentile.p50.length"
          :data="stateTopo.servicePercentile"
          :intervalTime="intervalTime"
          :title="$t('percentResponse')"
        />
      </div>
    </div>
    <div class="show-dependency" v-if="stateTopo.selectedServiceCall">
      <a class="rk-btn lg" @click="openInstanceModal">{{ $t('ShowInstanceDependency') }}</a>
      <rk-sidebox
        class="instance-dependency"
        width="80%"
        :fixed="false"
        :title="
          `${stateTopo.selectedServiceCall.source.name} -> ${stateTopo.selectedServiceCall.target.name} Instance Dependency`
        "
        :show.sync="dialogTopoVisible"
      >
        <TopoInstanceDependency />
      </rk-sidebox>
    </div>
  </div>
</template>
<script lang="ts">
  import { State as topoState } from '@/store/modules/topology';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import TopoChart from './topo-chart.vue';
  import TopoInstanceDependency from './topo-instance-dependency.vue';
  import ChartLine from './chart-line.vue';
  import { DurationTime } from '@/types/global';
  import compareObj from '@/utils/comparison';

  @Component({
    components: {
      TopoInstanceDependency,
      TopoChart,
      ChartLine,
    },
  })
  export default class TopoDetectPoint extends Vue {
    @State('rocketTopo') private stateTopo!: topoState;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT')
    private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Mutation('rocketTopo/SET_MODE_STATUS') private SET_MODE_STATUS: any;
    @Mutation('rocketTopo/SET_SELECTED_INSTANCE_CALL')
    private SET_SELECTED_INSTANCE_CALL: any;
    @Mutation('rocketTopo/SET_INSTANCE_DEPENDENCY')
    private SET_INSTANCE_DEPENDENCY: any;
    @Action('rocketTopo/CLEAR_TOPO_INFO') private CLEAR_TOPO_INFO: any;
    @Action('rocketTopo/GET_TOPO_INSTANCE_DEPENDENCY')
    private GET_INSTANCE_DEPENDENCY: any;
    @Action('rocketTopo/GET_TOPO_SERVICE_DETAIL') private GET_TOPO_SERVICE_DETAIL: any;

    private isMini: boolean = true;
    private showInfoCount: number = 0;
    private showInfo: boolean = false;
    private dialogTopoVisible = false;

    private get showServerInfo() {
      return this.stateTopo.currentNode.name && this.stateTopo.currentNode.isReal;
    }

    private setShowInfo() {
      this.showInfo = false;
      this.showInfoCount = 1;
      this.isMini = !this.isMini;
      setTimeout(() => {
        this.showInfo = true;
      }, 550);
    }

    private setMode(mode: boolean) {
      this.SET_MODE_STATUS(mode);
      this.stateTopo.callback();
    }

    private clearInstance() {
      this.dialogTopoVisible = false;
      this.SET_SELECTED_INSTANCE_CALL(null);
    }

    private openInstanceModal() {
      this.stateTopo.selectedInstanceCall = null;
      this.dialogTopoVisible = true;
      if (!(this.stateTopo.selectedServiceCall && this.stateTopo.selectedServiceCall.source)) {
        return;
      }
      this.GET_INSTANCE_DEPENDENCY({
        serverServiceId: this.stateTopo.selectedServiceCall.source.id,
        clientServiceId: this.stateTopo.selectedServiceCall.target.id,
        duration: this.durationTime,
      });
    }

    @Watch('durationTime')
    private watchDurationTime(newValue: DurationTime, oldValue: DurationTime) {
      if (compareObj(newValue, oldValue)) {
        const service = this.stateTopo.currentNode;

        this.GET_TOPO_SERVICE_DETAIL({
          serviceId: service.id || '',
          duration: this.durationTime,
        });
      }
    }

    @Watch('stateTopo.selectedServiceCall')
    private watchDetectPointNodeId(newValue: string) {
      if (newValue || this.stateTopo.currentNode.isReal) {
        this.showInfo = true;
      } else {
        this.showInfo = false;
        this.showInfoCount = 0;
        this.isMini = true;
      }
    }

    @Watch('stateTopo.currentNode.name')
    private watchCurrentNodeIsReal(newValue: boolean) {
      const service = this.stateTopo.currentNode;
      if (this.stateTopo.currentNode.isReal) {
        this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 1 });
        this.GET_TOPO_SERVICE_DETAIL({
          serviceId: service.id || '',
          duration: this.durationTime,
        });
      }
      if (newValue || this.stateTopo.selectedServiceCall) {
        this.showInfo = true;
      } else {
        this.showInfo = false;
        this.showInfoCount = 0;
        this.isMini = true;
      }
    }
  }
</script>
<style lang="scss">
  .link-topo-aside-box-btn {
    color: #626977;
    border: 1px solid;
    padding: 0px 3px;
    width: 45px;
    display: inline-block;

    &.active {
      color: #448dfe;
    }
  }

  .show-dependency {
    margin-top: 20px;

    .rk-btn {
      display: block;
      text-align: center;
    }

    .instance-dependency {
      .rk-sidebox {
        background: #2b3037;
        outline: none;
      }
      .rk-sidebox-inner {
        height: 100%;
      }
    }

    .title-name {
      width: 100%;
      padding-left: 40px;
      font-size: 16px;
    }
  }

  .link-topo-aside-box {
    border-radius: 4px;
    position: absolute;
    width: 280px;
    z-index: 101;
    color: #ddd;
    background-color: #2b3037;
    padding: 15px 20px 10px;

    .label {
      display: inline-block;
      width: 40%;
    }

    .content {
      vertical-align: top;
      display: inline-block;
      width: 60%;
    }

    .circle {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: #ee5b5b;
      margin-top: 6px;
    }
  }

  .link-topo-aside-box {
    p {
      margin-block-start: auto !important;
      margin-block-end: auto !important;
    }
  }
</style>
