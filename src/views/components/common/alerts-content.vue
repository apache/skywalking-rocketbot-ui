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
      v-for="(msg, index) in Object.keys(allAlerts)"
      :key="msg + index"
      :show.sync="allAlerts[msg]"
      type="error"
      :message="msg"
      :description="allAlerts[msg]"
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
  import { State as traceState } from '@/store/modules/trace/index';

  @Component
  export default class AlertsContent extends Vue {
    @State('rocketOption') private stateOption!: optionState;
    @State('rocketData') private rocketData!: rocketData;
    @State('rocketTopo') private stateTopo!: topoState;
    @State('profileStore') private stateProfile!: profileState;
    @State('rocketLog') private rocketLog!: logState;
    @State('rocketAlarm') private rocketAlarm!: alarmState;
    @State('rocketEvent') private rocketEvent!: EventState;
    @State('rocketTrace') private rocketTrace!: traceState;

    private get allAlerts() {
      return {
        ...this.rocketEvent.eventErrors,
        ...this.stateOption.selectorErrors,
        ...this.rocketData.dashboardErrors,
        ...this.stateTopo.topoErrors,
        ...this.stateProfile.profileErrors,
        ...this.rocketLog.logErrors,
        ...this.rocketAlarm.alarmErrors,
        ...this.rocketTrace.traceErrors,
      };
    }
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
