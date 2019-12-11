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
  <aside class="link-topo-aside">
    <Radial v-if="radioStatus" :datas="{nodes:stateTopo.nodes,calls:stateTopo.calls}"/>
    <svg class="link-topo-aside-btn icon cp lg" @click="showRadial()" :style="`position:absolute;left:290px;`">
      <use xlink:href="#issues"/>
    </svg>
    <svg v-if="showServerInfo" class="link-topo-aside-btn icon cp lg"
      @click="show = !show"
      :style="`position:absolute;left:290px;transform: rotate(${show?0 : 180}deg);top:50px;`">
      <use xlink:href="#chevron-left"/>
    </svg>
    <TopoService/>
    <div v-if="show">
      <div class="link-topo-aside-box" style="top:50px" v-if="!stateTopo.selectedCallId && showServerInfo">
        <div class="mb-20">
          <span class="b dib mr-20">{{$t('serviceDetail')}}</span>
        </div>
        <div class="mb-10">
          <span class="label grey">{{$t('name')}}</span>
          <span class="content">{{stateTopo.currentNode.name}}</span>
        </div>
        <div class="mb-10">
          <span class="label grey">{{$t('type')}}</span>
          <span class="content">{{stateTopo.currentNode.type}}</span>
        </div>
        <div>
          <TopoChart
            v-if="rocketDashboard.serviceApdexScore.ApdexScore.length"
            :data="rocketDashboard.serviceApdexScore.ApdexScore"
            :intervalTime="intervalTime"
            title="Service ApdexScore"
            unit=""
          />
          <TopoChart
            v-if="rocketDashboard.serviceSLA.SLA.length"
            :data="rocketDashboard.serviceSLA.SLA"
            :intervalTime="intervalTime"
            :precent="true"
            title="Service SLA"
            unit="%"
          />
        </div>
      </div>
      <TopoDetectPoint />
    </div>
    <el-drawer
        v-if="stateTopo.showAlarmDialog"
        custom-class="performance-metrics-window"
        size="75%"
        destroy-on-close
        :visible.sync="stateTopo.showAlarmDialog"
        :modal-append-to-body="false"
    >
      <alarm-containers :style="`height: ${drawerMainBodyHeight}`"
        :alarmScope="{label: 'Service', key: 'Service'}"
        inTopo
        :keyword="stateTopo.honeycombNode.name"
      />
    </el-drawer>
    <el-drawer
        custom-class="performance-metrics-window"
        v-if="stateTopo.showTraceDialog"
        size="75%"
        destroy-on-close
        :visible.sync="stateTopo.showTraceDialog"
        :modal-append-to-body="false"
    >
      <trace-containers :style="`height: ${drawerMainBodyHeight}`"
        :service="{label: stateTopo.honeycombNode.name, key: stateTopo.honeycombNode.id}"
        inTopo
      />
    </el-drawer>
    <instances-survey-window
      v-if="stateTopo.showInstancesDialog"
      :is-show.sync="stateTopo.showInstancesDialog"
      :instances="stateDashboardOption.instances"
    />
    <endpoint-survey-window
      v-if="stateTopo.showEndpointDialog"
      :is-show.sync="stateTopo.showEndpointDialog"
      :endpoints="stateDashboardOption.endpoints"
    />
  </aside>
</template>
<script lang="ts">
  import { initState } from '@/store/modules/dashboard/modules/dashboard-data-layout';
  import topo, { State as topoState } from '@/store/modules/topology';
  import AlarmContainers from '@/views/containers/alarm.vue';
  import EndpointSurveyWindow from '@/views/containers/endpoint-survey-window.vue';
  import InstancesSurveyWindow from '@/views/containers/instances-survey-window.vue';
  import TraceContainers from '@/views/containers/trace.vue';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import Radial from './radial.vue';
  import TopoChart from './topo-chart.vue';
  import ChartResponse from './topo-response.vue';
  import TopoService from './topo-services.vue';
  import TopoInstanceDependency from './topo-instance-dependency.vue';
  import TopoDetectPoint from './topo-detect-point.vue';

  @Component({
    components: {
      TopoChart, TopoService, ChartResponse, Radial, AlarmContainers,
      TraceContainers, InstancesSurveyWindow, EndpointSurveyWindow,
      TopoInstanceDependency, TopoDetectPoint,
    },
  })
  export default class TopoAside extends Vue {
    @State('rocketTopo') private stateTopo!: topoState;
    @State('rocketOption') private stateDashboardOption!: any;
    @Getter('intervalTime') private intervalTime: any;
    @Getter('durationTime') private durationTime: any;
    @Action('rocketTopo/GET_TOPO') private GET_TOPO: any;
    @Action('rocketTopo/CLEAR_TOPO') private CLEAR_TOPO: any;
    @Action('SELECT_SERVICE') private SELECT_SERVICE: any;
    @Mutation('rocketTopo/SET_MODE_STATUS') private SET_MODE_STATUS: any;
    @Action('rocketTopo/CLEAR_TOPO_INFO') private CLEAR_TOPO_INFO: any;
    @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @State('rocketDashboard') private rocketDashboard: any;

    private dialogTopoVisible = false;
    private drawerMainBodyHeight = '100%';
    private initState = initState;
    private radioStatus: boolean = false;
    private show: boolean = true;

    private get showServerInfo() {
      return this.stateTopo.currentNode.name && this.stateTopo.currentNode.isReal;
    }

    private resize() {
      this.drawerMainBodyHeight = `${document.body.clientHeight - 50}px`;
    }

    private created() {
      this.SET_EVENTS([]);
      this.SET_COMPS_TREE(this.initState.tree);
    }

    private mounted() {
      this.resize();
      window.addEventListener('resize', this.resize);
    }

    private getTopo() {
      this.GET_TOPO({duration: this.durationTime});
    }

    private beforeDestroy() {
      window.removeEventListener('resize', this.resize);
      this.CLEAR_TOPO_INFO();
      this.CLEAR_TOPO();
      this.$store.unregisterModule('rocketTopo');
    }

    get types() {
      const result: any = {};
      this.stateTopo.nodes.forEach((i: any) => {
        if (result[i.type]) {
          result[i.type] += 1;
        } else {
          result[i.type] = 1;
        }
      });
      return result;
    }

    @Watch('durationTime')
    private watchDurationTime() {
      this.getTopo();
    }

    private showRadial() {
      this.radioStatus = !this.radioStatus;
    }
  }
</script>
<style lang="scss">
  .link-topo-aside {
    width: 280px;
    position: absolute;
    z-index: 2;
    left: 20px;
    top: 30px;

    .to-apm {
      padding-top: 10px;
      border-top: 1px solid #d8d8d866;
    }
  }

  .link-topo-aside-btn {
    display: block;
    background: #252a2f9a;
    color: #ddd;
    border-radius: 4px 4px 4px 4px;
    text-align: center;
    padding: 10px;
    z-index: 101;
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

  .link-topo-aside-box-min {
    width: 280px;
    animation: 0.5s linkTopoAsideBoxMin 1 running;
  }

  .link-topo-aside-box-max {
    width: 60%;
    animation: 0.5s linkTopoAsideBoxMax 1 running;
  }

  .performance-metrics-window {
    .el-drawer__header {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      color: #72767b;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin-bottom: 22px;
      padding: unset;
    }
  }

  @keyframes linkTopoAsideBoxMax {
    from {
      width: 280px;
    }
    to {
      width: 60%;
    }
  }

  @keyframes linkTopoAsideBoxMin {
    from {
      width: 60%;
    }
    to {
      width: 280px;
    }
  }
</style>
