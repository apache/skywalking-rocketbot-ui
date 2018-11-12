<template>
  <rk-toolbar :style="`transform: translate(-50%, ${show?0:150}%);`">
    <Icon class="r cp" type="md-close" @click="$emit('update:show', false);"/>
    <RkToolTimeInner v-if="load" :propsTime="propsTime"/>
  </rk-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import RkToolTimeInner from './rk-tool-time-inner.vue';

@Component({ components: { RkToolTimeInner } })
export default class RkToolTime extends Vue {
  @Prop({ type: Boolean, default: false }) show: Boolean;
  @Prop() propsTime: any;
  load = true;
}
</script>

<style lang="scss" scoped>
</style>
