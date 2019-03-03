<template>
<rk-panel class="rk-service-slow clear" :title="title">
  <div class="mb-15" v-for="i in fiveData" :key="i.key">
    <div class="mb-5 ell" v-tooltip:top.ellipsis="i.label || ''">
      <span class="calls sm mr-10">{{i.value}} cpm</span>
      <span class="cp link-hover" @click="appChange(i)">{{i.label}}</span>
    </div>
    <RkProgress :precent="i.value/maxValue*100"/>
  </div>
</rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RkTopThroughput extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @State('rocketDashboard') private stateDashboard!: any;
  private appChange(i: any) {
    const temp = { key: `${i.key}`, label: i.label };
  }
  get typeArr() {
    return this.type.split('.');
  }
  get fiveData() {
    return this.stateDashboard[this.typeArr[0]][this.typeArr[1]].length < 11
    ?
    this.stateDashboard[this.typeArr[0]][this.typeArr[1]]
    :
    this.stateDashboard[this.typeArr[0]][this.typeArr[1]].splice(0, 10);
  }
  get maxValue() {
    const temp: number[] = this.fiveData.map((i: any) => i.duration);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
.rk-service-slow{
  .calls{
    padding: 0 5px;
    display: inline-block;
    background-color: #40454e;
    color: #eee;
    border-radius: 4px;
  }
}
</style>
