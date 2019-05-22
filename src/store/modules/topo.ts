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

import { Commit, ActionTree, Dispatch } from 'vuex';
import graph from '../../graph';
import * as types from '../mutation-types';
import { AxiosResponse } from 'axios';
interface Option {
  key: string;
  label: string;
}
interface Call {
  avgResponseTime: number;
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
  callback: any;
  calls: Call[];
  nodes: Node[];
  detectPoints: string[];
  currentNode: any;
  current: Option;
  mode: boolean;
  getResponseTimeTrend: number[];
  getSLATrend: number[];
  getThroughputTrend: number[];
}

const initState: State = {
  callback: '',
  mode: true,
  detectPoints: [],
  calls: [],
  nodes: [],
  currentNode: {},
  current: {
    key: 'default',
    label: 'default',
  },
  getResponseTimeTrend: [],
  getSLATrend: [],
  getThroughputTrend: [],
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_CALLBACK](state: State, data: any) {
    state.callback = data;
  },
  [types.SET_MODE](state: State, data: string[]) {
    state.detectPoints = data;
    const temp = state.mode ? 'SERVER' : 'CLIENT';
    if (data.indexOf(temp) === -1) {
      state.mode = !state.mode;
    }
  },
  [types.SET_MODE_STATUS](state: State, data: boolean) {
    state.mode = data;
  },
  [types.SET_NODE](state: State, data: any) {
    state.currentNode = data;
  },
  [types.SET_TOPO](state: State, data: any) {
    state.calls = data.calls;
    state.nodes = data.nodes;
  },
  [types.SET_TOPO_RELATION](state: State, data: any) {
    state.getResponseTimeTrend = data.getResponseTimeTrend ?
    data.getResponseTimeTrend.values.map((i: any) => i.value) : [];
    state.getSLATrend = data.getSLATrend ? data.getSLATrend.values.map((i: any) => i.value) : [];
    state.getThroughputTrend = data.getThroughputTrend ? data.getThroughputTrend.values.map((i: any) => i.value) : [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  CLEAR_TOPO(context: { commit: Commit; state: State; }) {
    context.commit(types.SET_TOPO, {calls: [], nodes: []});
  },
  CLEAR_TOPO_INFO(context: { commit: Commit; state: State; }) {
    context.commit(types.SET_TOPO_RELATION, {});
  },
  GET_TOPO_SERVICE_INFO(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('queryTopoServiceInfo')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit('SET_TOPO_RELATION', res.data.data);
    });
  },
  GET_TOPO_CLIENT_INFO(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('queryTopoClientInfo')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit('SET_TOPO_RELATION', res.data.data);
    });
  },
  GET_TOPO(context: { commit: Commit; state: State; }, params: any) {
    let query = 'queryTopo';
    if (params.serviceId) {
      query = 'queryServiceTopo';
    }
    return graph
    .query(query)
    .params(params)
    .then((res: AxiosResponse) => {
      const calls = res.data.data.topo.calls;
      const nodes = res.data.data.topo.nodes;
      const ids = nodes.map((i: any) => i.id);
      const idsS = calls.filter((i: any) => i.detectPoints.indexOf('CLIENT') === -1).map((b: any) => b.id);
      const idsC = calls.filter((i: any) => i.detectPoints.indexOf('CLIENT') !== -1).map((b: any) => b.id);
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
                  latency: resInfo.latencyC.values[i].value,
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
