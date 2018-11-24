<template>
<rk-panel title="Global Slow Endpoints">
  <div class="mb15" v-for="i in fiveData" :key="i.key">
    <div>
      <span  style="width:60px" class="r sm">{{i.value}} ms</span>
      <div style="width:calc(100% - 65px)" class="mb5">
        <Tooltip :content="i.service? i.service.label :i.label" max-width="200"  placement="top" class="ell" style="max-width: 100%;">
          <span class="cp link-hover" @click="changeEndpoint(i)">{{i.service? i.service.label :i.label}}</span>
        </Tooltip>
      </div>
    </div>
    <RkProgress :precent="i.value/maxValue*100"/>
  </div>
</rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import { serviceAppChange } from '@/store/dispatch/dashboard.ts';
import { searchApp } from '@/api/dashboard.ts';

@Component({})
export default class RkChartBox extends Vue {
  @State('dashboard') stateDashboard;
  @State('options') stateOptions;
  serviceAppChange = serviceAppChange;
  get fiveData() {
    return this.stateDashboard.slowService.splice(0, 4);
  }
  get maxValue() {
    const temp:Number[] = this.fiveData.map(i => i.value);
    return Math.max.apply(null, temp);
  }
  changeEndpoint(i) {
    if (window.localStorage.getItem('version') === '6') {
      searchApp(i.key).then((res) => {
        const app = this.stateOptions.applications.filter(item => item.key === res.data.data.endpointInfo.serviceId)[0];
        const endpoint = { key: res.data.data.endpointInfo.key, label: res.data.data.endpointInfo.label };
        this.serviceAppChange({ app, endpoint });
      });
      return;
    }
    const app = this.stateOptions.applications.filter(item => item.key === i.service.applicationId)[0];
    const endpoint = { key: i.service.key, label: i.service.label };
    this.serviceAppChange({ app, endpoint });
  }
}
</script>
<style lang="scss">
</style>
