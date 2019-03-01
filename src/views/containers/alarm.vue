<template>
  <div class="rk-alarm flex-v">
    <AlarmTool :durationTime="durationTime"/>
    <div style="flex-grow: 1;overflow: auto;">
      <AlarmTable :data="rocketAlarm.alarmService"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import alarm from '@/store/modules/alarm';
import AlarmTool from '../components/alarm/alarm-tool.vue';
import AlarmTable from '../components/alarm/alarm-table.vue';
import { State, Action, Getter } from 'vuex-class';

@Component({
  components: { AlarmTool, AlarmTable },
})
export default class Alarm extends Vue {
  @State('rocketAlarm') private rocketAlarm!: any;
  @Getter('durationTime') private durationTime: any;
  private beforeCreate() {
    this.$store.registerModule('rocketAlarm', alarm);
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketAlarm');
  }
}
</script>

<style lang="scss">
.rk-alarm {
  flex-grow: 1;
  height: 100%;
  overflow: auto;
}
</style>
