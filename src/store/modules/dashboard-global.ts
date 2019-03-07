import { Commit, ActionTree, MutationTree } from 'vuex';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import * as types from '../mutation-types';
export interface State {
  global: any;
}

const initState: State = {
  global: {
    getGlobalBrief: {},
    getThermodynamic: [],
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
    getTopNServiceThroughput: [],
    getTopNSlowEndpoint: [],
  },
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_GLOBAL](state: State, data: any) {
    state.global.getGlobalBrief = data.getGlobalBrief;
    state.global.p50 = data.getP50.values;
    state.global.p75 = data.getP75.values;
    state.global.p90 = data.getP90.values;
    state.global.p95 = data.getP95.values;
    state.global.p99 = data.getP99.values;
    state.global.getThermodynamic = data.getThermodynamic.nodes;
    state.global.getTopNServiceThroughput = data.getTopNServiceThroughput;
    state.global.getTopNSlowEndpoint = data.getTopNSlowEndpoint;
  },
};

// actions
const actions: ActionTree<State, any> = {
  SET_CURRENT_STATE(context: { commit: Commit }, params: any) {
    if (params.service) {
      context.commit(types.SET_CURRENT_SERVICE, params.service);
    }
    if (params.endpoint) {
      context.commit(types.SET_CURRENT_ENDPOINT, params.endpoint);
    }
    if (params.instance) {
      context.commit(types.SET_CURRENT_INSTANCE, params.instance);
    }
  },
  GET_GLOBAL(context: { commit: Commit }, params: any) {
    return graph
    .query('queryDashBoardGlobal')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_GLOBAL, res.data.data);
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
