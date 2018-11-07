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
</style>
