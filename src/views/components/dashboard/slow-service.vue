<template>
<rk-panel title="Slow Service">
  <div class="mb15" v-for="i in fiveData" :key="i.key">
    <div>
      <span class="r sm">{{i.value}} ms</span>
      <div class="mb5 cp link-hover" @click="changeService(i)" >
        <Tooltip :content="i.service.label" max-width="200"  placement="top" class="ell" style="max-width: 200px;">
          <span>{{i.service.label}}</span>
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

@Component({})
export default class RkChartBox extends Vue {
  @State('dashboard') stateDashboard;
  @State('options') stateOptions;
  serviceAppChange = serviceAppChange;
  get fiveData() {
    return this.stateDashboard.slowService.splice(0, 5);
  }
  get maxValue() {
    const temp:Number[] = this.fiveData.map(i => i.value);
    return Math.max.apply(null, temp);
  }
  changeService(i) {
    const app = this.stateOptions.applications.filter(item => item.key === i.service.applicationId)[0];
    const service = { key: i.service.key, label: i.service.label };
    this.serviceAppChange({ app, service });
  }
}
</script>
<style lang="scss">
</style>
