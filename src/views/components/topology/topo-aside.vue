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
      <use xlink:href="#issues"></use>
    </svg>
    <svg class="link-topo-aside-btn icon cp lg" @click="show = !show" :style="`position:absolute;left:290px;transform: rotate(${show?0 : 180}deg);top:50px;`">
      <use xlink:href="#chevron-left"></use>
    </svg>
    <TopoService/>
    <div class="link-topo-aside-box" style="top:50px" v-if="!stateTopo.currentNode.name && show">
      <div class="mb-20">
        <span class="b dib mr-20">{{$t('allServices')}}</span>
      </div>
      <div class="mb-10" v-for="(val, key, index) in types" :key="index">
        <span class="r">{{val}}</span>
        <span class="grey">{{key}}</span>
      </div>
    </div>
    <div class="link-topo-aside-box" style="top:50px" v-else-if="show">
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
      <div class="mb-10" v-if="stateTopo.currentNode.cpm">
        <span class="label grey">{{$t('cpm')}}</span>
        <span class="content">{{stateTopo.currentNode.cpm}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.sla">
        <span class="label grey">{{$t('sla')}}</span>
        <span class="content">{{stateTopo.currentNode.sla || ''}}%</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.latency">
        <span class="label grey">{{$t('latency')}}</span>
        <span class="content">{{stateTopo.currentNode.latency}} ms</span>
      </div>
    </div>
    <div :class="`link-topo-aside-box link-topo-aside-box-${isMini?'min':'max'}`"
         :style="`top:80px;position: fixed;right: 30px;${showInfoCount === 0 ? 'animation: unset;': ''}`">
      <svg v-if="stateTopo.selectedCallId"
           :style="`position:absolute;left:-48px;top:0;transform: rotate(${isMini?0 : 180}deg);`"
           class="link-topo-aside-btn icon cp lg"
           @click="setShowInfo"
      >
        <use xlink:href="#chevron-left" />
      </svg>
      <div class="mb-5 clear">
        <span class="b dib mr-20 vm">{{ $t('detectPoint') }}</span>
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
    </div>
    <el-drawer
        title="Alarm"
        size="75%"
        destroy-on-close
        :visible.sync="stateTopo.showAlarmDialog"
    >
      <alarm-containers :style="`height: ${drawerMainBodyHeight}`"
                        :alarmScope="{label: 'Service', key: 'Service'}"
                        isDrawer
                        :keyword="stateTopo.honeycombNode.name"
      ></alarm-containers>
    </el-drawer>
    <el-drawer
        title="Trace"
        size="75%"
        destroy-on-close
        :visible.sync="stateTopo.showTraceDialog"
    >
      <trace-containers :style="`height: ${drawerMainBodyHeight}`"
                        :service="{label: stateTopo.honeycombNode.name, key: stateTopo.honeycombNode.id}"
                        inTopo
      ></trace-containers>
    </el-drawer>
    <el-drawer
        title="Instances"
        size="75%"
        destroy-on-close
        :visible.sync="stateTopo.showInstancesDialog"
    ></el-drawer>
    <el-drawer
        title="Endpoints"
        size="75%"
        destroy-on-close
        :visible.sync="stateTopo.showEndpointDialog"
    ></el-drawer>
  </aside>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import topo, { State as topoState} from '@/store/modules/topology';
import { State, Mutation, Getter, Action } from 'vuex-class';
import TopoChart from './topo-chart.vue';
import TopoService from './topo-services.vue';
import ChartResponse from './topo-response.vue';
import Radial from './radial.vue';
import AlarmContainers from '@/views/containers/alarm.vue';
import TraceContainers from '@/views/containers/trace.vue';

@Component({components: {TopoChart, TopoService, ChartResponse, Radial, AlarmContainers, TraceContainers}})
export default class TopoAside extends Vue {
  @State('rocketTopo') public stateTopo!: topoState;
  @Getter('intervalTime') public intervalTime: any;
  @Mutation('rocketTopo/SET_MODE_STATUS') public SET_MODE_STATUS: any;
  @Action('rocketTopo/CLEAR_TOPO_INFO') public CLEAR_TOPO_INFO: any;

  private drawerMainBodyHeight = '100%';

  private resize() {
    this.drawerMainBodyHeight = `${document.body.clientHeight - 120}px`;
  }

  private mounted() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private beforeDestroy() {
    window.removeEventListener('resize', this.resize);
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
  private radioStatus: boolean = false;
  private show: boolean = true;
  private showInfo: boolean = false;
  private isMini: boolean = true;
  private showInfoCount: number = 0;
  @Watch('stateTopo.selectedCallId')
  private watchDetectPointNodeId(newValue: string) {
    if (newValue) {
      this.showInfo = true;
    } else {
      this.showInfo = false;
      this.isMini = true;
    }
  }
  private showRadial() {
    this.radioStatus = !this.radioStatus;
  }
  private setMode(mode: boolean) {
    this.SET_MODE_STATUS(mode);
    this.stateTopo.callback();
  }
  private setShowInfo() {
    this.showInfo = false;
    this.showInfoCount = 1;
    this.isMini = !this.isMini;
    setTimeout(() => {
      this.showInfo = true;
    }, 550);
  }
}
</script>
<style lang="scss">
.link-topo-aside{
  width: 280px;
  position: absolute;
  z-index: 2;
  left: 20px;
  top: 30px;
  .to-apm{
    padding-top: 10px;
    border-top: 1px solid #d8d8d866;
  }
}
.link-topo-aside-box-btn{
  color: #626977;
  border: 1px solid;
  padding: 0px 3px;
  width: 45px;
  display: inline-block;
  &.active{
    color: #448dfe;
  }
}
.link-topo-aside-btn{
  display:block;
  background: #252a2f9a;
  color: #ddd;
  border-radius: 4px 4px 4px 4px;
  text-align: center;
  padding: 10px;
  z-index: 101;
}
.link-topo-aside-box{
  border-radius: 4px;
  position: absolute;
  width: 280px;
  z-index: 101;
  color: #ddd;
  background-color: #252a2f9a;
  padding: 15px 20px 10px;
  .label{
    display: inline-block;
    width: 40%;
  }
  .content{
    vertical-align: top;
    display: inline-block;
    width: 60%;
  }
  .circle{
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
