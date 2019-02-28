import { Commit, ActionTree } from 'vuex';
import graph from '../../graph';
import * as types from '../mutation-types';
import { AxiosResponse } from 'axios';
interface Option {
  key: string;
  label: string;
}
interface Call {
  avgResponseTime: number;
  callType: string;
  cpm: number;
  isAlert: boolean;
  source: string;
  target: string;
}
interface Node {
  apdex: number;
  avgResponseTime: number;
  cpm: number;
  id: string;
  isAlarm: boolean;
  name: string;
  numOfServer: number;
  numOfServerAlarm: number;
  numOfServiceAlarm: number;
  sla: number;
  type: string;
}

export interface State {
  calls: Call[];
  nodes: Node[];
  currentNode: any;
  current: Option;
}

const initState: State = {
  calls: [],
  nodes: [],
  currentNode: {},
  current: {
    key: 'default',
    label: 'default',
  },
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_NODE](state: State, data: any) {
    state.currentNode = data;
  },
  [types.SET_TOPO](state: State, data: any) {
    state.calls = data.calls;
    state.nodes = data.nodes;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_TOPO(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('queryTopo')
    .params(params)
    .then((res: AxiosResponse) => {
      const calls = res.data.data.topo.calls;
      const nodes = res.data.data.topo.nodes;
      const ids = nodes.map((i: any) => i.id);
      const idsS = calls.filter((i: any) => i.detectPoint === 'SERVER').map((b: any) => b.id);
      const idsC = calls.filter((i: any) => i.detectPoint === 'CLIENT').map((b: any) => b.id);
      return graph
        .query('queryTopoInfo')
        .params({...params, ids, idsC, idsS})
        .then((info: AxiosResponse) => {
          const resInfo = info.data.data;
          if (!resInfo.sla) {
            return context.commit(types.SET_TOPO, {calls, nodes});
          }
          for (let i = 0; i < resInfo.sla.values.length; i += 1) {
            for (let j = 0; j < nodes.length; j += 1) {
              if (nodes[j].id === resInfo.sla.values[i].id) {
                nodes[j] = {
                  ...nodes[j],
                  sla: resInfo.sla.values[i].value / 100,
                  cpm: resInfo.nodeCpm.values[i].value,
                  latency: resInfo.nodeLatency.values[i].value,
                };
              }
            }
          }
          if (!resInfo.cpmC) {
            return context.commit(types.SET_TOPO, {calls, nodes});
          }
          for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
            for (let j = 0; j < calls.length; j += 1) {
              if (calls[j].id === resInfo.cpmC.values[i].id) {
                calls[j] = {
                  ...calls[j],
                  cpm: resInfo.cpmC.values[i].value,
                  latency: resInfo.latencyC.values[i].vaule,
                };
              }
            }
          }
          if (!resInfo.cpmS) {
            return context.commit(types.SET_TOPO, {calls, nodes});
          }
          for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
            for (let j = 0; j < calls.length; j += 1) {
              if (calls[j].id === resInfo.cpmS.values[i].id) {
                calls[j] = {
                  ...calls[j],
                  cpm: resInfo.cpmS.values[i].value,
                  latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
                };
              }
            }
          }
          context.commit(types.SET_TOPO, {calls, nodes});
        });
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
