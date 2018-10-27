<template>
  <rk-toolbar :style="`transform: translate(-50%, ${show?0:150}%);`">
     <Icon class="r cp" type="md-close" @click="$emit('update:show', false);"/>
    <div class="rk-tool-time">
      <div>
        <h6 class="mt0 mb5">Time Select</h6>
        <a class="rk-tool-btn mr5" @click="quickTime(15)">15m</a>
        <a class="rk-tool-btn mr5" @click="quickTime(30)">30m</a>
        <a class="rk-tool-btn mr5" @click="quickTime(60)">1h</a>
        <a class="rk-tool-btn mr5" @click="quickTime(120)">2h</a>
        <a class="rk-tool-btn mr5" @click="quickTime(6*60)">6h</a>
        <a class="rk-tool-btn mr5" @click="quickTime(12*60)">12h</a>
        <a class="rk-tool-btn mr5" @click="quickTime(24*60)">1d</a>
        <a class="rk-tool-btn mr5" @click="quickTime(2*24*60)">2d</a>
        <a class="rk-tool-btn mr15" @click="quickTime(7*24*60)">7d</a>
      </div>
      <div>
        <h6 class="mt0 mb5">Time Choose</h6>
        <RkDate v-model="time" position="top" format="YYYY-MM-DD HH:mm:ss"/>
      </div>
    </div>
  </rk-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { setDuration } from '@/store/dispatch/_global.ts';

@Component({})
export default class RkToolTime extends Vue {
  @Prop({ type: Boolean, default: false }) show: Boolean;
  @Prop() propsTime: any;
  time:Date[] = [this.propsTime.start, this.propsTime.end];
  @Watch('time')
  onTimeUpdate() {
    setDuration(this.time);
  }
  quickTime(time) {
    this.time = [new Date(new Date().getTime() - (time * 60 * 1000)), new Date()];
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
