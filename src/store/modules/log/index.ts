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

interface Options {
  key: string;
  label: string;
}
export interface State {
  type: Options;
  logCategories: Options[];
  logs: any[];
  total: number;
  categories: Options[];
  category: Options;
  loading: boolean;
  conditions: any;
  supportQueryLogsByKeywords: boolean;
}

const categories: Options[] = [
  { label: 'All', key: 'ALL' },
  { label: 'Ajax', key: 'AJAX' },
  { label: 'Resource', key: 'RESOURCE' },
  { label: 'Vue', key: 'VUE' },
  { label: 'Promise', key: 'PROMISE' },
  { label: 'Js', key: 'JS' },
  { label: 'Unknown', key: 'UNKNOWN' },
];

const logState: State = {
  type: { label: 'Service', key: 'service' },
  logCategories: [
    { label: 'Service', key: 'service' },
    { label: 'Browser', key: 'browser' },
  ],
  logs: [],
  total: 0,
  categories,
  category: { label: 'All', key: 'ALL' },
  loading: false,
  conditions: {
    traceId: localStorage.getItem('logTraceId') || '',
    keywordsOfContent: localStorage.getItem('logKeywordsOfContent')
      ? JSON.parse(localStorage.getItem('logKeywordsOfContent') || '')
      : [],
    excludingKeywordsOfContent: localStorage.getItem('logExcludingKeywordsOfContent')
      ? JSON.parse(localStorage.getItem('logExcludingKeywordsOfContent') || '')
      : [],
  },
  supportQueryLogsByKeywords: true,
};

// mutations
const mutations: MutationTree<State> = {
  [types.SELECT_LOG_TYPE](state: State, data: Options) {
    state.type = data;
  },
  [types.SELECT_ERROR_CATALOG](state: State, data: Options) {
    state.category = data;
  },
  [types.SET_LOGS](state: State, data: any[]) {
    state.logs = data;
  },
  [types.SET_LOGS_TOTAL](state: State, data: number) {
    state.total = data;
  },
  [types.SET_LOADING](state: State, data: boolean) {
    state.loading = data;
  },
  [types.SET_LOG_CONDITIONS](state: State, item: Options) {
    state.conditions = {
      ...state.conditions,
      [item.label]: item.key,
    };
  },
  [types.SET_SUPPORT_QUERY_LOGS_KEYWORDS](state: State, isSupport: boolean) {
    state.supportQueryLogsByKeywords = isSupport;
  },
  [types.CLEAR_LOG_CONDITIONS](state: State) {
    state.conditions = {
      date: state.conditions.date,
    };
    localStorage.removeItem('logKeywordsOfContent');
    localStorage.removeItem('logExcludingKeywordsOfContent');
    localStorage.removeItem('logTags');
    localStorage.removeItem('logTraceId');
  },
};

// actions
const actions: ActionTree<State, any> = {
  QUERY_LOGS(context: { commit: Commit; state: State }, params: any) {
    context.commit('SET_LOADING', true);
    switch (context.state.type.key) {
      case 'browser':
        return graph
          .query('queryBrowserErrorLogs')
          .params(params)
          .then((res: AxiosResponse<any>) => {
            if (res.data && res.data.errors) {
              context.commit('SET_LOGS', []);
              context.commit('SET_LOGS_TOTAL', 0);

              return;
            }
            context.commit('SET_LOGS', res.data.data.queryBrowserErrorLogs.logs);
            context.commit('SET_LOGS_TOTAL', res.data.data.queryBrowserErrorLogs.total);
          })
          .finally(() => {
            context.commit('SET_LOADING', false);
          });
      case 'service':
        return graph
          .query('queryServiceLogs')
          .params(params)
          .then((res: AxiosResponse<any>) => {
            if (res.data && res.data.errors) {
              context.commit('SET_LOGS', []);
              context.commit('SET_LOGS_TOTAL', 0);

              return;
            }
            context.commit('SET_LOGS', res.data.data.queryLogs.logs);
            context.commit('SET_LOGS_TOTAL', res.data.data.queryLogs.total);
          })
          .finally(() => {
            context.commit('SET_LOADING', false);
          });
      default:
        break;
    }
  },
  QUERY_LOGS_BYKEYWORDS(context: { commit: Commit }) {
    return graph
      .query('queryLogsByKeywords')
      .params({})
      .then((res: AxiosResponse<any>) => {
        if (res.data && res.data.errors) {
          return;
        }
        context.commit('SET_SUPPORT_QUERY_LOGS_KEYWORDS', res.data.data.support);
      });
  },
};

export default {
  state: logState,
  actions,
  mutations,
};
