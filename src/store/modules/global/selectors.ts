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
import * as types from '../dashboard/mutation-types';
import { AxiosResponse } from 'axios';
import graph from '@/graph';

interface Options {
  key: string;
  label: string;
}
export interface State {
  services: Options[];
  currentService: Options;
  databases: Options[];
  currentDatabase: Options;
  endpoints: Options[];
  currentEndpoint: Options;
  instances: Options[];
  currentInstance: Options;
  updateDashboard: object;
  selectorType: string;
}

const initState: State = {
  services: [],
  currentService: { key: '', label: '' },
  endpoints: [],
  currentEndpoint: { key: '', label: '' },
  instances: [],
  currentInstance: { key: '', label: '' },
  databases: [],
  currentDatabase: { key: '', label: '' },
  updateDashboard: {},
  selectorType: 'service',
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_SERVICES](state: State, data: Options[]) {
    state.services = state.selectorType === 'browser' ? [{ label: 'All', key: '' }, ...data] : data;
    state.currentService = data[0] || {};
  },
  [types.SET_CURRENT_SERVICE](state: State, service: Options) {
    state.currentService = service;
    state.updateDashboard = service;
  },

  [types.UPDATE_DASHBOARD](state: State) {
    state.updateDashboard = { key: new Date().getTime() };
  },

  [types.SET_ENDPOINTS](state: State, data: Options[]) {
    state.endpoints = state.selectorType === 'browser' ? [{ label: 'All', key: '' }, ...data] : data;
    if (!state.endpoints.length) {
      state.currentEndpoint = { key: '', label: '' };
      return;
    }
    state.currentEndpoint = state.endpoints[0];
  },
  [types.SET_CURRENT_ENDPOINT](state: State, endpoint: Options) {
    state.currentEndpoint = endpoint;
    state.updateDashboard = endpoint;
  },
  [types.SET_INSTANCES](state: State, data: Options[]) {
    state.instances = state.selectorType === 'browser' ? [{ label: 'All', key: '' }, ...data] : data;
    if (!state.instances.length) {
      state.currentInstance = { key: '', label: '' };
      return;
    }
    state.currentInstance = state.instances[0];
  },
  [types.SET_CURRENT_INSTANCE](state: State, instance: Options) {
    state.currentInstance = instance;
    state.updateDashboard = instance;
  },
  [types.SET_DATABASES](state: State, data: Options[]) {
    state.databases = data;
    if (!data.length) {
      state.currentDatabase = { key: '', label: '' };
      return;
    }
    state.currentDatabase = data[0];
  },
  [types.SET_CURRENT_DATABASE](state: State, service: Options) {
    state.currentDatabase = service;
    state.updateDashboard = service;
  },
  [types.SET_SELECTOR_TYPE](state: State, type: string) {
    state.selectorType = type;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit }, params: { duration: any; keyword: string }) {
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_SERVICES, res.data.data.services);
      });
  },
  GET_SERVICE_ENDPOINTS(context: { commit: Commit; state: any }, params: { keyword: string }) {
    if (!context.state.currentService.key) {
      context.commit(types.SET_ENDPOINTS, []);
      return;
    }
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryEndpoints')
      .params({ serviceId: context.state.currentService.key || '', ...params })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_ENDPOINTS, res.data.data.getEndpoints);
      });
  },
  GET_SERVICE_INSTANCES(context: { commit: Commit; state: any }, params: any) {
    if (!context.state.currentService.key) {
      context.commit(types.SET_INSTANCES, []);
      return;
    }
    return graph
      .query('queryInstances')
      .params({ serviceId: context.state.currentService.key || '', ...params })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_INSTANCES, res.data.data.getServiceInstances);
      });
  },
  GET_DATABASES(context: { commit: Commit; rootState: any }, params: any) {
    return graph
      .query('queryDatabases')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_DATABASES, res.data.data.services);
      });
  },
  SELECT_SERVICE(context: { commit: Commit; dispatch: Dispatch }, params: any) {
    if (!params.service.key) {
      return;
    }
    context.commit('SET_CURRENT_SERVICE', params.service);
    context.dispatch('GET_SERVICE_ENDPOINTS', {});
    context.dispatch('GET_SERVICE_INSTANCES', { duration: params.duration });
  },
  SELECT_ENDPOINT(context: { commit: Commit; dispatch: Dispatch; state: any; rootState: any }, params: any) {
    context.commit('SET_CURRENT_ENDPOINT', params.endpoint);
  },
  SELECT_INSTANCE(context: { commit: Commit; dispatch: Dispatch; state: any; rootState: any }, params: any) {
    context.commit('SET_CURRENT_INSTANCE', params.instance);
  },
  SELECT_DATABASE(context: { commit: Commit; dispatch: Dispatch }, params: any) {
    context.commit('SET_CURRENT_DATABASE', params);
    context.dispatch('RUN_EVENTS', {}, { root: true });
  },
  MIXHANDLE_GET_OPTION(context: { dispatch: Dispatch; commit: Commit }, params: any) {
    context.commit('SET_SELECTOR_TYPE', params.compType);
    switch (params.compType) {
      case 'service':
        return context
          .dispatch('GET_SERVICES', { duration: params.duration, keyword: params.keywordServiceName })
          .then(() => context.dispatch('GET_SERVICE_ENDPOINTS', {}))
          .then(() => context.dispatch('GET_SERVICE_INSTANCES', { duration: params.duration }));
      case 'database':
        return context.dispatch('GET_DATABASES', { duration: params.duration });
      case 'browser':
        return context
          .dispatch('GET_BROWSER_SERVICES', { duration: params.duration, keyword: params.keywordServiceName })
          .then(() => context.dispatch('GET_SERVICE_ENDPOINTS', {}))
          .then(() => context.dispatch('GET_SERVICE_INSTANCES', { duration: params.duration }));
      default:
        break;
    }
  },
  GET_BROWSER_SERVICES(context: { commit: Commit }, params: { duration: any }) {
    return graph
      .query('queryBrowserServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_SERVICES, res.data.data.services);
      });
  },
  GET_ITEM_ENDPOINTS(context, params) {
    return graph
      .query('queryEndpoints')
      .params(params)
      .then((res: AxiosResponse) => {
        return res.data.data.getEndpoints;
      });
  },
  GET_ITEM_INSTANCES(context, params) {
    return graph
      .query('queryInstances')
      .params(params)
      .then((res: AxiosResponse) => {
        return res.data.data.getServiceInstances;
      });
  },
  GET_ITEM_SERVICES(context, params: { duration: any; keyword: string }) {
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        return res.data.data.services || [];
      });
  },
};

export default {
  state: initState,
  actions,
  mutations,
};
