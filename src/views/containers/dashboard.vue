<template>
<div>
  <RkBoard :stateOptions="stateOptions"/>
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
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import echarts from 'echarts';
import { State } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import ChartThroughput from '../components/dashboard/chart-throughput.vue';
import ChartResponse from '../components/dashboard/chart-response.vue';
import ChartSla from '../components/dashboard/chart-sla.vue';
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
  },
})

export default class Dashboard extends Vue {
  @State('dashboard') stateDashboard;
  @State('options') stateOptions;
  @State('global') stateGlobal;
  get throughput() {
    if (!this.stateDashboard.throughput.length) return 0;
    return this.stateDashboard.throughput.reduce((prev, curr) => prev + curr) / this.stateDashboard.throughput.length;
  }
  get responseTime() {
    if (!this.stateDashboard.responseTime.length) return 0;
    return this.stateDashboard.responseTime.reduce((prev, curr) => prev + curr) / this.stateDashboard.responseTime.length;
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
  getData() {
    this.$store.dispatch('options/GET_APPLICATIONS').then(() => {
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
