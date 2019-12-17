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
  <div v-if="stateTopo.selectedServiceCall || showServerInfo"
           :class="`link-topo-aside-box link-topo-aside-box-${isMini?'min':'max'}`"
           :style="`top:80px;position: fixed;right: 30px;${showInfoCount === 0 ? 'animation: unset;': ''}`">
        <svg
            :style="`position:absolute;left:-48px;top:0;transform: rotate(${isMini?0 : 180}deg);`"
            class="link-topo-aside-btn icon cp lg"
            @click="setShowInfo"
        >
          <use xlink:href="#chevron-left"/>
        </svg>
        <div class="mb-5 clear">
          <span v-if="stateTopo.selectedServiceCall" class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
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
                v-if="rocketDashboard.serviceResponseTime.ResponseTime.length"
                :data="rocketDashboard.serviceResponseTime.ResponseTime"
                :intervalTime="intervalTime"
                title="Service ResponseTime"
                unit="ms"
            />
            <TopoChart
                v-if="rocketDashboard.serviceThroughput.Throughput.length"
                :data="rocketDashboard.serviceThroughput.Throughput"
                :intervalTime="intervalTime"
                title="Service Throughput"
                unit="cpm"
            />
            <ChartResponse
                v-if="rocketDashboard.servicePercent.p50.length"
                :data="rocketDashboard.servicePercent"
                :intervalTime="intervalTime"
                title="Service Response Time Percentile"
                unit="ms"
            />
          </div>
        </div>
        <div class="show-dependency" v-if="stateTopo.selectedServiceCall">
          <a class="rk-btn lg" @click="dialogTopoVisible=true">{{$t('ShowInstanceDependency')}}</a>
          <el-dialog
            class="instance-dependency" 
            :width="'90%'"
            :title="`${stateTopo.selectedServiceCall.source.name} -> ${stateTopo.selectedServiceCall.target.name} Instance Dependency`"
            :visible.sync="dialogTopoVisible"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :destroy-on-close="true"
            :close="clearInstance"
          >
            <TopoInstanceDependency />
          </el-dialog>
        </div>
      </div>
</template>
<script lang="ts">

  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import topo, { State as topoState } from '@/store/modules/topology';
  import TopoInstanceDependency from './topo-instance-dependency.vue';
  import TopoChart from './topo-chart.vue';
  import ChartResponse from './topo-response.vue';

  @Component({
    components: {
      TopoInstanceDependency, ChartResponse, TopoChart,
    },
  })
  export default class TopoDetectPoint extends Vue {
    @State('rocketTopo') private stateTopo!: topoState;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT') private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @Mutation('rocketTopo/SET_MODE_STATUS') private SET_MODE_STATUS: any;
    @State('rocketDashboard') private rocketDashboard: any;
    @Mutation('rocketTopo/SET_SELECTED_INSTANCE_CALL') private SET_SELECTED_INSTANCE_CALL: any;
    @Mutation('rocketTopo/SET_INSTANCE_DEPENDENCY') private SET_INSTANCE_DEPENDENCY: any;

    private isMini: boolean = true;
    private showInfoCount: number = 0;
    private showInfo: boolean = false;
    private dialogTopoVisible = false;

    private get showServerInfo() {
      return this.stateTopo.currentNode.name && this.stateTopo.currentNode.isReal;
    }

    @Watch('stateTopo.selectedServiceCall')
    private watchDetectPointNodeId(newValue: string) {
      if (newValue || this.stateTopo.currentNode.isReal) {
        this.showInfo = true;
      } else {
        this.showInfo = false;
        this.isMini = true;
      }
    }

    @Watch('stateTopo.currentNode.name')
    private watchCurrentNodeIsReal(newValue: boolean) {
      const service = this.stateTopo.currentNode;
      if (this.stateTopo.currentNode.isReal) {
        this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({index: 0, current: 1});
        this.MIXHANDLE_GET_OPTION({compType: 'service', duration: this.durationTime})
          .then(() => {
            this.GET_QUERY({
              serviceId: service.id || '',
              duration: this.durationTime,
            });
          });
      }
      if (newValue || this.stateTopo.selectedServiceCall) {
        this.showInfo = true;
      } else {
        this.showInfo = false;
        this.isMini = true;
      }
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
      this.SET_SELECTED_INSTANCE_CALL(null);
      this.SET_INSTANCE_DEPENDENCY({
        nodes: [],
        calls: [],
      });
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
    margin: 20px 0;
    .rk-btn {
      display: block;
      text-align: center;
    }
    .el-dialog__header{
      background: #333;
      .el-dialog__title{
        color: #efeff1;
      }
    }
    .el-dialog__body{
      background: #333;
      color: #efeff1;
      height: 650px;
      padding: 10px 20px;
    }
  }
  .link-topo-aside-box {
    border-radius: 4px;
    position: absolute;
    width: 280px;
    z-index: 101;
    color: #ddd;
    background-color: #333;
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
      background-color: #EE5B5B;
      margin-top: 6px;
    }
  }

  .link-topo-aside-box {
    p {
      margin-block-start: auto !important;
      margin-block-end: auto !important;
    }
  }

  // .link-topo-aside-box-min {
  //   width: 280px;
  //   animation: 0.5s linkTopoAsideBoxMin 1 running;
  // }

  // .link-topo-aside-box-max {
  //   width: 60%;
  //   animation: 0.5s linkTopoAsideBoxMax 1 running;
  // }

  // @keyframes linkTopoAsideBoxMax {
  //   from {
  //     width: 280px;
  //   }
  //   to {
  //     width: 60%;
  //   }
  // }

  // @keyframes linkTopoAsideBoxMin {
  //   from {
  //     width: 60%;
  //   }
  //   to {
  //     width: 280px;
  //   }
  // }
</style>