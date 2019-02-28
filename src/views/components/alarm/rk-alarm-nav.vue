<template>
  <nav class="rk-nav">
    <router-link class="rk-nav-i b" to="/" exact>Service</router-link>
    <router-link class="rk-nav-i b" to="/endpoint">Endpoint</router-link>
    <router-link class="rk-nav-i b" to="/instance">Instance</router-link>
    <router-link class="rk-nav-i b" to="/database">Database</router-link>
    <a>
      <svg class="icon" style="vertical-align: middle;">
        <use xlink:href="#folder-new"></use>
      </svg>
    </a>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';

@Component({})
export default class Nav extends Vue {
}
</script>

<style lang="scss" scoped>
.rk-nav{
  border-bottom:1px solid #c1c5ca41;
  height: 40px;
  background-color: rgba(196, 200, 225, .2);
  padding: 0 15px;
}
.rk-nav-i{
  display: inline-block;
  height: 41px;
  margin-right: 25px;
  line-height: 40px;
  border-bottom: 2px;
  border-bottom-style: solid;
  color: rgba(61, 68, 79, .6);
  border-color: rgba(0, 0, 0, 0);
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &:hover{
    color: #458eff;
  }
  &.active{
    color: #458eff;
    border-color: #458eff;
  }
}
</style>
