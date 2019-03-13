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
import { CompsContainer, CompsTree } from '../interfaces';
import compsData from './comps-data';
import compsTree from './comps-tree';

export interface State {
  data: CompsContainer;
  current: number;
  group: number;
  tree: CompsTree[];
}

const initState: State = {
  ...compsData.state,
  ...compsTree.state,
};

// mutations
const mutations: MutationTree<any> = {
  ...compsData.mutations,
  ...compsTree.mutations,
};

// actions
const actions: ActionTree<any, any> = {
  ...compsData.actions,
  ...compsTree.actions,
  MIXHANDLE_CHANGE_GROUP(context: { commit: Commit, dispatch: Dispatch, state: State, rootState: any }, index: number) {
    const rocketDashboard = context.rootState.rocketDashboard;
    const temp: any = {};
    if (rocketDashboard.currentService) { temp.service = rocketDashboard.currentService; }
    if (rocketDashboard.currentEndpoint) { temp.endpoint = rocketDashboard.currentEndpoint; }
    if (rocketDashboard.currentInstance) { temp.instance = rocketDashboard.currentInstance; }
    if (rocketDashboard.currentDatabase) { temp.database = rocketDashboard.currentDatabase; }
    context.commit('SET_GROUP_QUERY', temp);
    context.commit('SET_CURRENT_GROUP', index);
    context.dispatch('rocketDashboard/SET_CURRENT_STATE', context.state.tree[index].query);
    context.dispatch('RUN_EVENTS');
  },
} ;

// getters
const getters = {
  ...compsData.getters,
  ...compsTree.getters,
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
