<template>
  <rk-toolbar :style="`transform: translate(-50%, ${show?0:150}%);`">
    <Icon class="r cp" type="md-close" @click="$emit('update:show', false);"/>
    <div class="flex">
      <div class="mr15 long">
        <h6 class="mt0 mb10" style="margin-left: 7px;">Service</h6>
        <select :value="stateTopo.current" style="background: 0;border: 0;color: #efefef;outline: none;width: 100%;" @change="appChange($event)">
          <option  style="background-color: #25292f;" :value="{ key: 'default',label: 'default' }">All</option>
          <option v-for="i in stateOptions.applications" :key="i.key" :value="i" >{{i.label}}</option>
        </select>
      </div>
      <div class="rk-tool-time long">
        <div>
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
        <!-- <div>
          <h6 class="mt0 mb5">Time Choose</h6>
          <RkDate v-model="time" position="top" format="YYYY-MM-DD HH:mm:ss"/>
        </div> -->
      </div>
    </div>
  </rk-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { setDuration } from '@/store/dispatch/_global.ts';
import { getTopo } from '@/store/dispatch/topo.ts';
import { State } from 'vuex-class';
@Component({})
export default class RkToolTime extends Vue {
  @Prop({ type: Boolean, default: false }) show: Boolean;
  @Prop() propsTime: any;
  @Prop() stateOptions: any;
  @Prop() stateTopo: any;
  @State('global') stateGlobal;
  time:Date[] = [this.propsTime.start, this.propsTime.end];
  @Watch('time')
  onTimeUpdate() {
    setDuration(this.time);
  }
  appChange(e) {
    if (e.target.selectedIndex === 0) {
      this.$store.commit('topo/SET_TOPO_CURRENT', {
        key: 'default',
        label: 'default',
      });
    } else {
      this.$store.commit('topo/SET_TOPO_CURRENT', this.stateOptions.applications[e.target.selectedIndex - 1]);
    }
    return getTopo();
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
