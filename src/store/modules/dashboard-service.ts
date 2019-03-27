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
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import * as types from '../mutation-types';

export interface State {
  services: any;
  serviceInfo: any;
  currentService: any;
}

const initState: State = {
  services: [],
  currentService: {},
  serviceInfo: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
    getResponseTimeTrend: [],
    getSLATrend: [],
    getInstanceThroughput: [],
    getSlowEndpoint: [],
    getThroughputTrend: [],
  },
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_SERVICES](state: State, data: any) {
    state.services = data;
    if (!data.length) { return; }
    if (!state.currentService.key && data.length) {
      state.currentService = data[0];
    }
  },
  [types.SET_SERVICE_INFO](state: State, data: any) {
    state.serviceInfo.p50 = data.getP50 ? data.getP50.values : [];
    state.serviceInfo.p75 = data.getP75 ? data.getP75.values : [];
    state.serviceInfo.p90 = data.getP90 ? data.getP90.values : [];
    state.serviceInfo.p95 = data.getP95 ? data.getP95.values : [];
    state.serviceInfo.p99 = data.getP99 ? data.getP99.values : [];
    state.serviceInfo.getResponseTimeTrend = data.getResponseTimeTrend ? data.getResponseTimeTrend.values : [];
    state.serviceInfo.getSLATrend = data.getSLATrend ? data.getSLATrend.values : [];
    state.serviceInfo.getInstanceThroughput =
    data.getServiceInstanceThroughput ? data.getServiceInstanceThroughput : [];
    state.serviceInfo.getSlowEndpoint = data.getSlowEndpoint ? data.getSlowEndpoint : [];
    state.serviceInfo.getThroughputTrend = data.getThroughputTrend ? data.getThroughputTrend.values : [];
  },
  [types.SET_CURRENT_SERVICE](state: State, service: any) {
    state.currentService = service;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit, rootState: any  }, params: any) {
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_SERVICES, res.data.data.services);
      });
  },
  GET_SERVICE_ENDPOINTS(context: { commit: Commit, state: any }) {
    return graph
      .query('queryEndpoints')
      .params({serviceId: context.state.currentService.key, keyword: ''})
      .then((res: AxiosResponse) => {
        context.commit(types.SET_ENDPOINTS, res.data.data.getEndpoints);
      });
  },
  GET_SERVICE_INSTANCES(context: { commit: Commit, state: any }, params: any) {
    return graph
      .query('queryInstances')
      .params({serviceId: context.state.currentService.key, ...params})
      .then((res: AxiosResponse) => {
        context.commit(types.SET_INSTANCES, res.data.data.getServiceInstances);
      });
  },
  GET_SERVICE(context: { commit: Commit, rootState: any }, params: any) {
    return graph
    .query('queryDashBoardService')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_SERVICE_INFO, res.data.data);
    });
  },
  SELECT_SERVICE(context: { commit: Commit, dispatch: Dispatch }, params: any) {
    context.commit('SET_CURRENT_SERVICE', params.service);
    context.dispatch('MIXHANDLE_GET_OPTION', {...params, compType: 'service'})
    .then(() => {
      context.dispatch('RUN_EVENTS', {}, {root: true});
    });
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
