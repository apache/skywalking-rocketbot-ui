import { Commit, ActionTree, MutationTree, Dispatch } from 'vuex';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import * as types from '../mutation-types';

export interface State {
  endpoints: any;
  endpointInfo: any;
  currentEndpoint: any;
}

const initState: State = {
  endpoints: [],
  currentEndpoint: {},
  endpointInfo: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
    getResponseTimeTrend: [],
    getSLATrend: [],
    getThroughputTrend: [],
    queryBasicTraces: [],
  },
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_ENDPOINTS](state: State, data: any) {
    state.endpoints = data;
    if (!data.length) { return; }
    if ((!state.currentEndpoint.key && data.length) || state.endpoints.indexOf(state.currentEndpoint) === -1 ) {
      state.currentEndpoint = data[0];
    }
  },
  [types.SET_CURRENT_ENDPOINT](state: State, endpoint: any) {
    state.currentEndpoint = endpoint;
  },
  [types.SET_ENDPOINT_INFO](state: State, data: any) {
    state.endpointInfo.p50 = data.getP50 ? data.getP50.values : [];
    state.endpointInfo.p75 = data.getP75 ? data.getP75.values : [];
    state.endpointInfo.p90 = data.getP90 ? data.getP90.values : [];
    state.endpointInfo.p95 = data.getP95 ? data.getP95.values : [];
    state.endpointInfo.p99 = data.getP99 ? data.getP99.values : [];
    state.endpointInfo.getResponseTimeTrend =
    data.getEndpointResponseTimeTrend ? data.getEndpointResponseTimeTrend.values : [];
    state.endpointInfo.getSLATrend = data.getEndpointSLATrend ? data.getEndpointSLATrend.values : [];
    state.endpointInfo.getThroughputTrend =
    data.getEndpointThroughputTrend ? data.getEndpointThroughputTrend.values : [];
    state.endpointInfo.queryBasicTraces = data.queryBasicTraces ? data.queryBasicTraces.traces : [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_ENDPOINTS(context: { commit: Commit }, params: any) {
    return graph
    .query('queryEndpoints')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_ENDPOINTS, res.data.data.endpoints);
    });
  },
  GET_ENDPOINT(context: { commit: Commit }, params: any) {
    return graph
    .query('queryDashBoardEndpoint')
    .params({
      ...params,
      traceCondition: {
        endpointId: params.endpointId,
        endpointName: params.endpointName,
        paging: {pageNum: 1, pageSize: 20, needTotal: false},
        queryDuration: params.duration,
        queryOrder: 'BY_DURATION',
        traceState: 'ALL',
      }})
    .then((res: AxiosResponse) => {
      context.commit(types.SET_ENDPOINT_INFO, res.data.data);
    });
  },
  SELECT_ENDPOINT(context: { commit: Commit, dispatch: Dispatch }, params: any) {
    context.commit('SET_CURRENT_ENDPOINT', params.endpoint);
    context.dispatch('GET_ENDPOINT', {
        duration: params.duration,
        endpointId: params.endpoint.key,
        endpointName: params.endpoint.label,
    });
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
