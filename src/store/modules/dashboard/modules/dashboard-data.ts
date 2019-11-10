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

import { ActionTree, MutationTree, Commit, Dispatch } from 'vuex';
import { CompsTree } from '@/types/dashboard';
import dashboardLayout from './dashboard-data-layout';
import dashboardQuery from './dashboard-data-query';
import { queryChartData } from '@/utils/queryChartData';

export interface State {
  current: number;
  group: number;
  tree: CompsTree[];
  data: any;
}

const initState: State = {
  ...dashboardLayout.state,
  data: queryChartData,
};

// mutations
const mutations: MutationTree<any> = {
  ...dashboardLayout.mutations,
};

// actions
const actions: ActionTree<State, any> = {
  ...dashboardQuery.actions,
  MIXHANDLE_CHANGE_GROUP(
    context: { commit: Commit, dispatch: Dispatch, state: State, rootState: any }, index: number): void {
    const rocketOption = context.rootState.rocketOption;
    const temp: any = {};
    if (rocketOption.currentService) { temp.service = rocketOption.currentService; }
    if (rocketOption.currentEndpoint) { temp.endpoint = rocketOption.currentEndpoint; }
    if (rocketOption.currentInstance) { temp.instance = rocketOption.currentInstance; }
    if (rocketOption.currentDatabase) { temp.database = rocketOption.currentDatabase; }
    context.commit('SET_GROUP_QUERY', temp);
    context.commit('SET_CURRENT_GROUP', index);
    context.dispatch('SET_CURRENT_STATE', context.state.tree[index].query);
    context.dispatch('RUN_EVENTS', {}, {root: true});
  },
} ;

// getters
const getters = {
  ...dashboardQuery.getters,
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
