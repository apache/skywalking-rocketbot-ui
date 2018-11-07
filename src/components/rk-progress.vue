<template>
<div class="rk-progress">
  <div class="rk-progress-inner" :style="`width:${precent}%;background-color: ${color};`"></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RkChartBox extends Vue {
  @Prop({
    type: Number,
    default: 0,
  }) precent: Number;
  @Prop({
    type: String,
    default: '#72a5fd',
  }) color: String;
}
</script>
<style lang="scss" scoped>
.rk-progress{
  height: 3px;
  border-radius: 2px;
  background-color: #eaeaeb;
}
.rk-progress-inner{
  height: 100%;;
  border-radius: 2px;
}
</style>
