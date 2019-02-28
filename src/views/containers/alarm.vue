<template>
  <RkAlarmWrapper/>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import RkAlarmWrapper from '../components/alarm/rk-alarm-wrapper.vue';
import alarm from '../../store/modules/alarm';

@Component({
  components: { RkAlarmWrapper },
})
export default class Alarm extends Vue {
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
.rk-alarm-table-wrapper{
  padding: 0 10px;
  border-right: 1px solid rgba(196, 200, 225, 0.2);
  height: 100%;
}
.rk-alarm-table{
  width: 100%;
  table-layout: fixed;
}
</style>
