import { Commit, ActionTree } from 'vuex';
import { getTopo } from '@/api/topo';
import * as types from '../mutation-types';

interface Call {
  avgResponseTime: Number;
  callType: String;
  cpm: Number;
  isAlert: Boolean;
  source: String;
  target: String;
}
interface Node{
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

export interface State {
  calls: Call[];
  nodes: Node[];
}

const initState: State = {
  calls: [],
  nodes: [],
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_TOPO](state: State, data: any) {
    state.calls = data.calls;
    state.nodes = data.nodes;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_TOPO(context: { commit: Commit; state: State, rootState: any }) {
    return getTopo(context.rootState.global.duration).then((res) => {
      context.commit(types.SET_TOPO, res.data.data.getClusterTopology);
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
