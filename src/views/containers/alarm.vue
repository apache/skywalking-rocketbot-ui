/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div class="rk-alarm flex-v">
    <AlarmTool :durationTime="durationTime" :total="rocketAlarm.total"/>
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
}
</style>
