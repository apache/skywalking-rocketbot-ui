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
    <svg class="link-topo-aside-btn mb-10 icon cp lg" @click="show = !show" :style="`position:${show?'absolute':'initial'};left:${show?290:0}px;transform: rotate(${show?0 : 180}deg);`">
      <use xlink:href="#chevron-left"></use>
    </svg>
    <TopoService/>
    <div class="link-topo-aside-box mb-10" v-if="!stateTopo.currentNode.name && show">
      <div class="mb-20">
        <span class="b dib mr-20">{{$t('allServices')}}</span>
      </div>
      <div class="mb-10" v-for="(val, key, index) in types" :key="index">
        <span class="r">{{val}}</span>
        <span class="grey">{{key}}</span>
      </div>
    </div>
    <div class="link-topo-aside-box mb-10" v-else-if="show">
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
    <div class="link-topo-aside-box" style="width:280px;top:78px;position: fixed;right: 30px;">
      <div class="mb-5 clear">
        <span class="b dib mr-20 vm">{{$t('detectPoint')}}</span>
        <span v-if="stateTopo.detectPoints.indexOf('CLIENT') !== -1" class="link-topo-aside-box-btn tc r sm cp b" :class="{'active':!stateTopo.mode}" @click="setMode(false)">{{this.$t('client')}}</span>
        <span v-if="stateTopo.detectPoints.indexOf('SERVER') !== -1" class="link-topo-aside-box-btn tc r sm cp b" :class="{'active':stateTopo.mode}" @click="setMode(true)">{{this.$t('server')}}</span>
      </div>
      <TopoChart v-if="stateTopo.getResponseTimeTrend.length" :title="$t('avgResponseTime')" unit="ms" :intervalTime="intervalTime" :data="stateTopo.getResponseTimeTrend"/>
      <TopoChart v-if="stateTopo.getThroughputTrend.length" :title="$t('avgThroughput')" unit="cpm" :intervalTime="intervalTime" :data="stateTopo.getThroughputTrend"/>
      <TopoChart v-if="stateTopo.getSLATrend.length" :title="$t('avgSLA')" unit="%" :intervalTime="intervalTime" :precent="true" :data="stateTopo.getSLATrend"/>
      <ChartResponse v-if="stateTopo.p50.length" :title="$t('percentResponse')" :intervalTime="intervalTime" :data="stateTopo"/>
    </div>
  </aside>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import topo, { State as topoState} from '@/store/modules/topology';
import { State, Mutation, Getter, Action } from 'vuex-class';
import TopoChart from './topo-chart.vue';
import TopoService from './topo-services.vue';
import ChartResponse from './topo-response.vue';

@Component({components: {TopoChart, TopoService, ChartResponse}})
export default class Topology extends Vue {
  @State('rocketTopo') public stateTopo!: topoState;
  @Getter('intervalTime') public intervalTime: any;
  @Mutation('rocketTopo/SET_MODE_STATUS') public SET_MODE_STATUS: any;
  @Action('rocketTopo/CLEAR_TOPO_INFO') public CLEAR_TOPO_INFO: any;
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
  private show: boolean = true;
  private showInfo: boolean = false;
  private setMode(mode: boolean) {
    this.SET_MODE_STATUS(mode);
    this.stateTopo.callback();
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
}
.link-topo-aside-box{
  border-radius: 4px;
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
</style>