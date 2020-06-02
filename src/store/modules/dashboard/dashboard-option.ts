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
import * as types from './mutation-types';
import { AxiosResponse } from 'axios';
import graph from '@/graph';

export interface State {
  services: any[];
  currentService: any;
  databases: any;
  currentDatabase: any;
  endpoints: any[];
  currentEndpoint: any;
  instances: any[];
  currentInstance: any;
  keywordService: string;
  updateDashboard: string;
}

const initState: State = {
  services: [],
  currentService: {},
  endpoints: [],
  currentEndpoint: {},
  instances: [],
  currentInstance: {},
  databases: [],
  currentDatabase: {},
  keywordService: localStorage.getItem('keywordServiceName') || '',
  updateDashboard: '',
};

// getters
const getters = {};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_SERVICES](state: State, data: any) {
    if (!data.length) {
      return;
    }
    state.services = data;
    if (!state.currentService.key && data.length) {
      state.currentService = data[0];
    }
  },
  [types.SET_CURRENT_SERVICE](state: State, service: any) {
    state.currentService = service;
    state.updateDashboard = service;
  },
  [types.SET_ENDPOINTS](state: State, data: any) {
    state.endpoints = data;
    if (!data.length) {
      state.currentEndpoint = {};
      return;
    }
    if ((!state.currentEndpoint.key && data.length) || !state.endpoints.includes(state.currentEndpoint)) {
      state.currentEndpoint = data[0];
    }
  },
  [types.SET_CURRENT_ENDPOINT](state: State, endpoint: any) {
    state.currentEndpoint = endpoint;
    state.updateDashboard = endpoint;
  },
  [types.SET_INSTANCES](state: State, data: any) {
    state.instances = data;
    if (!data.length) {
      state.currentInstance = {};
      return;
    }
    if ((!state.currentInstance.key && data.length) || !state.instances.includes(state.currentInstance)) {
      state.currentInstance = data[0];
    }
  },
  [types.SET_CURRENT_INSTANCE](state: State, instance: any) {
    state.currentInstance = instance;
    state.updateDashboard = instance;
  },
  [types.SET_DATABASES](state: State, data: any) {
    state.databases = data;
    if (!data.length) {
      return;
    }
    if (!state.currentDatabase.key && data.length) {
      state.currentDatabase = data[0];
    }
  },
  [types.SET_CURRENT_DATABASE](state: State, service: any) {
    state.currentDatabase = service;
  },
  [types.SET_KEYWORDSERVICE](state: State, data: string) {
    state.keywordService = data;
    window.localStorage.setItem('keywordServiceName', data);
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
      return new Promise((resolve) => resolve());
    }
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryEndpoints')
      .params({ serviceId: context.state.currentService.key, ...params })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_ENDPOINTS, res.data.data.getEndpoints);
      });
  },
  GET_ENDPOINTS(context: { commit: Commit }, params: any) {
    return graph
      .query('queryEndpoints')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_ENDPOINTS, res.data.data.endpoints);
      });
  },
  GET_SERVICE_INSTANCES(context: { commit: Commit; state: any }, params: any) {
    if (!context.state.currentService.key) {
      return new Promise((resolve) => resolve());
    }
    return graph
      .query('queryInstances')
      .params({ serviceId: context.state.currentService.key, ...params })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_INSTANCES, res.data.data.getServiceInstances);
      });
  },
  GET_INSTANCES(context: { commit: Commit }, params: any) {
    return graph
      .query('queryInstances')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_INSTANCES, res.data.data);
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
  SET_CURRENT_STATE(context: { commit: Commit }, params: any = {}) {
    context.commit(types.SET_CURRENT_SERVICE, params.service ? params.service : {});
    context.commit(types.SET_CURRENT_DATABASE, params.database ? params.database : {});
    context.commit(types.SET_CURRENT_ENDPOINT, params.endpoint ? params.endpoint : {});
    context.commit(types.SET_CURRENT_INSTANCE, params.instance ? params.instance : {});
  },
  MIXHANDLE_GET_OPTION(context: { commit: Commit; dispatch: Dispatch; state: State; getters: any }, params: any) {
    switch (params.compType) {
      case 'service':
        return context
          .dispatch('GET_SERVICES', { duration: params.duration, keyword: params.keywordServiceName })
          .then(() => context.dispatch('GET_SERVICE_ENDPOINTS', {}))
          .then(() => context.dispatch('GET_SERVICE_INSTANCES', { duration: params.duration }));
      case 'database':
        return context.dispatch('GET_DATABASES', { duration: params.duration });
      default:
        break;
    }
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
  getters,
  actions,
  mutations,
};
