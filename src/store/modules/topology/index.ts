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
  _calls: Call[];
  _nodes: Node[];
  detectPoints: string[];
  selectedServiceCall: Call | null;
  currentNode: any;
  currentLink: any;
  current: Option;
  mode: boolean;
  getResponseTimeTrend: number[];
  getSLATrend: number[];
  getThroughputTrend: number[];
  responsePercentile: { [key: string]: number[] };
  instanceDependency: {
    calls: Call[];
    nodes: Node[];
  };
  selectedInstanceCall: Call | null;
  instanceDependencyMetrics: { [key: string]: any };
  queryInstanceMetricsType: string;
  serviceThroughput: { Throughput: number[] };
  serviceSLA: { SLA: number[] };
  serviceResponseTime: { ResponseTime: number[] };
  servicePercentile: { [key: string]: number[] };
  serviceApdexScore: { ApdexScore: number[] };
  topoEndpoints: any[];
  topoInstances: any[];
}

const PercentileItem: string[] = ['p50', 'p75', 'p90', 'p95', 'p99'];

const initState: State = {
  callback: '',
  mode: true,
  detectPoints: [],
  selectedServiceCall: null,
  calls: [],
  nodes: [],
  _calls: [],
  _nodes: [],
  currentNode: {},
  currentLink: {},
  current: {
    key: 'default',
    label: 'default',
  },
  getResponseTimeTrend: [],
  getSLATrend: [],
  getThroughputTrend: [],
  responsePercentile: {},
  instanceDependency: {
    calls: [],
    nodes: [],
  },
  selectedInstanceCall: null,
  instanceDependencyMetrics: {},
  queryInstanceMetricsType: '',
  serviceThroughput: { Throughput: [] },
  serviceSLA: { SLA: [] },
  serviceResponseTime: { ResponseTime: [] },
  servicePercentile: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
  },
  serviceApdexScore: { ApdexScore: [] },
  topoEndpoints: [],
  topoInstances: [],
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
  [types.SET_LINK](state: State, data: any) {
    state.currentLink = data;
  },
  [types.SET_TOPO](state: State, data: any) {
    state.calls = data.calls;
    state.nodes = data.nodes;
  },
  [types.SET_TOPO_COPY](state: State, data: any) {
    state._calls = data.calls;
    state._nodes = data.nodes;
  },
  [types.SET_SELECTED_CALL](state: State, data: any) {
    state.selectedServiceCall = data;
  },
  [types.SET_TOPO_RELATION](state: State, data: any) {
    state.getResponseTimeTrend = data.getResponseTimeTrend
      ? data.getResponseTimeTrend.values.map((i: any) => i.value)
      : [];
    state.getSLATrend = data.getSLATrend ? data.getSLATrend.values.map((i: any) => i.value) : [];
    state.getThroughputTrend = data.getThroughputTrend ? data.getThroughputTrend.values.map((i: any) => i.value) : [];

    if (!data.getPercentile) {
      state.responsePercentile = {};
      return;
    }
    data.getPercentile.forEach((item: any, index: number) => {
      state.responsePercentile[PercentileItem[index]] = item.values.map((i: any) => i.value);
    });
  },
  [types.SET_INSTANCE_DEPENDENCY](state: State, data: any) {
    state.instanceDependency = data;
  },
  [types.SET_SELECTED_INSTANCE_CALL](state: State, data: Call) {
    state.selectedInstanceCall = data;
  },
  [types.SET_INSTANCE_DEPEDENCE_METRICS](state: State, data: any) {
    state.instanceDependencyMetrics.getResponseTimeTrend = data.getResponseTimeTrend
      ? data.getResponseTimeTrend.values.map((i: any) => i.value)
      : [];
    state.instanceDependencyMetrics.getSLATrend = data.getSLATrend
      ? data.getSLATrend.values.map((i: any) => i.value)
      : [];
    state.instanceDependencyMetrics.getThroughputTrend = data.getThroughputTrend
      ? data.getThroughputTrend.values.map((i: any) => i.value)
      : [];
    state.instanceDependencyMetrics.percentResponse = {};
    if (!data.getPercentile) {
      return;
    }
    data.getPercentile.forEach((item: any, index: number) => {
      state.instanceDependencyMetrics.percentResponse[PercentileItem[index]] = item.values.map((i: any) => i.value);
    });
  },
  [types.SET_INSTANCE_DEPEDENCE_TYPE](state: State, data: string) {
    state.queryInstanceMetricsType = data;
  },
  [types.SET_SERVICE_DETAIL](state: State, data: any) {
    state.serviceApdexScore = data.serviceApdexScore
      ? data.serviceApdexScore.values.map((i: any) => Number((i.value / 10000).toFixed(2)))
      : [];
    state.serviceResponseTime = data.serviceResponseTime
      ? data.serviceResponseTime.values.map((i: any) => i.value)
      : [];
    state.serviceThroughput = data.serviceThroughput ? data.serviceThroughput.values.map((i: any) => i.value) : [];
    state.serviceSLA = data.serviceSLA ? data.serviceSLA.values.map((i: any) => i.value / 100) : [];
    if (!data.servicePercentile) {
      return;
    }
    data.servicePercentile.forEach((item: any, index: number) => {
      state.servicePercentile[PercentileItem[index]] = item.values.map((i: any) => i.value);
    });
  },
  [types.SET_TOPO_ENDPOINT](state: State, data: any[]) {
    state.topoEndpoints = data;
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(data));
  },
  [types.SET_TOPO_INSTANCE](state: State, data: any[]) {
    state.topoInstances = data;
    window.localStorage.setItem('topologyInstances', JSON.stringify(data));
  },
  [types.EDIT_TOPO_INSTANCE_CONFIG](state: State, params: { values: any; index: number }) {
    state.topoInstances[params.index] = { ...state.topoInstances[params.index], ...params.values };
    window.localStorage.setItem('topologyInstances', JSON.stringify(state.topoInstances));
  },
  [types.EDIT_TOPO_ENDPOINT_CONFIG](state: State, params: { values: any; index: number }) {
    state.topoEndpoints[params.index] = { ...state.topoEndpoints[params.index], ...params.values };
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(state.topoEndpoints));
  },
  [types.DELETE_TOPO_ENDPOINT](state: State, index: number) {
    state.topoEndpoints.splice(index, 1);
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(state.topoEndpoints));
  },
  [types.DELETE_TOPO_INSTANCE](state: State, index: number) {
    state.topoInstances.splice(index, 1);
    window.localStorage.setItem('topologyInstances', JSON.stringify(state.topoInstances));
  },
  [types.ADD_TOPO_INSTANCE_COMP](state: State) {
    const comp = {
      width: 3,
      title: 'Title',
      height: 350,
      entityType: 'ServiceInstance',
      independentSelector: false,
      metricType: 'UNKNOWN',
    };
    state.topoInstances.push(comp);
    window.localStorage.setItem('topologyInstances', JSON.stringify(state.topoInstances));
  },
  [types.ADD_TOPO_ENDPOINT_COMP](state: State) {
    const comp = {
      width: 3,
      title: 'Title',
      height: 350,
      entityType: 'Endpoint',
      independentSelector: false,
      metricType: 'UNKNOWN',
    };
    state.topoEndpoints.push(comp);
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(state.topoEndpoints));
  },
};

// actions
const actions: ActionTree<State, any> = {
  FILTER_TOPO(context: { commit: Commit; state: State }, params: { services: string[]; group: string }) {
    const tempCalls = [...context.state._calls];
    const tempNodes = [...context.state._nodes];
    if (params.group === 'all') {
      context.commit(types.SET_TOPO, { calls: context.state._calls, nodes: context.state._nodes });
      return;
    }
    const nodeInCalls: string[] = [];
    const resultNodes: Node[] = [];
    const resultCalls: Call[] = [];
    tempCalls.forEach((call: any) => {
      if (
        params.services.some((i: string) => call.source.id === i) ||
        params.services.some((i: string) => call.target.id === i)
      ) {
        nodeInCalls.push(call.source.id);
        nodeInCalls.push(call.target.id);
        resultCalls.push(call);
      }
    });
    const setNodes: string[] = Array.from(new Set(nodeInCalls));
    tempNodes.forEach((node: any) => {
      if (setNodes.some((i: string) => node.id === i)) {
        resultNodes.push(node);
      }
    });
    context.commit(types.SET_TOPO, { calls: resultCalls, nodes: resultNodes });
  },
  CLEAR_TOPO(context: { commit: Commit; state: State }) {
    context.commit(types.SET_TOPO, { calls: [], nodes: [] });
    context.commit(types.SET_TOPO_COPY, { calls: [], nodes: [] });
  },
  CLEAR_TOPO_INFO(context: { commit: Commit; state: State }) {
    context.commit(types.SET_TOPO_RELATION, {});
    context.commit(types.SET_SELECTED_CALL, null);
  },
  GET_INSTANCE_DEPENDENCY_METRICS(
    context: { commit: Commit; state: State; dispatch: Dispatch; getters: any },
    params: any,
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
  GET_TOPO_SERVICE_INFO(context: { commit: Commit; state: State }, params: any) {
    if (!params.id) {
      return;
    }
    return graph
      .query('queryTopoServiceInfo')
      .params({
        id: params.id,
        duration: params.duration,
      })
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit('SET_TOPO_RELATION', res.data.data);
        context.commit(types.SET_SELECTED_CALL, params);
      });
  },
  GET_TOPO_CLIENT_INFO(context: { commit: Commit; state: State }, params: any) {
    return graph
      .query('queryTopoClientInfo')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit('SET_TOPO_RELATION', res.data.data);
        context.commit(types.SET_SELECTED_CALL, params);
      });
  },
  GET_TOPO_SERVICE_DETAIL(context: { commit: Commit; state: State }, params: any) {
    return graph
      .query('queryTopoServiceDetail')
      .params({
        serviceId: params.serviceId,
        duration: params.duration,
      })
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit('SET_SERVICE_DETAIL', res.data.data);
      });
  },
  GET_TOPO(context: { commit: Commit; state: State }, params: any) {
    let query = 'queryTopo';
    if (params.serviceId) {
      query = 'queryServiceTopo';
    }
    if (params.serviceIds) {
      query = 'queryServicesTopo';
    }
    return graph
      .query(query)
      .params(params)
      .then((res: AxiosResponse) => {
        if (res.data.errors) {
          context.commit(types.SET_TOPO, { calls: [], nodes: [] });
          return;
        }
        const calls = res.data.data.topo.calls;
        const nodes = res.data.data.topo.nodes;
        const ids = nodes.map((i: any) => i.id);
        const idsC = calls.filter((i: any) => i.detectPoints.indexOf('CLIENT') !== -1).map((b: any) => b.id);
        const idsS = calls.filter((i: any) => i.detectPoints.indexOf('CLIENT') === -1).map((b: any) => b.id);
        return graph
          .query('queryTopoInfo')
          .params({ ...params, ids, idsC, idsS })
          .then((info: AxiosResponse) => {
            const resInfo = info.data.data;
            if (!resInfo.sla) {
              context.commit(types.SET_TOPO_COPY, { calls, nodes });
              return context.commit(types.SET_TOPO, { calls, nodes });
            }
            for (let i = 0; i < resInfo.sla.values.length; i += 1) {
              for (let j = 0; j < nodes.length; j += 1) {
                if (nodes[j].id === resInfo.sla.values[i].id) {
                  nodes[j] = {
                    ...nodes[j],
                    isGroupActive: true,
                    sla: resInfo.sla.values[i].value ? resInfo.sla.values[i].value / 100 : -1,
                    cpm: resInfo.nodeCpm.values[i] ? resInfo.nodeCpm.values[i].value : -1,
                    latency: resInfo.nodeLatency.values[i] ? resInfo.nodeLatency.values[i].value : -1,
                  };
                }
              }
            }
            if (!resInfo.cpmC) {
              context.commit(types.SET_TOPO_COPY, { calls, nodes });
              return context.commit(types.SET_TOPO, { calls, nodes });
            }
            for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
              for (let j = 0; j < calls.length; j += 1) {
                if (calls[j].id === resInfo.cpmC.values[i].id) {
                  calls[j] = {
                    ...calls[j],
                    isGroupActive: true,
                    cpm: resInfo.cpmC.values[i] ? resInfo.cpmC.values[i].value : '',
                    latency: resInfo.latencyC.values[i] ? resInfo.latencyC.values[i].value : '',
                  };
                }
              }
            }
            if (!resInfo.cpmS) {
              context.commit(types.SET_TOPO_COPY, { calls, nodes });
              return context.commit(types.SET_TOPO, { calls, nodes });
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
            context.commit(types.SET_TOPO_COPY, { calls, nodes });
            context.commit(types.SET_TOPO, { calls, nodes });
          });
      });
  },
  async GET_TOPO_INSTANCE_DEPENDENCY(
    context: { commit: Commit; state: State },
    params: {
      clientServiceId: string;
      serverServiceId: string;
      duration: string;
    },
  ) {
    graph
      .query('queryTopoInstanceDependency')
      .params(params)
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
        graph
          .query('queryDependencyInstanceClientMetric')
          .params({
            idsC: clientIdsC,
            duration: params.duration,
          })
          .then((json: AxiosResponse) => {
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
            graph
              .query('queryDependencyInstanceServerMetric')
              .params({
                idsC: serverIdsC,
                duration: params.duration,
              })
              .then((jsonResp: AxiosResponse) => {
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
  INSTANCE_RELATION_INFO(
    context: { commit: Commit; state: State },
    params: Call & { mode: string; queryType: string; durationTime: string },
  ) {
    graph
      .query(params.queryType)
      .params({
        id: params.id,
        duration: params.durationTime,
      })
      .then((res: AxiosResponse) => {
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
