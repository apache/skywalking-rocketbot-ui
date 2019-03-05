<template>
  <header class="rk-header flex-h">
    <div class="flex-h">
      <svg class="svg-logo icon mr-5">
        <use xlink:href="#logo"></use>
      </svg>
      <span class="logo">Rocketbot</span>
      <router-link class="nav-link mr-20" to="/" exact>
        <svg class="icon mr-5 sm vm">
          <use xlink:href="#chart"></use>
        </svg>
        <span class="vm">Dashboard</span>
      </router-link>
      <router-link class="nav-link mr-20" to="/topology">
        <svg class="icon mr-5 sm vm">
          <use xlink:href="#issues"></use>
        </svg>
        <span class="vm">Topology</span>
      </router-link>
      <router-link class="nav-link mr-20" to="/trace">
        <svg class="icon mr-5 sm vm">
          <use xlink:href="#merge"></use>
        </svg>
        <span class="vm">Trace</span>
      </router-link>
      <router-link class="nav-link mr-20" to="/alarm">
        <svg class="icon mr-5 sm vm">
          <use xlink:href="#spam"></use>
        </svg>
        <span class="vm">Alarm</span>
      </router-link>
    </div>
    <div class="flex-h">
      <span class="mr-5">Admin</span>
      <svg class="icon">
        <use xlink:href="#arrow-down"></use>
      </svg>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Header extends Vue {}
</script>

<style lang="scss" scoped>
.rk-header {
  flex-shrink: 0;
  justify-content: space-between;
  height: 48px;
  padding-right: 15px;
  padding-left: 15px;
  font-size: 13px;
  color: #efefef;
  background-color: #252a2f;
  .svg-logo {
    width: 22px;
    height: 22px;
  }
  .logo {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-size: 18px;
    padding-top: 2px;
    margin-right: 50px;
  }
  .nav-link {
    padding: 4px 10px;
    border-radius: 4px;
    opacity: 0.8;
    color: #efeff1;
    will-change: opacity, background-color;
    transition: opacity 0.3s, background-color 0.3s;
  }
  .nav-link:hover,
  .nav-link.active {
    opacity: 1;
    background-color: #333840;
  }
}
</style>
