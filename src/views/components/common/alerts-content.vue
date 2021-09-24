<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->
<template>
  <div class="alert-content">
    <rk-alert
      v-for="(msg, index) in Object.keys(stateOption.selectorErrors)"
      :key="msg + index"
      :show.sync="stateOption.selectorErrors[msg]"
      type="error"
      :message="msg"
      :description="stateOption.selectorErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(rocketData.dashboardErrors)"
      :key="msg + index"
      :show.sync="rocketData.dashboardErrors[msg]"
      type="error"
      :message="msg"
      :description="rocketData.dashboardErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(stateTopo.topoErrors)"
      :key="msg + index"
      :show.sync="stateTopo.topoErrors[msg]"
      type="error"
      :message="msg"
      :description="stateTopo.topoErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(stateProfile.profileErrors)"
      :key="msg + index"
      :show.sync="stateProfile.profileErrors[msg]"
      type="error"
      :message="msg"
      :description="stateProfile.profileErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(rocketLog.logErrors)"
      :key="msg + index"
      :show.sync="rocketLog.logErrors[msg]"
      type="error"
      :message="msg"
      :description="rocketLog.logErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(rocketAlarm.alarmErrors)"
      :key="msg + index"
      :show.sync="rocketAlarm.alarmErrors[msg]"
      type="error"
      :message="msg"
      :description="rocketAlarm.alarmErrors[msg]"
    />
    <rk-alert
      v-for="(msg, index) in Object.keys(rocketEvent.eventErrors)"
      :key="msg + index"
      :show.sync="rocketEvent.eventErrors[msg]"
      type="error"
      :message="msg"
      :description="rocketEvent.eventErrors[msg]"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { State as topoState } from '@/store/modules/topology';
  import { State as profileState } from '@/store/modules/profile/profile-store';
  import { State as logState } from '@/store/modules/log';
  import { State as alarmState } from '@/store/modules/alarm';
  import { State as EventState } from '@/store/modules/event';

  @Component
  export default class AlertsContent extends Vue {
    @State('rocketOption') private stateOption!: optionState;
    @State('rocketData') private rocketData!: rocketData;
    @State('rocketTopo') private stateTopo!: topoState;
    @State('profileStore') private stateProfile!: profileState;
    @State('rocketLog') private rocketLog!: logState;
    @State('rocketAlarm') private rocketAlarm!: alarmState;
    @State('rocketEvent') private rocketEvent!: EventState;
  }
</script>
<style lang="scss" scoped>
  .alert-content {
    position: fixed;
    top: 60px;
    right: 5px;
    z-index: 1000;
  }
</style>
