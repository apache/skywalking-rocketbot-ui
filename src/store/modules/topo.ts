import { Commit, ActionTree } from 'vuex';
import { getTopo, getTopoApp, getClusterBrief } from '@/api/topo';
import * as types from '../mutation-types';
import Axios from 'axios';
interface Option {
  key: String;
  label: String;
}
interface Call {
  avgResponseTime: Number;
  callType: String;
  cpm: Number;
  isAlert: Boolean;
  source: String;
  target: String;
}
interface Node {
  apdex: Number;
  avgResponseTime: Number;
  cpm: Number;
  id: String;
  isAlarm: false;
  name: String;
  numOfServer: Number;
  numOfServerAlarm: Number;
  numOfServiceAlarm: Number;
  sla: Number;
  type: String;
}
interface Cluster {
  numOfApplication: Number;
  numOfService: Number;
  numOfDatabase: Number;
  numOfCache: Number;
  numOfMQ: Number;
}

export interface State {
  calls: Call[];
  nodes: Node[];
  cluster: Cluster;
  current: Option;
}

const initState: State = {
  calls: [],
  nodes: [],
  current: {
    key: 'default',
    label: 'default',
  },
  cluster: {
    numOfApplication: 0,
    numOfCache: 0,
    numOfDatabase: 0,
    numOfMQ: 0,
    numOfService: 0,
  },
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_TOPO](state: State, data: any) {
    state.calls = data.calls;
    state.nodes = data.nodes;
  },
  [types.SET_CLUSTER](state: State, data: Cluster) {
    state.cluster = data;
  },
  [types.SET_TOPO_CURRENT](state: State, data: Option) {
    state.current = data;
  },
  [types.CLEAR_TOPO](state: State) {
    state.calls = [];
    state.nodes = [];
    state.current = {
      key: 'default',
      label: 'default',
    };
  },
};

// actions
const actions: ActionTree<State, any> = {
  SET_TOPO_CURRENT(
    context: { commit: Commit; state: State; rootState: any },
    data: Option,
  ) {
    context.commit(types.SET_TOPO_CURRENT, data);
  },
  GET_TOPO(context: { commit: Commit; state: State; rootState: any }) {
    // getTopo(context.rootState.global.duration);
    return getTopo(context.rootState.global.duration).then((res) => {
      context.commit(types.SET_TOPO, res.data.data.getClusterTopology);
    });
    // context.commit(types.SET_TOPO, data.data.getClusterTopology);
  },
  GET_TOPO_APPLICATION(
    context: { commit: Commit; state: State; rootState: any },
    applicationId: String,
  ) {
    return getTopoApp({
      duration: context.rootState.global.duration,
      applicationId,
    }).then((res) => {
      context.commit(types.SET_TOPO, res.data.data.getClusterTopology);
    });
  },
  GET_CLUSTER(context: { commit: Commit; state: State; rootState: any }) {
    return getClusterBrief(context.rootState.global.duration).then((res) => {
      context.commit(types.SET_CLUSTER, res.data.data.getClusterBrief);
    });
  },
  CLEAR_TOPO(context: { commit: Commit; state: State; rootState: any }) {
    context.commit(types.CLEAR_TOPO);
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
