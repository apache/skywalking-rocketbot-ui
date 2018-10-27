<template>
  <nav class="rk-alarm-nav">
    <slot/>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({})
export default class Nav extends Vue {
}
</script>

<style lang="scss" scoped>
.rk-alarm-nav{
  border-bottom:1px solid rgba(0,0,0,.05);
  height: 40px;
  background-color: #f6f7fb;
  padding: 0 30px;
}
.rk-alarm-nav-i{
  display: inline-block;
  height: 40px;
  cursor: pointer;
  margin-right: 20px;
  line-height: 39px;
  font-weight: 600;
  border-bottom: 1px;
  border-bottom-style: solid;
  color: rgba(61, 68, 79, .6);
  border-color: rgba(0, 0, 0, 0);
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &:hover, &.active{
    border-color: #3880ff;
    color: #3880ff;
  }
}
</style>
