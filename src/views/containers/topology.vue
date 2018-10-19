<template>
  <div class="topology">
    <TopoChart :datas="stateTopo" @setCurrentApp="setCurrentApp"/>
    <div class="topology-select">
    </div>
    <div class="topology-board" v-if="this.current.id">
      <div class="mb10" v-for="(value,key) in current" :key="key"><span class="half">{{key}}:</span><span class="half">{{value}}</span></div>
    </div>
    <div class="topology-board" v-else>
      <div class="mb10"><span class="half">Application</span><span class="half">{{stateTopo.cluster.numOfApplication}}</span></div>
      <div class="mb10"><span class="half">DB & Cache</span><span class="half">{{stateTopo.cluster.numOfDatabase + stateTopo.cluster.numOfCache}}</span></div>
      <div class="mb10"><span class="half">Service</span><span class="half">{{stateTopo.cluster.numOfService}}</span></div>
      <div class="mb10"><span class="half">MQ</span><span class="half">{{stateTopo.cluster.numOfMQ}}</span></div>
    </div>
    <div v-clickout="() => this.show = false">
      <div class="topology-setting-btn" @click="show = true">
        <ion-icon name="settings"></ion-icon>
      </div>
      <div @click="routerGo" class="topology-setting-btn" v-if="this.current.avgResponseTime | this.current.cpm | this.current.sla" style="top:135px">
        <ion-icon name="cube"></ion-icon>
      </div>
      <TopoTool :stateTopo="stateTopo" :stateOptions="stateOptions" :show.sync="show" :propsTime="stateGlobal.duration"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import TopoTool from '@/components/rk-tool-topology.vue';
import { getTopo } from '@/store/dispatch/topo.ts';
import TopoChart from '../components/topology/topo.vue';
@Component({ components: { TopoChart, TopoTool } })
export default class Topology extends Vue {
  @State('options') stateOptions;
  @State('topo') stateTopo;
  @State('global') stateGlobal;
  current = {
    id: '',
    name: '',
  };
  show = false;
  beforeMount() {
    this.$store.dispatch('SET_EVENTS', [this.getCluster, getTopo]);
    getTopo();
    this.getCluster();
  }
  setCurrentApp(i) {
    this.current = i;
  }
  getCluster() {
    this.$store.dispatch('options/GET_APPLICATIONS');
    this.$store.dispatch('topo/GET_CLUSTER');
  }
  routerGo() {
    this.$store.commit('options/SET_APPLICATION', { key: this.current.id, label: this.current.name });
    this.$router.push('/');
  }
}
</script>

<style lang="scss">
.topology{
  background-color: #30313b;
}
.topology > svg {
  display: block;
}
.topology-board{
  position: absolute;
  top: 75px;
  right: 30px;
  padding: 10px 15px 0;
  width: 300px;
  border-radius: 6px;
  color: #e3e3e3;
  background-color: rgba(75, 78, 85, 0.6)
}
.topology-setting-btn {
  cursor: pointer;
  position:absolute;
  top:80px;
  left:30px;
  height: 36px;
  width: 36px;
  text-align: center;
  line-height: 42px;
  color: #fff;
  font-size:18px;
  background-color: #3880ff;
  border-radius: 50%;
  transition: background-color .3s;
  &:hover{
    background-color: #6493f0;
  }
}
</style>
