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

import Vue from 'vue';
import Vuex from 'vuex';
import rocketbot, { State as RocketbotState } from './modules/global';
import rocketOption, { State as DashboardOptionState } from './modules/global/selectors';
import rocketData, { State as DashboardDataState } from './modules/dashboard/dashboard-data';
import rocketTopo, { State as TopoState } from '@/store/modules/topology';
import rocketTopoGroup, { State as TopoGroupState } from '@/store/modules/topology/group';
import rocketTrace, { State as TraceState } from '@/store/modules/trace';
import rocketAlarm, { State as AlarmState } from '@/store/modules/alarm';
import profileStore, { State as ProfileState } from '@/store/modules/profile/profile-store';
import rocketLog, { State as LogState } from '@/store/modules/log';

Vue.use(Vuex);

export interface State {
  rocketbot: RocketbotState;
  rocketOption: DashboardOptionState;
  rocketData: DashboardDataState;
  rocketTopo: TopoState;
  rocketTopoGroup: TopoGroupState;
  rocketTrace: TraceState;
  rocketAlarm: AlarmState;
  profileStore: ProfileState;
  logStore: LogState;
}

export default new Vuex.Store({
  modules: {
    rocketbot,
    rocketOption,
    rocketData,
    rocketTopo,
    rocketTopoGroup,
    rocketTrace,
    rocketAlarm,
    profileStore,
    rocketLog,
  },
});
