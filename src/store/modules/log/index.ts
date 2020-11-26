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

import { Commit, ActionTree, MutationTree, Dispatch } from 'vuex';
import * as types from '@/store/mutation-types';
import { AxiosResponse } from 'axios';
import graph from '@/graph';

const categories: any = [
  { label: 'All', key: 'ALL' },
  { label: 'Ajax', key: 'AJAX' },
  { label: 'Resource', key: 'RESOURCE' },
  { label: 'Vue', key: 'VUE' },
  { label: 'Promise', key: 'PROMISE' },
  { label: 'Js', key: 'JS' },
  { label: 'Unknown', key: 'UNKNOWN' },
];

export interface State {
  type: any;
  logCategories: any[];
  logs: any[];
  total: number;
  categories: any[];
  category: any;
  loading: boolean;
}

const initState: State = {
  type: { label: 'Browser', key: 'browser' },
  logCategories: [
    { label: 'Browser', key: 'browser' },
    { label: 'Service', key: 'service', disabled: true },
  ],
  logs: [],
  total: 0,
  categories,
  category: { label: 'All', key: 'ALL' },
  loading: false,
};

// getters
const getters = {};

// mutations
const mutations: MutationTree<State> = {
  [types.SELECT_LOG_TYPE](state: State, data: any) {
    state.type = data;
  },
  [types.SELECT_ERROR_CATALOG](state: State, data: any) {
    state.category = data;
  },
  [types.SET_LOGS](state: State, data: any) {
    state.logs = data;
  },
  [types.SET_LOGS_TOTAL](state: State, data: any) {
    state.total = data;
  },
  [types.SET_LOADING](state: State, data: any) {
    state.loading = data;
  },
};

// actions
const actions: ActionTree<State, any> = {
  QUERY_LOGS(context: { commit: Commit; state: State }, params: any) {
    switch (context.state.type.key) {
      case 'browser':
        context.commit('SET_LOADING', true);
        return graph
          .query('queryBrowserErrorLogs')
          .params(params)
          .then((res: AxiosResponse<any>) => {
            context.commit('SET_LOGS', res.data.data.queryBrowserErrorLogs.logs);
            context.commit('SET_LOGS_TOTAL', res.data.data.queryBrowserErrorLogs.total);
          })
          .finally(() => {
            context.commit('SET_LOADING', false);
          });
      case 'service':
        break;
      default:
        break;
    }
  },
};

export default {
  // namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
