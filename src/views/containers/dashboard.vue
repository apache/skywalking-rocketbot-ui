<template>
<div>
  <RkBoard :stateOptions="stateOptions" @showServer="getServerDetail"/>
  <div class="rk-dashboard">
    <div class="child-one-third clear">
      <div class="l mr10">
        <NumBox title="Endpoint Avg Response Time" :content="(responseTime?responseTime:0).toFixed(2)" unit="ms"/>
        <ChartResponseP/>
      </div>
      <div class="l mr10">
        <NumBox title="Endpoint Avg Throughput" :content="(throughput?throughput:0).toFixed(2)" unit="cpm"/>
        <ChartThroughput/>
      </div>
      <div class="l">
        <NumBox title="Avg SLA" :content="(sla?sla/100:0).toFixed(2)" unit="%"/>
        <ChartSla/>
      </div>
    </div>
    <div class="child-one-third clear">
      <ChartResponse class="l mr10"/>
      <TopSlow class="l" style="width:66%;"/>
    </div>
    <div class="child-one-third clear">
      <TopThroughput class="l mr10"/>
      <SlowService class="l mr10"/>
      <SlowAppService class="l"/>
    </div>
  </div>
  <rk-sidebox title="Server" :notice="`${stateOptions.currentServer? stateOptions.currentServer.name: ''}`" :show.sync='show'>
    <div class="flex">
      <NumBox class="mr10" title="Service Avg Throughput" :content="(serverThroughput?serverThroughput:0).toFixed(2)" unit="cpm"/>
      <NumBox class="mr10" title="Service Avg Response Time" :content="(serverResponseTime?serverResponseTime:0).toFixed(2)" unit="ms"/>
    </div>
    <div class="flex">
      <ChartHeap class="mr10"/>
      <ChartNonHeap/>
    </div>
    <div class="flex">
      <ChartCpu class="mr10"/>
      <ChartGc/>
    </div>
    <ServerThroughput/>
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
import ChartResponseP from '../components/dashboard/chart-response-p.vue';
import ChartSla from '../components/dashboard/chart-sla.vue';
import ChartHeap from '../components/dashboard/chart-heap.vue';
import ChartNonHeap from '../components/dashboard/chart-nonheap.vue';
import ChartCpu from '../components/dashboard/chart-cpu.vue';
import ChartGc from '../components/dashboard/chart-gc.vue';
import NumBox from '../components/dashboard/num-box.vue';
import TopThroughput from '../components/dashboard/top-throughput.vue';
import SlowService from '../components/dashboard/slow-service.vue';
import SlowAppService from '../components/dashboard/slow-app-service.vue';
import TopSlow from '../components/dashboard/top-slow.vue';
import ServerThroughput from '../components/dashboard/server-throughput.vue';

@Component({
  components: {
    NumBox,
    ChartThroughput,
    ChartResponse,
    ChartResponseP,
    ChartSla,
    TopSlow,
    SlowService,
    TopThroughput,
    ChartHeap,
    ChartNonHeap,
    ChartCpu,
    ChartGc,
    SlowAppService,
    ServerThroughput,
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
    this.$store.dispatch('options/GET_ENDPOINTS', this.stateOptions.currentApplication.key)
      .then(() => {
        if (this.stateOptions.endpoints.length !== 0) {
          this.$store.dispatch('dashboard/GET_ENDPOINT_INFO', {
            applicationId: this.stateOptions.currentApplication.key,
            endpoint: this.stateOptions.currentEndpoint,
          });
        }
      });
    this.$store.dispatch('options/GET_SERVERS', this.stateOptions.currentApplication.key)
      .then(() => {
        if (this.stateOptions.servers.length !== 0) {
          this.$store.dispatch('dashboard/GET_SERVER_INFO', this.stateOptions.currentServer.key);
        }
      });
    this.$store.dispatch('dashboard/GET_APPLICATION_INFO');
  }
  getServerDetail() {
    this.$store.dispatch('dashboard/GET_SERVER_DETAIL', this.stateOptions.currentServer.key)
      .then(() => {
        this.show = true;
      });
  }
  getData() {
    this.$store.dispatch('options/GET_APPLICATIONS').then(() => {
      this.$store.commit('options/SET_APPLICATION', this.stateOptions.applications[0]);
      this.$store.dispatch('options/GET_ENDPOINTS', this.stateOptions.currentApplication.key)
        .then(() => {
          if (this.stateOptions.endpoints.length !== 0) {
            this.$store.commit('options/SET_ENDPOINT', this.stateOptions.endpoints[0]);
            this.$store.dispatch('dashboard/GET_ENDPOINT_INFO', {
              applicationId: this.stateOptions.currentApplication.key,
              endpoint: this.stateOptions.currentEndpoint,
            });
          }
        });
      this.$store.dispatch('options/GET_SERVERS', this.stateOptions.currentApplication.key)
        .then(() => {
          if (this.stateOptions.servers.length !== 0) {
            this.$store.commit('options/SET_SERVER', this.stateOptions.servers[0]);
            this.$store.dispatch('dashboard/GET_SERVER_INFO', this.stateOptions.currentServer.key);
          }
        });
      this.$store.dispatch('dashboard/GET_APPLICATION_INFO');
    });
  }
}
</script>

<style lang="scss">
.rk-dashboard {
  padding: 15px;
  overflow: auto;
  .child-one-third{
    .l{
      width: calc(33.33% - 6.66px);
    }
  }
}
</style>
