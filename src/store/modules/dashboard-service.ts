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
    state.serviceInfo.p50 = data.getP50.values;
    state.serviceInfo.p75 = data.getP75.values;
    state.serviceInfo.p90 = data.getP90.values;
    state.serviceInfo.p95 = data.getP95.values;
    state.serviceInfo.p99 = data.getP99.values;
    state.serviceInfo.getResponseTimeTrend = data.getResponseTimeTrend.values;
    state.serviceInfo.getSLATrend = data.getSLATrend.values;
    state.serviceInfo.getInstanceThroughput = data.getServiceInstanceThroughput;
    state.serviceInfo.getSlowEndpoint = data.getSlowEndpoint;
    state.serviceInfo.getThroughputTrend = data.getThroughputTrend.values;
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
  GET_SERVICE(context: { commit: Commit, rootState: any }, params: any) {
    return graph
    .query('queryDashBoardService')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_ENDPOINTS, res.data.data.getEndpoints);
      context.commit(types.SET_INSTANCES, res.data.data.getServiceInstances);
      context.commit(types.SET_SERVICE_INFO, res.data.data);
    });
  },
  SELECT_SERVICE(context: { commit: Commit, dispatch: Dispatch }, params: any) {
    context.commit('SET_CURRENT_SERVICE', params);
    context.dispatch('RUN_EVENTS', {}, {root: true});
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
