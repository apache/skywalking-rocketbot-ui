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
  type: any;
  logCategories: any[];
  logs: any[];
  total: number;
  categories: any[];
  category: any;
  loading: boolean;
  logServices: Array<{ key: string; label: string }>;
  currentLogService: { key: string; label: string };
  logEndpoints: Array<{ key: string; label: string }>;
  currentLogEndpoint: { key: string; label: string };
  logInstances: Array<{ key: string; label: string }>;
  currentLogInstance: { key: string; label: string };
}

const categories: any = [
  { label: 'All', key: 'ALL' },
  { label: 'Ajax', key: 'AJAX' },
  { label: 'Resource', key: 'RESOURCE' },
  { label: 'Vue', key: 'VUE' },
  { label: 'Promise', key: 'PROMISE' },
  { label: 'Js', key: 'JS' },
  { label: 'Unknown', key: 'UNKNOWN' },
];

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
  logServices: [],
  currentLogService: { key: '', label: '' },
  logEndpoints: [],
  currentLogEndpoint: { key: '', label: '' },
  logInstances: [],
  currentLogInstance: { key: '', label: '' },
};

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
  [types.SET_LOG_SERVICES](state: State, data: any) {
    state.logServices = [{ label: 'All', key: '' }, ...data];
    state.currentLogService = state.logServices[0];
  },
  [types.SET_LOG_ENDPOINTS](state: State, data: any) {
    state.logEndpoints = [{ label: 'All', key: '' }, ...data];
    state.currentLogEndpoint = state.logEndpoints[0];
  },
  [types.SET_LOG_INSTANCES](state: State, data: Options[]) {
    state.logInstances = [{ label: 'All', key: '' }, ...data];
    state.currentLogInstance = state.logInstances[0];
  },
  [types.SET_CURRENT_LOG_SERVICE](state: State, service: Options) {
    state.currentLogService = service;
  },
  [types.SET_CURRENT_LOG_ENDPOINT](state: State, endpoint: Options) {
    state.currentLogEndpoint = endpoint;
  },
  [types.SET_CURRENT_LOG_INSTANCE](state: State, instance: Options) {
    state.currentLogInstance = instance;
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
  GET_LOG_SERVICES(context: { commit: Commit }, params: { duration: any }) {
    return graph
      .query('queryBrowserServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_LOG_SERVICES, res.data.data.services);
      });
  },
  LOG_GET_OPTION(context: { dispatch: Dispatch; state: State }, params: any) {
    context
      .dispatch('GET_LOG_SERVICES', { duration: params.duration })
      .then(() => context.dispatch('GET_LOG_ENDPOINTS', {}))
      .then(() => context.dispatch('GET_LOG_INSTANCES', { duration: params.duration }));
  },
  GET_LOG_ENDPOINTS(context: { commit: Commit; state: any }, params: { keyword: string }) {
    if (!context.state.currentLogEndpoint.key) {
      context.commit(types.SET_LOG_ENDPOINTS, []);
      return;
    }
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryEndpoints')
      .params({ serviceId: context.state.currentLogEndpoint.key || '', ...params })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_LOG_ENDPOINTS, res.data.data.getEndpoints);
      });
  },
  GET_LOG_INSTANCES(context: { commit: Commit; state: any }, params: any) {
    if (!context.state.currentLogInstance.key) {
      context.commit(types.SET_LOG_INSTANCES, []);
      return;
    }
    return graph
      .query('queryInstances')
      .params({ serviceId: context.state.currentLogInstance.key || '', ...params })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_LOG_INSTANCES, res.data.data.getServiceInstances);
      });
  },
  SELECT_LOG_SERVICE(context: { commit: Commit; dispatch: Dispatch }, params: any) {
    context.commit('SET_CURRENT_LOG_SERVICE', params.service);
    context.dispatch('GET_LOG_ENDPOINTS', {});
    context.dispatch('GET_LOG_INSTANCES', { duration: params.duration });
  },
  SELECT_LOG_ENDPOINT(context: { commit: Commit; dispatch: Dispatch; state: any; rootState: any }, params: any) {
    context.commit('SET_CURRENT_LOG_ENDPOINT', params.endpoint);
  },
  SELECT_LOG_INSTANCE(context: { commit: Commit; dispatch: Dispatch; state: any; rootState: any }, params: any) {
    context.commit('SET_CURRENT_LOG_INSTANCE', params.instance);
  },
};

export default {
  // namespaced: true,
  state: initState,
  actions,
  mutations,
};
