<template>
  <div id="app">
    <RkHeader :time="stateGlobal.duration"/>
    <router-view class="wrapper"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component } from 'vue-property-decorator';

@Component({
})
export default class App extends Vue {
  value = [];
  local = {
    hourTip: 'Select Hour', // tip of select hour
    minuteTip: 'Select Minute', // tip of select minute
    secondTip: 'Select Second', // tip of select second
  };
  @State('global') stateGlobal;
}
</script>

<style lang='scss'>
@import './assets/styles/iview.css';
@import './assets/lib.scss';
@import './assets/style.scss';

html,body,#app{
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
}

.rk-time-tool {
  position: absolute;
  top: 55px;
  right: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 4px;
  .content{
    display: flex;
    align-items: center;
  }
}
.container{
  padding-left: 30px;
  padding-right: 30px;
}
.wrapper{
  flex-grow: 1;
  overflow: auto;
  // &::-webkit-scrollbar {
  // }
}
</style>
