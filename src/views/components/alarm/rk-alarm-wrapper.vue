<template>
  <div class="rk-alarm flex-v">
    <RkAlarmNav/>
    <div class="container clear">
      <RkAlarmTable class="g-sm-4" :data="rocketAlarm.alarmService"/>
      <RkAlarmTable class="g-sm-4" :data="rocketAlarm.alarmService"/>
      <RkAlarmTable class="g-sm-4" :data="rocketAlarm.alarmService"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RkAlarmNav from './rk-alarm-nav.vue';
import RkAlarmTable from './rk-alarm-table.vue';
import Component from 'vue-class-component';
import { Action, State, Getter } from 'vuex-class';

@Component({
  components: { RkAlarmNav, RkAlarmTable },
})
export default class Alarm extends Vue {
  @State('rocketAlarm') private rocketAlarm!: any;
  @Getter('intervalTime') private intervalTime: any;
  @Action('rocketAlarm/GET_ALARM') private GET_ALARM: any;
  private beforeMount() {
    this.GET_ALARM();
  }
}
</script>

<style lang="scss">

</style>
