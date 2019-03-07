<template>
<div class="rk-progress">
  <div class="rk-progress-inner" :style="`width:${precent}%;background-color: ${color};`"></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RkProgress extends Vue {
  @Prop({
    default: 0,
  }) public precent!: number;
  @Prop({
    default: '#3fb1e3',
  }) public color!: string;
}
</script>
<style lang="scss" scoped>
.rk-progress{
  height: 4px;
  border-radius: 2px;
  background-color: rgba(196, 200, 225, 0.3);
}
.rk-progress-inner{
  height: 100%;;
  border-radius: 2px;
}
</style>
