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
import graph from '@/graph';
import * as types from '../../mutation-types';
import { AxiosResponse } from 'axios';

interface Option {
  key: string;
  label: string;
}
interface Call {
  avgResponseTime: number;
  cpm: number;
  isAlert: boolean;
  source: string | any;
  target: string | any;
  id: string;
  detectPoints: string[];
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
  selectedServiceCall: Call | null;
  currentNode: any;
  current: Option;
  mode: boolean;
  getResponseTimeTrend: number[];
  getSLATrend: number[];
  getThroughputTrend: number[];
  responsePercentile: {[key: string]: number[]};
  honeycombNode: any;
  showAlarmDialog: boolean;
  showTraceDialog: boolean;
  showInstancesDialog: boolean;
  showEndpointDialog: boolean;
  instanceDependency: {
    calls: Call[];
    nodes: Node[];
  };
  selectedInstanceCall: Call | null;
  instanceDependencyMetrics: {[key: string]: any};
  queryInstanceMetricsType: string;
}

const initState: State = {
  callback: '',
  mode: true,
  detectPoints: [],
  selectedServiceCall: null,
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
  responsePercentile: {},
  honeycombNode: {},
  showAlarmDialog: false,
  showTraceDialog: false,
  showInstancesDialog: false,
  showEndpointDialog: false,
  instanceDependency: {
    calls: [],
    nodes: [],
  },
  selectedInstanceCall: null,
  instanceDependencyMetrics: {},
  queryInstanceMetricsType: '',
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_HONEYCOMB_NODE](state: State, data: any) {
    state.honeycombNode = data;
  },
  [types.SET_SHOW_ALARM_DIALOG](state: State, isShow: boolean) {
    state.showAlarmDialog = isShow;
  },
  [types.SET_SHOW_TRACE_DIALOG](state: State, isShow: boolean) {
    state.showTraceDialog = isShow;
  },
  [types.SET_SHOW_INSTANCES_DIALOG](state: State, isShow: boolean) {
    state.showInstancesDialog = isShow;
  },
  [types.SET_SHOW_ENDPOINT_DIALOG](state: State, isShow: boolean) {
    state.showEndpointDialog = isShow;
  },
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
  [types.SET_SELECTED_CALL](state: State, data: any) {
    state.selectedServiceCall = data;
  },
  [types.SET_TOPO_RELATION](state: State, data: any) {
    state.getResponseTimeTrend = data.getResponseTimeTrend ?
    data.getResponseTimeTrend.values.map((i: any) => i.value) : [];
    state.getSLATrend = data.getSLATrend ? data.getSLATrend.values.map((i: any) => i.value) : [];
    state.getThroughputTrend = data.getThroughputTrend ? data.getThroughputTrend.values.map((i: any) => i.value) : [];
    state.responsePercentile.p50 = data.p50 ? data.p50.values.map((i: any) => i.value) : [];
    state.responsePercentile.p75 = data.p75 ? data.p75.values.map((i: any) => i.value) : [];
    state.responsePercentile.p90 = data.p90 ? data.p90.values.map((i: any) => i.value) : [];
    state.responsePercentile.p95 = data.p95 ? data.p95.values.map((i: any) => i.value) : [];
    state.responsePercentile.p99 = data.p99 ? data.p99.values.map((i: any) => i.value) : [];
  },
  [types.SET_INSTANCE_DEPENDENCY](state: State, data: any) {
    state.instanceDependency = data;
  },
  [types.SET_SELECTED_INSTANCE_CALL](state: State, data: Call) {
    state.selectedInstanceCall = data;
  },
  [types.SET_INSTANCE_DEPEDENCE_METRICS](state: State, data: any) {
    state.instanceDependencyMetrics.getResponseTimeTrend = data.getResponseTimeTrend ?
    data.getResponseTimeTrend.values.map((i: any) => i.value) : [];
    state.instanceDependencyMetrics.getSLATrend = data.getSLATrend ?
    data.getSLATrend.values.map((i: any) => i.value) : [];
    state.instanceDependencyMetrics.getThroughputTrend = data.getThroughputTrend ?
    data.getThroughputTrend.values.map((i: any) => i.value) : [];
    state.instanceDependencyMetrics.percentResponse = {};
    state.instanceDependencyMetrics.percentResponse.p50 = data.p50 ? data.p50.values.map((i: any) => i.value) : [];
    state.instanceDependencyMetrics.percentResponse.p75 = data.p75 ? data.p75.values.map((i: any) => i.value) : [];
    state.instanceDependencyMetrics.percentResponse.p90 = data.p90 ? data.p90.values.map((i: any) => i.value) : [];
    state.instanceDependencyMetrics.percentResponse.p95 = data.p95 ? data.p95.values.map((i: any) => i.value) : [];
    state.instanceDependencyMetrics.percentResponse.p99 = data.p99 ? data.p99.values.map((i: any) => i.value) : [];
  },
  [types.SET_INSTANCE_DEPEDENCE_TYPE](state: State, data: string) {
    state.queryInstanceMetricsType = data;
  },
};

// actions
const actions: ActionTree<State, any> = {
  CLEAR_TOPO(context: { commit: Commit; state: State; }) {
    context.commit(types.SET_TOPO, {calls: [], nodes: []});
  },
  CLEAR_TOPO_INFO(context: { commit: Commit; state: State; }) {
    context.commit(types.SET_TOPO_RELATION, {});
    context.commit(types.SET_SELECTED_CALL, null);
  },
  GET_INSTANCE_DEPENDENCY_METRICS(
    context: { commit: Commit; state: State, dispatch: Dispatch, getters: any}, params: any,
  ) {
    if (params.mode === 'SERVER') {
      params.queryType = 'queryTopoInstanceServerInfo';
      context.dispatch('INSTANCE_RELATION_INFO', params);
    }
    if (params.mode === 'CLIENT') {
      params.queryType = 'queryTopoInstanceClientInfo';
      context.dispatch('INSTANCE_RELATION_INFO', params);
    }
  },
  GET_TOPO_SERVICE_INFO(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('queryTopoServiceInfo')
    .params({
      id: params.id,
      duration: params.duration,
    })
    .then((res: AxiosResponse) => {
      context.commit('SET_TOPO_RELATION', res.data.data);
      context.commit(types.SET_SELECTED_CALL, params);
    });
  },
  GET_TOPO_CLIENT_INFO(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('queryTopoClientInfo')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit('SET_TOPO_RELATION', res.data.data);
      context.commit(types.SET_SELECTED_CALL, params);
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
                  sla: resInfo.sla.values[i].value ? resInfo.sla.values[i].value / 100 : -1,
                  cpm: resInfo.nodeCpm.values[i] ? resInfo.nodeCpm.values[i].value : -1,
                  latency: resInfo.nodeLatency.values[i] ? resInfo.nodeLatency.values[i].value : -1,
                  p50: resInfo.p50 && resInfo.p50.values[i] ? resInfo.p50.values[i].value : 0,
                  p75: resInfo.p75 && resInfo.p75.values[i] ? resInfo.p75.values[i].value : 0,
                  p90: resInfo.p90 && resInfo.p90.values[i] ? resInfo.p90.values[i].value : 0,
                  p95: resInfo.p95 && resInfo.p95.values[i] ? resInfo.p95.values[i].value : 0,
                  p99: resInfo.p95 && resInfo.p95.values[i] ? resInfo.p95.values[i].value : 0,
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
                  cpm: resInfo.cpmC.values[i] ? resInfo.cpmC.values[i].value : '',
                  latency: resInfo.latencyC.values[i] ? resInfo.latencyC.values[i].value : '',
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
                  cpm: resInfo.cpmS.values[i] ? resInfo.cpmS.values[i].value : '',
                  latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
                };
              }
            }
          }
          context.commit(types.SET_TOPO, {calls, nodes});
        });
    });
  },
  async GET_TOPO_INSTANCE_DEPENDENCY(context: { commit: Commit; state: State; }, params: {
    clientServiceId: string, serverServiceId: string, duration: string}) {

    graph.query('queryTopoInstanceDependency').params(params)
      .then((res: AxiosResponse) => {
        if (!(res.data && res.data.data)) {
          return;
        }
        const serverIdsC = [] as string[];
        const clientIdsC = [] as string[];
        const topoCalls = res.data.data.topo.calls;
        for (const call of topoCalls) {
          if (call.detectPoints.includes('CLIENT')) {
            clientIdsC.push(call.id);
          } else {
            serverIdsC.push(call.id);
          }
        }
        graph.query('queryDependencyInstanceClientMetric').params({
          idsC: clientIdsC,
          duration: params.duration,
        }).then((json: AxiosResponse) => {
          const clientCalls = [] as string[];
          for (const call of topoCalls) {
            for (const cpm of json.data.data.cpmC.values) {
              if (cpm.id === call.id) {
                clientCalls.push({
                  ...call,
                  ...cpm,
                });
              }
            }
          }
          graph.query('queryDependencyInstanceServerMetric').params({
            idsC: serverIdsC,
            duration: params.duration,
          }).then((jsonResp: AxiosResponse) => {
            const serverCalls = [] as string[];
            for (const call of topoCalls) {
              for (const cpm of jsonResp.data.data.cpmC.values) {
                if (cpm.id === call.id) {
                  serverCalls.push({
                    ...call,
                    ...cpm,
                  });
                }
              }
            }
            const data = {
              nodes: res.data.data.topo.nodes,
              calls: [...serverCalls, ...clientCalls],
            };
            context.commit(types.SET_INSTANCE_DEPENDENCY, data);
          });
        });
      });
  },
  INSTANCE_RELATION_INFO(context: { commit: Commit; state: State; }, params: Call &
    {mode: string; queryType: string; durationTime: string}) {
    graph.query(params.queryType).params({
      id: params.id,
      duration: params.durationTime,
    }).then((res: AxiosResponse) => {
      if (!(res.data && res.data.data)) {
        return;
      }
      context.commit(types.SET_SELECTED_INSTANCE_CALL, params);
      context.commit(types.SET_INSTANCE_DEPEDENCE_TYPE, params.mode);
      context.commit(types.SET_INSTANCE_DEPEDENCE_METRICS, res.data.data);
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
