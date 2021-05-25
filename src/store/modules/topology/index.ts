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
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { cancelToken } from '@/utils/cancelToken';

interface Option {
  key: string;
  label: string;
}
export interface Duration {
  start: string;
  end: string;
  step: string;
}
export interface Call {
  avgResponseTime: number;
  cpm: number;
  isAlert: boolean;
  source: string | any;
  target: string | any;
  id: string;
  detectPoints: string[];
  type?: string;
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

export interface EndpointDependencyConidition {
  serviceName: string;
  endpointName: string;
  destServiceName: string;
  destEndpointName: string;
  duration: Duration;
}

export interface State {
  callback: any;
  calls: Call[];
  nodes: Node[];
  detectPoints: string[];
  selectedServiceCall: Call | null;
  currentNode: any;
  currentLink: any;
  current: Option;
  mode: boolean;
  instanceDependency: {
    calls: Call[];
    nodes: Node[];
  };
  endpointDependency: {
    calls: Call[];
    nodes: Node[];
  };
  selectedInstanceCall: Call | null;
  selectedEndpointCall: Call | null;
  endpointDependencyMetrics: { [key: string]: any };
  currentEndpointDepth: { key: number; label: string };
  queryInstanceMetricsType: string;
  topoEndpoints: any[];
  topoInstances: any[];
  topoServices: { [key: string]: any[] };
  topoServicesDependency: { [key: string]: any[] };
  topoServicesInstanceDependency: { [key: string]: any[] };
  instanceDependencyMode: string;
  editDependencyMetrics: boolean;
  topoEndpointDependency: { [key: string]: any[] };
}

const PercentileItem: string[] = ['p50', 'p75', 'p90', 'p95', 'p99'];

const initState: State = {
  callback: '',
  mode: true,
  detectPoints: [],
  selectedServiceCall: null,
  calls: [],
  nodes: [],
  currentNode: {},
  currentLink: {},
  current: {
    key: 'default',
    label: 'default',
  },
  instanceDependency: {
    calls: [],
    nodes: [],
  },
  endpointDependency: {
    calls: [],
    nodes: [],
  },
  selectedInstanceCall: null,
  selectedEndpointCall: null,
  endpointDependencyMetrics: {},
  currentEndpointDepth: { key: 2, label: '2' },
  queryInstanceMetricsType: '',
  topoEndpoints: [],
  topoInstances: [],
  topoServices: {},
  topoServicesDependency: {},
  topoServicesInstanceDependency: {},
  instanceDependencyMode: '',
  editDependencyMetrics: false,
  topoEndpointDependency: {},
};

// getters
const getters = {};

// mutations
const mutations = {
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
  [types.SET_INSTANCE_DEPENDENCY_MODE_STATUS](state: State, data: string) {
    state.instanceDependencyMode = data;
  },
  [types.SET_NODE](state: State, data: Node) {
    state.currentNode = data;
  },
  [types.SET_LINK](state: State, data: Call) {
    state.currentLink = data;
  },
  [types.SET_TOPO](state: State, data: { nodes: Node[]; calls: Call[] }) {
    state.calls = data.calls;
    state.nodes = data.nodes;
  },
  [types.SET_SELECTED_CALL](state: State, data: any) {
    state.selectedServiceCall = data;
  },
  [types.SET_INSTANCE_DEPENDENCY](state: State, data: any) {
    state.instanceDependency = data;
  },
  [types.SET_SELECTED_INSTANCE_CALL](state: State, data: Call) {
    state.selectedInstanceCall = data;
  },
  [types.SET_SELECTED_ENDPOINT_CALL](state: State, data: Call) {
    state.selectedEndpointCall = data;
  },
  [types.SET_TOPO_ENDPOINT](state: State, data: any[]) {
    state.topoEndpoints = data;
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(data));
  },
  [types.SET_TOPO_INSTANCE](state: State, data: any[]) {
    state.topoInstances = data;
    window.localStorage.setItem('topologyInstances', JSON.stringify(data));
  },
  [types.SET_TOPO_SERVICE_DEPENDENCY](state: State, data: any) {
    state.topoServicesDependency = data;
    localStorage.setItem('topologyServicesDependency', JSON.stringify(data));
  },
  [types.SET_TOPO_SERVICE_INSTANCE_DEPENDENCY](state: State, data: any) {
    state.topoServicesInstanceDependency = data;
    localStorage.setItem('topologyServicesInstanceDependency', JSON.stringify(data));
  },
  [types.SET_TOPO_ENDPOINT_DEPENDENCY](state: State, data: any) {
    state.topoEndpointDependency = data;
    localStorage.setItem('topologyEndpointDependency', JSON.stringify(data));
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
  [types.DELETE_TOPO_SERVICE](state: State, index: number) {
    state.topoServices[state.currentNode.type].splice(index, 1);
    window.localStorage.setItem('topologyServices', JSON.stringify(state.topoServices));
  },
  [types.DELETE_TOPO_SERVICE_DEPENDENCY](state: State, index: number) {
    const { source } = state.currentLink;
    const mode: any = state.mode ? 'server' : 'client';

    state.topoServicesDependency[source.type][mode].splice(index, 1);
    window.localStorage.setItem('topologyServicesDependency', JSON.stringify(state.topoServicesDependency));
  },
  [types.DELETE_TOPO_ENDPOINT_DEPENDENCY](state: State, index: number) {
    if (!state.selectedEndpointCall) {
      return;
    }
    const type = state.selectedEndpointCall.type || 'SpringMVC';
    state.topoEndpointDependency[type].splice(index, 1);
    localStorage.setItem('topologyEndpointDependency', JSON.stringify(state.topoEndpointDependency));
  },
  [types.DELETE_TOPO_INSTANCE_DEPENDENCY](state: State, index: number) {
    const { sourceObj } = state.selectedInstanceCall || ({} as any);
    const type = sourceObj.type || 'SpringMVC';
    const mode: any = state.instanceDependencyMode;

    state.topoServicesInstanceDependency[type][mode].splice(index, 1);
    window.localStorage.setItem(
      'topologyServicesInstanceDependency',
      JSON.stringify(state.topoServicesInstanceDependency),
    );
  },
  [types.EDIT_TOPO_SERVICE_CONFIG](state: State, params: { values: any; index: number }) {
    state.topoServices[state.currentNode.type][params.index] = {
      ...state.topoServices[state.currentNode.type][params.index],
      ...params.values,
    };
    window.localStorage.setItem('topologyServices', JSON.stringify(state.topoServices));
  },
  [types.EDIT_ENDPOINT_DEPENDENCY_CONFIG](state: State, params: { values: any; index: number }) {
    if (!state.selectedEndpointCall) {
      return;
    }
    const type = state.selectedEndpointCall.type || 'SpringMVC';

    state.topoEndpointDependency[type][params.index] = {
      ...state.topoEndpointDependency[type][params.index],
      ...params.values,
    };
    localStorage.setItem('topologyEndpointDependency', JSON.stringify(state.topoEndpointDependency));
  },
  [types.EDIT_TOPO_SERVICE_DEPENDENCY_CONFIG](state: State, params: { values: any; index: number }) {
    const { source } = state.currentLink;
    const mode: any = state.mode ? 'server' : 'client';

    if (!(state.topoServicesDependency[source.type] && state.topoServicesDependency[source.type][mode])) {
      return;
    }
    state.topoServicesDependency[source.type][mode][params.index] = {
      ...state.topoServicesDependency[source.type][mode][params.index],
      ...params.values,
    };
    window.localStorage.setItem('topologyServicesDependency', JSON.stringify(state.topoServicesDependency));
  },
  [types.EDIT_TOPO_INSTANCE_DEPENDENCY_CONFIG](state: State, params: { values: any; index: number }) {
    const { sourceObj } = state.selectedInstanceCall || ({} as any);
    const type = sourceObj.type || 'SpringMVC';
    const mode: any = state.instanceDependencyMode;

    if (!(state.topoServicesInstanceDependency[type] && state.topoServicesInstanceDependency[type][mode])) {
      return;
    }
    state.topoServicesInstanceDependency[type][mode][params.index] = {
      ...state.topoServicesInstanceDependency[type][mode][params.index],
      ...params.values,
    };
    localStorage.setItem('topologyServicesInstanceDependency', JSON.stringify(state.topoServicesInstanceDependency));
  },
  [types.ADD_TOPO_INSTANCE_COMP](state: State) {
    const comp = {
      width: 3,
      title: 'Title',
      height: 250,
      entityType: 'ServiceInstance',
      metricType: 'UNKNOWN',
    };
    state.topoInstances.push(comp);
    window.localStorage.setItem('topologyInstances', JSON.stringify(state.topoInstances));
  },
  [types.ADD_TOPO_ENDPOINT_COMP](state: State) {
    const comp = {
      width: 3,
      title: 'Title',
      height: 250,
      entityType: 'Endpoint',
      metricType: 'UNKNOWN',
    };
    state.topoEndpoints.push(comp);
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(state.topoEndpoints));
  },
  [types.ADD_TOPO_SERVICE_COMP](state: State) {
    const comp = {
      width: 12,
      title: 'Title',
      height: 250,
      entityType: 'Service',
      metricType: 'UNKNOWN',
    };
    state.topoServices[state.currentNode.type].push(comp);
    window.localStorage.setItem('topologyServices', JSON.stringify(state.topoServices));
  },
  [types.ADD_TOPO_ENDPOINT_DEPENDENCY_COMP](state: State) {
    if (!state.selectedEndpointCall) {
      return;
    }
    const type = state.selectedEndpointCall.type || 'SpringMVC';
    const comp = {
      width: 3,
      title: 'Title',
      height: 200,
      entityType: 'EndpointRelation',
      metricType: 'UNKNOWN',
    };
    state.topoEndpointDependency[type].push(comp);
    window.localStorage.setItem('topologyEndpointDependency', JSON.stringify(state.topoEndpointDependency));
  },
  [types.ADD_TOPO_SERVICE_DEPENDENCY_COMP](state: State) {
    const { source } = state.currentLink;
    const mode: any = state.mode ? 'server' : 'client';

    if (!(state.topoServicesDependency[source.type] && state.topoServicesDependency[source.type][mode])) {
      return;
    }
    const comp = {
      width: 12,
      title: 'Title',
      height: 250,
      entityType: 'ServiceRelation',
      metricType: 'UNKNOWN',
    };
    state.topoServicesDependency[source.type][mode].push(comp);
    window.localStorage.setItem('topologyServicesDependency', JSON.stringify(state.topoServicesDependency));
  },
  [types.ADD_TOPO_INSTANCE_DEPENDENCY_COMP](state: State) {
    const { sourceObj } = state.selectedInstanceCall || ({} as any);
    const type = sourceObj.type || 'SpringMVC';
    const mode: any = state.instanceDependencyMode;

    if (!(state.topoServicesInstanceDependency[type] && state.topoServicesInstanceDependency[type][mode])) {
      return;
    }
    const comp = {
      width: 12,
      title: 'Title',
      height: 250,
      entityType: 'ServiceInstanceRelation',
      metricType: 'UNKNOWN',
    };
    state.topoServicesInstanceDependency[type][mode].push(comp);
    localStorage.setItem('topologyServicesInstanceDependency', JSON.stringify(state.topoServicesInstanceDependency));
  },
  [types.SET_ENDPOINT_DEPENDENCY](state: State, data: { calls: Call[]; nodes: Node[] }) {
    state.endpointDependency = data;
    state.selectedEndpointCall = null;
  },
  [types.SET_ENDPOINT_DEPTH](state: State, data: { key: number; label: string }) {
    state.currentEndpointDepth = data;
  },
  [types.SET_TOPO_SERVICE](state: State, data: any) {
    state.topoServices = data;
    localStorage.setItem('topologyServices', JSON.stringify(data));
  },
  [types.EDIT_DEPENDENCY_METRICS](state: State, isEdit: boolean) {
    state.editDependencyMetrics = isEdit;
  },
  [types.IMPORT_TREE_SERVICE](state: State, data: any) {
    const keys = Object.keys(data);
    for (const key of keys) {
      if (state.topoServices[key]) {
        state.topoServices[key].push(...data[key]);
      } else {
        state.topoServices[key] = data[key];
      }
    }
    localStorage.setItem('topologyServices', JSON.stringify(state.topoServices));
  },
  [types.IMPORT_TREE_SERVICE_DEPENDENCY](state: State, data: any) {
    const keys = Object.keys(data);
    const modes: any = ['server', 'client'];

    for (const key of keys) {
      if (state.topoServicesDependency[key]) {
        for (const mode of modes) {
          if (state.topoServicesDependency[key][mode]) {
            state.topoServicesDependency[key][mode].push(...data[key][mode]);
          } else {
            state.topoServicesDependency[key][mode] = data[key][mode];
          }
        }
      } else {
        state.topoServicesDependency[key] = data[key];
      }
    }
    localStorage.setItem('topologyServicesDependency', JSON.stringify(state.topoServicesDependency));
  },
  [types.IMPORT_TREE_ENDPOINT_DEPENDENCY](state: State, data: any) {
    const keys = Object.keys(data);

    for (const key of keys) {
      if (state.topoEndpointDependency[key]) {
        state.topoEndpointDependency[key].push(...data[key]);
      } else {
        state.topoEndpointDependency[key] = data[key];
      }
    }
    localStorage.setItem('topologyEndpointDependency', JSON.stringify(state.topoEndpointDependency));
  },
  [types.IMPORT_TREE_INSTANCE_DEPENDENCY](state: State, data: any) {
    const keys = Object.keys(data);
    const modes: any = ['server', 'client'];

    for (const key of keys) {
      if (state.topoServicesInstanceDependency[key]) {
        for (const mode of modes) {
          if (state.topoServicesInstanceDependency[key][mode]) {
            state.topoServicesInstanceDependency[key][mode].push(...data[key][mode]);
          } else {
            state.topoServicesInstanceDependency[key][mode] = data[key][mode];
          }
        }
      } else {
        state.topoServicesInstanceDependency[key] = data[key];
      }
    }
    localStorage.setItem('topologyServicesInstanceDependency', JSON.stringify(state.topoServicesInstanceDependency));
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit }, params: { duration: Duration; keyword: string }) {
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        return res.data.data.services || [];
      });
  },
  GET_SERVICE_ENDPOINTS(context: { commit: Commit }, params: { serviceId: string; keyword: string }) {
    if (!params.serviceId) {
      return new Promise((resolve) => resolve([]));
    }
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryEndpoints')
      .params(params)
      .then((res: AxiosResponse) => {
        return res.data.data.getEndpoints || [];
      });
  },
  CLEAR_TOPO(context: { commit: Commit; state: State }) {
    context.commit(types.SET_TOPO, { calls: [], nodes: [] });
  },
  CLEAR_TOPO_INFO(context: { commit: Commit; state: State }) {
    context.commit(types.SET_SELECTED_CALL, null);
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
        const idsC = calls.filter((i: any) => i.detectPoints.includes('CLIENT')).map((b: any) => b.id);
        const idsS = calls.filter((i: any) => i.detectPoints.includes('CLIENT')).map((b: any) => b.id);
        return graph
          .query('queryTopoInfo')
          .params({ ...params, ids, idsC, idsS })
          .then((info: AxiosResponse) => {
            const resInfo = info.data.data;
            if (!resInfo.sla) {
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
            context.commit(types.SET_TOPO, { calls, nodes });
          });
      });
  },
  // todo sync
  GET_ALL_ENDPOINT_DEPENDENCY(
    context: { commit: Commit; state: State; dispatch: Dispatch },
    params: { endpointIds: string[]; duration: Duration },
  ) {
    context.dispatch('GET_ENDPOINT_TOPO', params).then((res) => {
      if (!res) {
        return;
      }
      if (context.state.currentEndpointDepth.key > 1) {
        const endpointIds = res.nodes.map((item: Node) => item.id);

        context.dispatch('GET_ENDPOINT_TOPO', { endpointIds, duration: params.duration }).then((json) => {
          if (context.state.currentEndpointDepth.key > 2) {
            const ids = json.nodes.map((item: Node) => item.id);

            context.dispatch('GET_ENDPOINT_TOPO', { endpointIds: ids, duration: params.duration }).then((topo) => {
              if (context.state.currentEndpointDepth.key > 3) {
                const endpoints = topo.nodes.map((item: Node) => item.id);
                context
                  .dispatch('GET_ENDPOINT_TOPO', { endpointIds: endpoints, duration: params.duration })
                  .then((data) => {
                    if (context.state.currentEndpointDepth.key > 4) {
                      context
                        .dispatch('GET_ENDPOINT_TOPO', { endpointIds: endpoints, duration: params.duration })
                        .then((topos) => {
                          context.commit(types.SET_ENDPOINT_DEPENDENCY, topos);
                        });
                    } else {
                      context.commit(types.SET_ENDPOINT_DEPENDENCY, data);
                    }
                  });
              } else {
                context.commit(types.SET_ENDPOINT_DEPENDENCY, topo);
              }
            });
          } else {
            context.commit(types.SET_ENDPOINT_DEPENDENCY, json);
          }
        });
      } else {
        context.commit(types.SET_ENDPOINT_DEPENDENCY, res);
      }
    });
  },
  GET_ENDPOINT_TOPO(context: { commit: Commit; state: State }, params: { endpointIds: string[]; duration: Duration }) {
    const variables = ['$duration: Duration!'];
    const fragment = params.endpointIds.map((id: string, index: number) => {
      return `endpointTopology${index}: getEndpointDependencies(endpointId: "${id}", duration: $duration) {
        nodes {
          id
          name
          serviceId
          serviceName
          type
          isReal
        }
        calls {
          id
          source
          target
          detectPoints
        }
      }`;
    });
    const querys = `query queryData(${variables}) {${fragment}}`;
    return axios
      .post('/graphql', { query: querys, variables: { duration: params.duration } }, { cancelToken: cancelToken() })
      .then((res: AxiosResponse) => {
        if (res.data.errors) {
          context.commit(types.SET_ENDPOINT_DEPENDENCY, { calls: [], nodes: [] });
          return;
        }
        const topo = res.data.data;
        const calls = [] as any;
        let nodes = [] as any;
        for (const key of Object.keys(topo)) {
          calls.push(...topo[key].calls);
          nodes.push(...topo[key].nodes);
        }
        if (!nodes.length) {
          context.commit(types.SET_ENDPOINT_DEPENDENCY, { calls: [], nodes: [] });
          return;
        }
        const obj = {} as any;
        nodes = nodes.reduce((prev: Node[], next: Node) => {
          if (!obj[next.id]) {
            obj[next.id] = true;
            prev.push(next);
          }
          return prev;
        }, []);
        const queryVariables = ['$duration: Duration!'];
        const fragments = calls
          .map((call: Call & EndpointDependencyConidition, index: number) => {
            let source = {} as any;
            let target = {} as any;
            for (const node of nodes) {
              if (node.id === call.source) {
                source = node;
                call.serviceName = node.serviceName;
                call.endpointName = node.name;
              }
              if (node.id === call.target) {
                target = node;
                call.destServiceName = node.serviceName;
                call.destEndpointName = node.name;
              }
            }
            return `cpm_${index}: readMetricsValue(condition: {
            name: "endpoint_relation_cpm"
            entity: {
              scope: EndpointRelation
              serviceName: "${source.serviceName}"
              normal: true
              endpointName: "${source.name}"
              destNormal: true
              destServiceName: "${target.serviceName}"
              destEndpointName: "${target.name}"
            }
          }, duration: $duration)`;
          })
          .join(' ');
        const query = `query queryData(${queryVariables}) {${fragments}}`;
        return axios
          .post('/graphql', { query, variables: { duration: params.duration } }, { cancelToken: cancelToken() })
          .then((json: AxiosResponse<any>) => {
            if (json.data.errors) {
              context.commit(types.SET_ENDPOINT_DEPENDENCY, { calls: [], nodes: [] });
              return;
            }
            const cpms = json.data.data;
            const keys = Object.keys(cpms);
            for (const key of keys) {
              const index = Number(key.split('_')[1]);
              calls[index].value = cpms[key] || 0.01;
            }
            return { calls, nodes };
          })
          .catch(() => {
            context.commit(types.SET_ENDPOINT_DEPENDENCY, { calls: [], nodes: [] });
          });
      });
  },
  GET_TOPO_INSTANCE_DEPENDENCY(
    context: { commit: Commit; state: State },
    params: {
      clientServiceId: string;
      serverServiceId: string;
      duration: Duration;
    },
  ) {
    graph
      .query('queryTopoInstanceDependency')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!(res.data && res.data.data)) {
          return;
        }
        const clientIdsC = [] as string[];
        const serverIdsC = [] as string[];
        const topoCalls = res.data.data.topo.calls;
        for (const call of topoCalls) {
          if (call.detectPoints.includes('CLIENT')) {
            clientIdsC.push(call.id);
          } else {
            serverIdsC.push(call.id);
          }
        }
        let callback;
        let callbackServer;
        if (clientIdsC.length) {
          callback = graph
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
              return clientCalls;
            });
        } else {
          callback = new Promise((resolve) => resolve([]));
        }
        if (serverIdsC.length) {
          callbackServer = graph
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
              return serverCalls;
            });
        } else {
          callbackServer = new Promise((resolve) => resolve([]));
        }
        Promise.all([callback, callbackServer]).then((values: any) => {
          const instanceDependency = {
            nodes: res.data.data.topo.nodes,
            calls: [...values[0], ...values[1]],
          };
          for (const call of instanceDependency.calls) {
            for (const node of instanceDependency.nodes) {
              if (call.source === node.id) {
                call.sourceObj = node;
              }
              if (call.target === node.id) {
                call.targetObj = node;
              }
            }
          }
          context.commit(types.SET_INSTANCE_DEPENDENCY, instanceDependency);
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
