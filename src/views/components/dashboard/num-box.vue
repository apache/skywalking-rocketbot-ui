<template>
  <div class="mb15 rk-num-box">
    <div style="opacity:.6">{{title}}</div>
    <h1 class="n">{{content}} <span class="unit">{{unit}}</span></h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RkChartBox extends Vue {
  @Prop({ type: String, default: '' }) title: String;
  @Prop({ default: '' }) content: String | Number;
  @Prop({ type: String, default: '' }) unit: String;
}
</script>
<style lang="scss">
.rk-num-box{
  padding-left: 10px;
  width: 100%;
  .unit{
    font-size: 16px;
  }
}
</style>
