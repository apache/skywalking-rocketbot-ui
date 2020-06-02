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
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import dashboardLayout from './dashboard-data-layout';
import dashboardQuery from './dashboard-data-query';

export interface State {
  current: number;
  group: number;
  tree: CompsTree[];
}

const initState: State = {
  ...dashboardLayout.state,
};

// mutations
const mutations: MutationTree<any> = {
  ...dashboardLayout.mutations,
};

// actions
const actions: ActionTree<State, any> = {
  ...dashboardQuery.actions,
  MIXHANDLE_CHANGE_GROUP(
    context: { commit: Commit; dispatch: Dispatch; state: State; rootState: any },
    index: number,
  ): void {
    const rocketOption = context.rootState.rocketOption;
    const temp: any = {};
    if (rocketOption.currentService) {
      temp.service = rocketOption.currentService;
    }
    if (rocketOption.currentEndpoint) {
      temp.endpoint = rocketOption.currentEndpoint;
    }
    if (rocketOption.currentInstance) {
      temp.instance = rocketOption.currentInstance;
    }
    if (rocketOption.currentDatabase) {
      temp.database = rocketOption.currentDatabase;
    }
    context.commit('SET_GROUP_QUERY', temp);
    context.commit('SET_CURRENT_GROUP', index);
    context.dispatch('SET_CURRENT_STATE', context.state.tree[index].query);
    context.dispatch('RUN_EVENTS', {}, { root: true });
  },
  MIXHANDLE_CHANGE_GROUP_WITH_CURRENT(
    context: { commit: Commit; dispatch: Dispatch; state: State; rootState: any },
    { index, current = 0 }: { index: number; current: number },
  ): void {
    const { rocketOption } = context.rootState;
    const temp: any = {};
    if (rocketOption.currentService) {
      temp.service = rocketOption.currentService;
    }
    if (rocketOption.currentEndpoint) {
      temp.endpoint = rocketOption.currentEndpoint;
    }
    if (rocketOption.currentInstance) {
      temp.instance = rocketOption.currentInstance;
    }
    if (rocketOption.currentDatabase) {
      temp.database = rocketOption.currentDatabase;
    }
    context.commit('SET_GROUP_QUERY', temp);
    context.commit('SET_CURRENT_GROUP_WITH_CURRENT', { index, current });
    context.dispatch('SET_CURRENT_STATE', context.state.tree[index].query);
    context.dispatch('RUN_EVENTS', {}, { root: true });
  },
  TYPE_METRICS(context, params: { name: string }) {
    const metricNames = (params.name || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    return Promise.all(
      metricNames.map((item: string) => {
        return graph
          .query('queryTypeOfMetrics')
          .params({ name: item })
          .then((res: AxiosResponse) => {
            return res.data.data;
          });
      }),
    );
  },
  GET_ALL_TEMPLATES(context) {
    return graph
      .query('queryGetAllTemplates')
      .params({})
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        return res.data.data.getAllTemplates || [];
      });
  },
  ADD_TEMPLATE(context, params) {
    return graph
      .query('mutationAddTemplate')
      .params({ setting: params })
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        return res.data.data.addTemplate || [];
      });
  },
};

export default {
  state: initState,
  actions,
  mutations,
};
