<template>
  <div class="rk-toolbar">
    <div class="rk-toolbar-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RkToolbar extends Vue {
  @Prop() option: Object;
}
</script>
<style lang="scss">
.rk-toolbar{
  position: fixed;
  left: 50%;
  bottom: 30px;
  width: 100%;
  max-width: 900px;
  transform: translate(-50%, 150%);
  padding: 0 15px;
  will-change: transform;
  transition: transform .3s;
}
.rk-toolbar-inner{
  padding: 15px 30px;
  border-radius: 6px;
  background-color: #25292f;
  color: #efefef;
  box-shadow:  0 3px 10px -2px rgba(0, 0, 0,.6);
}
</style>
