<template>
  <header class="rk-header">
    <div class="rk-header-start">
      <img class="mr10" :src="require('@/assets/img/logo.svg')"/>
      <span class="logo">Rocketbot</span>
    </div>
    <nav class="rk-nav">
      <router-link class="rk-nav-link" to="/" exact>Dashboard</router-link>
      <router-link class="rk-nav-link" to="/topo">Topology</router-link>
      <router-link class="rk-nav-link" to="/trace">Trace</router-link>
      <router-link class="rk-nav-link" to="/alarm">Alarm</router-link>
    </nav>
    <div class="rk-header-end">
      <div v-clickout="() => this.show = false">
        <div class="flex-c cp" @click="show = !show;">
          <span class="mr5 sm">{{time.start | dateformat}} ~ {{time.end | dateformat}}</span>
          <Icon :type="show?'md-arrow-dropup':'md-arrow-dropdown'" class="mr10"/>
        </div>
        <RkToolTime ref="rktooltime" :show.sync="show" :propsTime="time"/>
      </div>
      <div class="rk-nav-auto cp flex-c mr10" @click="reload"><Icon type="md-refresh" class="mr5"/>reload</div>
      <Dropdown trigger="click" placement="bottom-end">
        <div class="rk-nav-logout cp"><Icon type="md-power" /></div>
        <DropdownMenu slot="list">
          <li class="ivu-dropdown-item" @click="logout">Logout</li>
        </DropdownMenu>
      </Dropdown>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import RkToolTime from '@/components/rk-tool-time.vue';
import getLocalTime from '@/utils/localtime';

@Component({
  components: { RkToolTime },
})
export default class Header extends Vue {
  show = false;
  load = true;
  @Prop() time: any;
  logout() {
    window.localStorage.setItem('skywalking-authority', 'guest');
    this.$router.push('/login');
  }
  reload() {
    const gap = this.time.end.getTime() - this.time.start.getTime();
    const newEnd = getLocalTime(parseInt(window.localStorage.getItem('utc'), 10), new Date());
    const newStart = getLocalTime(parseInt(window.localStorage.getItem('utc'), 10), new Date(new Date().getTime() - gap));
    this.$store.dispatch('SET_DURATION', {
      end: newEnd,
      start: newStart,
      step: this.time.step,
    }).then(() => {
      const el:any = this.$refs.rktooltime;
      el.load = false;
      this.$nextTick(() => { el.load = true; });
    });
  }
}
</script>

<style lang="scss" scoped>
.rk-header {
  flex-shrink: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: #252a2f;
  color: #e8e8e8;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.06);
  .logo{
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     font-size: 18px;
     padding-top: 2px;
  }
}
.rk-header-start,.rk-header-end{
  display: flex;
  align-items: center;
}
.rk-nav-link{
  margin-right: 20px;
  padding: 5px 10px;
  border-radius: 6px;
  color: #e8e8e8;
  opacity: .8;
  will-change: opacity, background-color;
  transition: opacity .3s, background-color .3s;
  &:hover,&.active{
    opacity: 1;
    background-color: rgba(255,255,255,.07);
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.1), 0 1px 3px 0 rgba(0,0,0,.08);
  }
}
.rk-nav-auto{
  border-radius: 4px;
  padding: 1px 6px;
  background-color: rgba(255,255,255,.07);
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.1), 0 1px 3px 0 rgba(0,0,0,.08);
}
.rk-nav-logout{
  border-radius: 50%;
  padding:2px 5px;
  background-color: rgba(255,255,255,.07);
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.1), 0 1px 3px 0 rgba(0,0,0,.08);
  transition: color .3s;
  &:hover{
    color:rgb(226, 64, 36);
  }
}
</style>
