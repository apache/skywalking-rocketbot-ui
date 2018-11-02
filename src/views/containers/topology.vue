<template>
  <div class="topology">
    <TopoChart :datas="stateTopo" @setCurrentApp="setCurrentApp"/>
    <div class="topology-select">
    </div>
    <div class="topology-board" v-if="this.current.id" v-show="open">
      <div class="mb10" v-for="(value,key) in current" :key="key"><span class="half">{{key}}:</span><span class="half">{{value}}</span></div>
    </div>
    <div class="topology-board" v-else  v-show="open">
      <div class="mb10"><span class="half">Application</span><span class="half">{{stateTopo.cluster.numOfApplication}}</span></div>
      <div class="mb10"><span class="half">DB & Cache</span><span class="half">{{stateTopo.cluster.numOfDatabase + stateTopo.cluster.numOfCache}}</span></div>
      <div class="mb10"><span class="half">Service</span><span class="half">{{stateTopo.cluster.numOfService}}</span></div>
      <div class="mb10"><span class="half">MQ</span><span class="half">{{stateTopo.cluster.numOfMQ}}</span></div>
    </div>
    <div v-clickout="() => this.show = false" >
      <div class="topology-setting-btn" @click="open = !open" :style="`right:${open?345:25}px`">
        <Icon :type="open?'ios-arrow-forward':'ios-arrow-back'" style="vertical-align: initial;"/>
      </div>
      <div class="topology-setting-btn" @click="show = true" style="top:75px" :style="`right:${open?345:25}px`">
        <Icon type="md-settings" style="vertical-align: initial;"/>
      </div>
      <div @click="routerGo" class="topology-setting-btn" :style="`right:${open?345:25}px`" v-if="this.current.avgResponseTime | this.current.cpm | this.current.sla" style="top:125px">
        <Icon type="md-cube" style="vertical-align: initial;"/>
      </div>
      <TopoTool :stateTopo="stateTopo" :stateOptions="stateOptions" :show.sync="show" :propsTime="stateGlobal.duration"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import TopoTool from '@/components/rk-tool-topology.vue';
import { getTopo } from '@/store/dispatch/topo.ts';
import TopoChart from '../components/topology/topo.vue';
@Component({ components: { TopoChart, TopoTool } })
export default class Topology extends Vue {
  @State('options') stateOptions;
  @State('topo') stateTopo;
  @State('global') stateGlobal;
  @Action('SET_EVENTS') SET_EVENTS;
  @Action('options/GET_APPLICATIONS') GET_APPLICATIONS;
  @Action('topo/GET_CLUSTER') GET_CLUSTER;
  @Action('topo/CLEAR_TOPO') CLEAR_TOPO;
  @Action('options/SET_APPLICATION') SET_APPLICATION;
  current = {
    id: '',
    name: '',
  };
  open = true;
  show = false;
  beforeMount() {
    this.SET_EVENTS([this.getCluster, getTopo]);
    getTopo();
    this.getCluster();
  }
  beforeDestroy() {
    this.CLEAR_TOPO();
  }
  setCurrentApp(i) {
    this.current = i;
  }
  getCluster() {
    this.GET_APPLICATIONS();
    this.GET_CLUSTER();
  }
  routerGo() {
    this.$store.commit('options/SET_APPLICATION', { key: this.current.id, label: this.current.name });
    this.$router.push('/');
  }
}
</script>

<style lang="scss">
.topology{
  background-color: #2e303a;
  position: relative;
}
.topology > svg {
  display: block;
}
.topology-board{
  position: absolute;
  top: 25px;
  right: 30px;
  padding: 10px 15px 0;
  width: 300px;
  border-radius: 6px;
  color: #e3e3e3;
  background-color: rgba(75, 78, 85, 0.6);
  box-shadow: 0 3px 10px -2px rgba(0, 0, 0, .1);
}
.topology-setting-btn {
  cursor: pointer;
  position:absolute;
  top:25px;
  height: 36px;
  width: 36px;
  text-align: center;
  line-height: 42px;
  color: #fff;
  font-size:18px;
  background-color: rgba(75, 78, 85, 0.6);
  border-radius: 6px;
  transition: background-color .3s;
  box-shadow: 0 3px 10px -2px rgba(0, 0, 0, .1);
  &:hover{
    background-color: #3880ff;
  }
}
</style>
