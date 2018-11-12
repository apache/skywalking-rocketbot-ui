<template>
  <div class="rk-tool-time">
    <div class="mr5">
      <h6 class="mt0 mb5">Time Select</h6>
      <a class="rk-tool-btn mr5" @click="quickTime(15)">15m</a>
      <a class="rk-tool-btn mr5" @click="quickTime(30)">30m</a>
      <a class="rk-tool-btn mr5" @click="quickTime(60)">1h</a>
      <!-- <a class="rk-tool-btn mr5" @click="quickTime(180)">3h</a> -->
      <a class="rk-tool-btn mr5" @click="quickTime(6*60)">6h</a>
      <a class="rk-tool-btn mr5" @click="quickTime(12*60)">12h</a>
      <a class="rk-tool-btn mr5" @click="quickTime(24*60)">1d</a>
      <a class="rk-tool-btn mr5" @click="quickTime(2*24*60)">2d</a>
      <a class="rk-tool-btn mr15" @click="quickTime(7*24*60)">7d</a>
    </div>
    <div class="mr15">
      <h6 class="mt0 mb5">Time Choose</h6>
      <RkDate v-model="time" position="top" format="YYYY-MM-DD HH:mm:ss"/>
    </div>
    <div>
      <h6 class="mt0 mb5">Zone</h6>
      <div style="white-space:nowrap;">
        <span>UTC </span>{{utc >= 0 ? '+' : ''}}<input v-model="utc" min='-12' max="12" style="height:32px;background: 0;border: 0;color: #efefef;outline: none; width:60px" type="number">
  </div>
</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { setDuration } from '@/store/dispatch/_global.ts';
import { State } from 'vuex-class';

@Component({})
export default class RkToolTime extends Vue {
  @Prop() propsTime: any;
  @State('global') stateGlobal;
  time:Date[] = [this.propsTime.start, this.propsTime.end];
  utc: any = window.localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60);
  utcCopy: any = window.localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60);
  @Watch('time')
  onTimeUpdate() {
    setDuration(this.time);
  }
  @Watch('utc')
  onUtcUpdate() {
    if (this.utc < -12) this.utc = -12;
    if (this.utc > 12) this.utc = 12;
    if (this.utc === '') this.utc = 0;
    window.localStorage.setItem('utc', this.utc.toString());
    this.time = [new Date(this.propsTime.start.getTime() + ((this.utc - this.utcCopy) * 3600000)), new Date(this.propsTime.end.getTime() + ((this.utc - this.utcCopy) * 3600000))];
    this.utcCopy = this.utc;
  }
  quickTime(time) {
    this.time = [
      new Date(this.stateGlobal.duration.end.getTime() - (time * 60 * 1000)),
      this.stateGlobal.duration.end,
    ];
  }
}
</script>

<style lang="scss" scoped>
.rk-tool-time{
  display: flex;
  align-items: flex-start;
}
.rk-tool-btn{
  display: inline-block;
  height: 32px;
  padding: 6px 8px;
  border-radius: 4px;
  opacity: .8;
  transition: background-color .3s, opacity .3s;
  cursor: pointer;
  color: #e8e8e8;
  &:hover{
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
