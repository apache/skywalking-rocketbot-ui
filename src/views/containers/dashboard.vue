<template>
<div>
  <RkBoard :stateOptions="stateOptions" @showServer="getServerDetail"/>
  <div class="rk-dashboard">
    <div class="flex">
      <NumBox class="mr10" title="Avg Throughput" :content="throughput.toFixed(2)" unit="cpm"/>
      <NumBox class="mr10" title="Avg Response Time" :content="responseTime.toFixed(2)" unit="ms"/>
      <NumBox title="Avg SLA" :content="(sla/100).toFixed(2)" unit="%"/>
    </div>
    <div class="child-one-third clear">
      <ChartThroughput class="l mr10"/>
      <ChartResponse class="l mr10"/>
      <ChartSla class="l"/>
    </div>
    <div class="flex">
      <TopThroughput class="mr10"/><SlowService class="mr10"/><TopSlow/>
    </div>
  </div>
  <rk-sidebox title="Server" :notice="`${stateOptions.currentServer? stateOptions.currentServer.host: ''} ～ ${stateOptions.currentServer? stateOptions.currentServer.pid:''}@${stateOptions.currentServer? stateOptions.currentServer.ipv4[0]: ''}`" :show.sync='show'>
    <div class="flex">
      <NumBox class="mr10" title="Application Avg Throughput" :content="serverThroughput.toFixed(2)" unit="cpm"/>
      <NumBox class="mr10" title="Application Avg Response Time" :content="serverResponseTime.toFixed(2)" unit="ms"/>
    </div>
    <div class="flex">
      <ChartHeap class="mr10"/>
      <ChartNonHeap/>
    </div>
    <div class="flex">
      <ChartCpu class="mr10"/>
      <ChartGc/>
    </div>
  </rk-sidebox>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import echarts from 'echarts/lib/echarts';
import { State, Action } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import ChartThroughput from '../components/dashboard/chart-throughput.vue';
import ChartResponse from '../components/dashboard/chart-response.vue';
import ChartSla from '../components/dashboard/chart-sla.vue';
import ChartHeap from '../components/dashboard/chart-heap.vue';
import ChartNonHeap from '../components/dashboard/chart-nonheap.vue';
import ChartCpu from '../components/dashboard/chart-cpu.vue';
import ChartGc from '../components/dashboard/chart-gc.vue';
import NumBox from '../components/dashboard/num-box.vue';
import TopThroughput from '../components/dashboard/top-throughput.vue';
import SlowService from '../components/dashboard/slow-service.vue';
import TopSlow from '../components/dashboard/top-slow.vue';

@Component({
  components: {
    NumBox,
    ChartThroughput,
    ChartResponse,
    ChartSla,
    TopSlow,
    SlowService,
    TopThroughput,
    ChartHeap,
    ChartNonHeap,
    ChartCpu,
    ChartGc,
  },
})

export default class Dashboard extends Vue {
  @State('dashboard') stateDashboard;
  @State('options') stateOptions;
  @State('global') stateGlobal;
  @Action('dashboard/CLEAR_DASHBOARD') CLEAR_DASHBOARD;
  show = false;
  get throughput() {
    if (!this.stateDashboard.throughput.length) return 0;
    return this.stateDashboard.throughput.reduce((prev, curr) => prev + curr) / this.stateDashboard.throughput.length;
  }
  get serverThroughput() {
    if (!this.stateDashboard.serverThroughput.length) return 0;
    return this.stateDashboard.serverThroughput.reduce((prev, curr) => prev + curr) / this.stateDashboard.serverThroughput.length;
  }
  get responseTime() {
    if (!this.stateDashboard.responseTime.length) return 0;
    return this.stateDashboard.responseTime.reduce((prev, curr) => prev + curr) / this.stateDashboard.responseTime.length;
  }
  get serverResponseTime() {
    if (!this.stateDashboard.serverResponseTime.length) return 0;
    return this.stateDashboard.serverResponseTime.reduce((prev, curr) => prev + curr) / this.stateDashboard.serverResponseTime.length;
  }
  get sla() {
    if (!this.stateDashboard.sla.length) return 0;
    return this.stateDashboard.sla.reduce((prev, curr) => prev + curr) / this.stateDashboard.sla.length;
  }
  beforeMount() {
    this.getData();
  }
  mounted() {
    this.$store.dispatch('SET_EVENTS', [this.getDataReload]);
    echarts.connect(this.stateGlobal.chartStack);
  }
  beforeDestroy() {
    this.CLEAR_DASHBOARD();
  }
  getDataReload() {
    this.$store.dispatch('dashboard/GET_APPLICATION_INFO');
    this.$store.dispatch('options/GET_SERVICES', this.stateOptions.currentApplication.key)
      .then(() => {
        this.$store.dispatch('dashboard/GET_SERVICE_INFO', {
          applicationId: this.stateOptions.currentApplication.key,
          service: this.stateOptions.currentService,
        });
      });
    this.$store.dispatch('options/GET_SERVERS', this.stateOptions.currentApplication.key)
      .then(() => {
        this.$store.dispatch('dashboard/GET_SERVER_INFO', this.stateOptions.currentServer.key);
      });
  }
  getServerDetail() {
    this.$store.dispatch('dashboard/GET_SERVER_DETAIL', this.stateOptions.currentServer.key)
      .then(() => {
        this.show = true;
      });
  }
  getData() {
    this.$store.dispatch('options/GET_APPLICATIONS').then(() => {
      if (!this.stateOptions.currentServer.key) {
        this.$store.commit('options/SET_APPLICATION', this.stateOptions.applications[0]);
      }
      this.$store.dispatch('dashboard/GET_APPLICATION_INFO');
      this.$store.dispatch('options/GET_SERVICES', this.stateOptions.currentApplication.key)
        .then(() => {
          this.$store.dispatch('dashboard/GET_SERVICE_INFO', {
            applicationId: this.stateOptions.currentApplication.key,
            service: this.stateOptions.currentService,
          });
        });
      this.$store.dispatch('options/GET_SERVERS', this.stateOptions.currentApplication.key)
        .then(() => {
          if (this.stateOptions.currentServer) {
            this.$store.dispatch('dashboard/GET_SERVER_INFO', this.stateOptions.currentServer.key);
          }
        });
    });
  }
}
</script>

<style lang="scss">
.rk-dashboard {
  padding: 15px;
  .child-one-third{
    .l{
      width: calc(33.33% - 6.66px);
    }
  }
}
</style>
