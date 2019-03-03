<template>
  <div class="rk-num-box">
    <div class="grey">{{title}}</div>
    <div class="mb-10">
      <span class="title b">{{data.length ? content.toFixed(2) : 0}} <span class="unit">{{unit}}</span></span>
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

interface NumBoxData {
  value: number;
}

@Component({})
export default class RkChartBox extends Vue {
  @Prop() private precent!: boolean;
  @Prop({ type: String, default: '' }) private title!: string;
  @Prop({ default: [] }) private data!: NumBoxData[];
  @Prop({ type: String, default: '' }) private unit!: string;
  get content() {
    const temp = this.data.map((i: NumBoxData) => i.value);
    const sum = temp.reduce((preValue: number, curValue: number, index: number, array: number[]) => preValue + curValue)
    / this.data.length;
    return this.precent ? sum / 100 : sum;
  }
}
</script>
<style lang="scss">
.rk-num-box{
  padding-left: 10px;
  .unit{
    font-size: 16px;
  }
  .title{
    font-size: 24px;
  }
}
</style>
