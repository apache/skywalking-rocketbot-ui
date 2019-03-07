<template>
<rk-panel :title="title">
  <div class="rk-chart-slow clear scroll_hide" style="overflow:auto;">
    <div class="rk-chart-slow-i" v-for="(i, index) in stateDashboard[typeArr[0]][typeArr[1]]" :key="index">
      <div class="mb-5 ell" v-tooltip:top.ellipsis="i.label || ''">
        <span class="calls sm mr-10">{{i.value}} ms</span>
        <span class="cp link-hover"  @click="appChange(i)">{{i.label}}</span>
      </div>
      <RkProgress :precent="i.value/maxValue*100" color="#bf99f8"/>
    </div>
  </div>
</rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RkTopSlow extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
  private appChange(i: any) {
    const temp = { key: `${i.key}`, label: i.label };
  }
  get typeArr() {
    return this.type.split('.');
  }
  get maxValue() {
    const temp: number[] = this.stateDashboard[this.typeArr[0]][this.typeArr[1]].map((i: any) => i.value);
    return Math.max.apply(null, temp);
  }
}
</script>
<style lang="scss">
.rk-chart-slow{
  height: 215px;
  .calls{
    padding: 0 5px;
    display: inline-block;
    background-color: #40454e;
    color: #eee;
    border-radius: 4px;
  }
}
.rk-chart-slow-i{
  padding: 6px 0;
}
</style>
