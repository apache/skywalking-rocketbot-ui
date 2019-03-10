<template>
  <header class="rk-header flex-h">
    <div class="flex-h">
      <svg class="svg-logo icon mr-5">
        <use xlink:href="#logo"></use>
      </svg>
      <span class="logo">Rocketbot</span>
      <router-link class="nav-link mr-20" to="/" exact>
        <svg class="icon sm vm">
          <use xlink:href="#chart"></use>
        </svg>
        <span class="vm hide-xs ml-5">Dashboard</span>
      </router-link>
      <router-link class="nav-link mr-20" to="/topology">
        <svg class="icon sm vm">
          <use xlink:href="#issues"></use>
        </svg>
        <span class="vm hide-xs ml-5">Topology</span>
      </router-link>
      <router-link class="nav-link mr-20" to="/trace">
        <svg class="icon sm vm">
          <use xlink:href="#merge"></use>
        </svg>
        <span class="vm hide-xs ml-5">Trace</span>
      </router-link>
      <router-link class="nav-link mr-20" to="/alarm">
        <svg class="icon sm vm">
          <use xlink:href="#spam"></use>
        </svg>
        <span class="vm hide-xs ml-5">Alarm</span>
      </router-link>
    </div>
    <div class="flex-h">
      <a class="rk-btn mr-15 sm ghost" @click="handleReload">
        <svg class="icon mr-5 vm">
          <use xlink:href="#retry"></use>
        </svg>
        <span class="vm">Reload</span>
      </a>
      <a class="rk-header-user" v-clickout="handleHide">
        <div @click="handleShow" class="rk-btn" :class="show? 'blue' : 'ghost'">
          <svg class="icon vs">
            <use xlink:href="#user"></use>
          </svg>
          <svg class="icon vs">
            <use xlink:href="#arrow-down"></use>
          </svg>
        </div>
        <div class="rk-header-user-menu" v-if="show">
          <div class="rk-header-user-menu-i" @click="handleSignout">
            <svg class="icon vs">
              <use xlink:href="#issue-close"></use>
            </svg>
            Sign out</div>
        </div>
      </a>      
  </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import timeFormat from '@/utils/timeFormat';

@Component
export default class Header extends Vue {
  @State('rocketbot') private rocketbotGlobal: any;
  @Action('SET_DURATION') private SET_DURATION: any;
  private show: boolean = false;
  private handleReload() {
    const gap = this.rocketbotGlobal.duration.end.getTime() - this.rocketbotGlobal.duration.start.getTime();
    const w = window as any;
    const utc = w.localStorage.getItem('utc');
    const utcCopy: any = -(new Date().getTimezoneOffset() / 60);
    this.$emit('reloadFooter', [
      new Date(new Date().getTime() - gap + (utc - utcCopy) * 3600000),
      new Date(new Date().getTime() + (utc - utcCopy) * 3600000),
    ]);
  }
  private handleHide() {
    this.show = false;
  }
  private handleShow() {
    this.show = !this.show;
  }
  private handleSignout() {
    localStorage.removeItem('skywalking-authority');
    this.$router.push('/login');
  }
}
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
    background-color: #333844;
  }
}
.rk-header-user{
  position: relative;
}
.rk-header-user-menu{
  position: absolute;
  top: 35px;
  right: 0;
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  padding: 3px 0;
  color: #333844;
  width: 100px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
}
.rk-header-user-menu-i{
  padding: 6px 10px;
  will-change: background-color;
  transition: background-color .3s;
  &:hover{
    background-color:#dededf; 
  }
}
</style>
