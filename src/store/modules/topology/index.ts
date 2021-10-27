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
import { Call, Node, EndpointDependencyConidition } from '@/types/topo';
import { Duration, Option } from '@/types/global';
import { DEFAULT, TopologyType } from '@/constants/constant';
import { uuid } from '@/utils/uuid';
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
  topoEndpoints: { [key: string]: any[] };
  topoInstances: { [key: string]: any[] };
  topoServices: { [key: string]: any[] };
  topoServicesDependency: { [key: string]: any[] };
  topoServicesInstanceDependency: { [key: string]: any[] };
  topoEndpointDependency: { [key: string]: any[] };
  instanceDependencyMode: string;
  editDependencyMetrics: boolean;
  topoTemplatesType: { [key: string]: any };
  endpointErrors: string;
  getTopoErrors: string;
  endpointTopoErrors: string;
  instanceTopoErrors: string;
  topoErrors: { [key: string]: string };
}

const DefaultConfig = {
  width: 12,
  title: 'Title',
  height: 250,
  metricType: 'UNKNOWN',
};

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
  topoEndpoints: {},
  topoInstances: {},
  topoServices: {},
  topoServicesDependency: {},
  topoServicesInstanceDependency: {},
  instanceDependencyMode: '',
  editDependencyMetrics: false,
  topoEndpointDependency: {},
  topoTemplatesType: JSON.parse(localStorage.getItem('topoTemplateTypes') || JSON.stringify({})),
  endpointErrors: '',
  getTopoErrors: '',
  endpointTopoErrors: '',
  instanceTopoErrors: '',
  topoErrors: {},
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
  [types.SET_TOPO_ENDPOINT](state: State, data: { [key: string]: unknown[] }) {
    state.topoEndpoints = data;
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(data));
  },
  [types.SET_TOPO_INSTANCE](state: State, data: { [key: string]: unknown[] }) {
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
  [types.DELETE_TOPO_ENDPOINT](state: State, id: string) {
    const serviceTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_ENDPOINT] || {};
    const temps = serviceTemplateType[state.currentNode.type || DEFAULT] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoEndpoints[type.key].findIndex((d) => d.uuid === id);
      if (index > -1) {
        state.topoEndpoints[type.key].splice(index, 1);
        localStorage.setItem('topologyEndpoints', JSON.stringify(state.topoEndpoints));
      }
    }
  },
  [types.DELETE_TOPO_INSTANCE](state: State, id: string) {
    const instanceTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_INSTANCE] || {};
    const temps = instanceTemplateType[state.currentNode.type || DEFAULT] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoInstances[type.key].findIndex((d) => d.uuid === id);
      if (index > -1) {
        state.topoInstances[type.key].splice(index, 1);
        window.localStorage.setItem('topologyInstances', JSON.stringify(state.topoInstances));
      }
    }
  },
  [types.DELETE_TOPO_SERVICE](state: State, id: string) {
    const serviceTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE] || {};
    const temps = serviceTemplateType[state.currentNode.type || DEFAULT] || [{ key: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoServices[type.key].findIndex((d) => d.uuid === id);
      if (index > -1) {
        state.topoServices[type.key].splice(index, 1);
        localStorage.setItem('topologyServices', JSON.stringify(state.topoServices));
      }
    }
  },
  [types.DELETE_TOPO_SERVICE_DEPENDENCY](state: State, id: string) {
    if (!state.selectedServiceCall) {
      return;
    }
    const typeCall = state.selectedServiceCall.source.type || DEFAULT;
    const serviceDependencyTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_DEPENDENCY] || {};
    const temps =
      serviceDependencyTemplateType[typeCall] ||
      serviceDependencyTemplateType[DEFAULT] || [{ key: DEFAULT, label: DEFAULT }] ||
      [];
    const mode: any = state.mode ? 'server' : 'client';
    let index = -1;

    for (const type of temps) {
      index = state.topoServicesDependency[type.key][mode].findIndex((d: any) => d.uuid === id);
      if (index > -1) {
        state.topoServicesDependency[type.key][mode].splice(index, 1);
        localStorage.setItem('topologyServicesDependency', JSON.stringify(state.topoServicesDependency));
      }
    }
  },
  [types.DELETE_TOPO_ENDPOINT_DEPENDENCY](state: State, id: string) {
    if (!state.selectedEndpointCall) {
      return;
    }
    const typeCall = state.selectedEndpointCall.type || DEFAULT;
    const serviceDependencyTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY] || {};
    const temps = serviceDependencyTemplateType[typeCall] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoEndpointDependency[type.key].findIndex((d) => d.uuid === id);
      if (index > -1) {
        state.topoEndpointDependency[type.key].splice(index, 1);
        localStorage.setItem('topologyEndpointDependency', JSON.stringify(state.topoEndpointDependency));
      }
    }
  },
  [types.DELETE_TOPO_INSTANCE_DEPENDENCY](state: State, id: string) {
    const { sourceObj } = state.selectedInstanceCall || ({} as any);
    const typeCall = sourceObj.type || DEFAULT;
    const mode: any = state.instanceDependencyMode;
    const serviceDependencyTemplateType =
      state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY] || {};
    const temps = serviceDependencyTemplateType[typeCall] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoServicesInstanceDependency[type.key][mode].findIndex((d: any) => d.uuid === id);
      if (index > -1) {
        state.topoServicesInstanceDependency[type.key][mode].splice(index, 1);
        localStorage.setItem(
          'topologyServicesInstanceDependency',
          JSON.stringify(state.topoServicesInstanceDependency),
        );
      }
    }
  },
  [types.EDIT_TOPO_INSTANCE_CONFIG](state: State, params: { values: any; index: number; uuid: string }) {
    const templateType = state.topoTemplatesType[TopologyType.TOPOLOGY_INSTANCE] || {};
    const temps = templateType[state.currentNode.type] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoInstances[type.key].findIndex((d) => d.uuid === params.uuid);
      if (index > -1) {
        state.topoInstances[type.key][params.index] = {
          ...state.topoInstances[type.key][params.index],
          ...params.values,
        };
        localStorage.setItem('topologyInstances', JSON.stringify(state.topoInstances));
      }
    }
  },
  [types.EDIT_TOPO_ENDPOINT_CONFIG](state: State, params: { values: any; index: number; uuid: string }) {
    const templateType = state.topoTemplatesType[TopologyType.TOPOLOGY_INSTANCE] || {};
    const temps = templateType[state.currentNode.type] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoEndpoints[type.key].findIndex((d) => d.uuid === params.uuid);
      if (index > -1) {
        state.topoEndpoints[type.key][params.index] = {
          ...state.topoEndpoints[type.key][params.index],
          ...params.values,
        };
        localStorage.setItem('topologyEndpoints', JSON.stringify(state.topoEndpoints));
      }
    }
  },
  [types.EDIT_TOPO_SERVICE_CONFIG](state: State, params: { values: any; index: number; uuid: string }) {
    const serviceTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE] || {};
    const temps = serviceTemplateType[state.currentNode.type] || [{ key: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoServices[type.key].findIndex((d) => d.uuid === params.uuid);
      if (index > -1) {
        state.topoServices[type.key][params.index] = {
          ...state.topoServices[type.key][params.index],
          ...params.values,
        };
        window.localStorage.setItem('topologyServices', JSON.stringify(state.topoServices));
      }
    }
  },
  [types.EDIT_ENDPOINT_DEPENDENCY_CONFIG](state: State, params: { values: any; index: number; uuid: string }) {
    if (!state.selectedEndpointCall) {
      return;
    }
    const endpointTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY] || {};
    const temps = endpointTemplateType[state.selectedEndpointCall.type || DEFAULT] || [
      { key: DEFAULT, label: DEFAULT },
    ];
    let index = -1;

    for (const type of temps) {
      index = state.topoEndpointDependency[type.key].findIndex((d) => d.uuid === params.uuid);
      if (index > -1) {
        state.topoEndpointDependency[type.key][index] = {
          ...state.topoEndpointDependency[type.key][index],
          ...params.values,
        };
        localStorage.setItem('topologyEndpointDependency', JSON.stringify(state.topoEndpointDependency));
      }
    }
  },
  [types.EDIT_TOPO_SERVICE_DEPENDENCY_CONFIG](state: State, params: { values: any; index: number; uuid: string }) {
    const { source } = state.currentLink;
    const mode: any = state.mode ? 'server' : 'client';
    const serviceEndpointTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_DEPENDENCY] || {};
    const temps = serviceEndpointTemplateType[source.type || DEFAULT] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoServicesDependency[type.key][mode].findIndex((d: any) => d.uuid === params.uuid);
      if (index > -1) {
        state.topoServicesDependency[type.key][mode][params.index] = {
          ...state.topoServicesDependency[type.key][mode][params.index],
          ...params.values,
        };
        localStorage.setItem('topologyServicesDependency', JSON.stringify(state.topoServicesDependency));
      }
    }
  },
  [types.EDIT_TOPO_INSTANCE_DEPENDENCY_CONFIG](state: State, params: { values: any; index: number; uuid: string }) {
    const { sourceObj } = state.selectedInstanceCall || ({} as any);
    const typeCall = sourceObj.type || DEFAULT;
    const mode: any = state.instanceDependencyMode;

    if (!(state.topoServicesInstanceDependency[typeCall] && state.topoServicesInstanceDependency[typeCall][mode])) {
      return;
    }
    const endpointTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY] || {};
    const temps = endpointTemplateType[typeCall] || [{ key: DEFAULT, label: DEFAULT }];
    let index = -1;

    for (const type of temps) {
      index = state.topoServicesInstanceDependency[type.key][mode].findIndex((d: any) => d.uuid === params.uuid);
      if (index > -1) {
        state.topoServicesInstanceDependency[type.key][mode][params.index] = {
          ...state.topoServicesInstanceDependency[type.key][mode][params.index],
          ...params.values,
        };
        localStorage.setItem(
          'topologyServicesInstanceDependency',
          JSON.stringify(state.topoServicesInstanceDependency),
        );
      }
    }
  },
  [types.ADD_TOPO_INSTANCE_COMP](state: State) {
    const serviceTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE] || {};
    const temps = serviceTemplateType[state.currentNode.type] || [{ key: DEFAULT }];
    const type = temps[temps.length - 1 || 0].key;
    const comp = {
      ...DefaultConfig,
      width: 3,
      uuid: uuid(),
      entityType: 'ServiceInstance',
    };

    state.topoInstances[type].push(comp);
    window.localStorage.setItem('topologyInstances', JSON.stringify(state.topoInstances));
  },
  [types.ADD_TOPO_ENDPOINT_COMP](state: State) {
    const serviceTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE] || {};
    const temps = serviceTemplateType[state.currentNode.type] || [{ key: DEFAULT }];
    const type = temps[temps.length - 1 || 0].key;
    const comp = {
      ...DefaultConfig,
      width: 3,
      uuid: uuid(),
      entityType: 'Endpoint',
    };

    state.topoEndpoints[type].push(comp);
    window.localStorage.setItem('topologyEndpoints', JSON.stringify(state.topoEndpoints));
  },
  [types.ADD_TOPO_SERVICE_COMP](state: State) {
    const serviceTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE] || {};
    const temps = serviceTemplateType[state.currentNode.type] || [{ key: DEFAULT }];
    const type = temps[temps.length - 1 || 0].key;
    const comp = {
      ...DefaultConfig,
      entityType: 'Service',
      uuid: uuid(),
    };
    state.topoServices[type].push(comp);
    window.localStorage.setItem('topologyServices', JSON.stringify(state.topoServices));
  },
  [types.ADD_TOPO_ENDPOINT_DEPENDENCY_COMP](state: State) {
    if (!state.selectedEndpointCall) {
      return;
    }
    const callType = state.selectedEndpointCall.type || DEFAULT;
    const endpointDependencyTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_ENDPOINT_DEPENDENCY] || {};
    const temps = endpointDependencyTemplateType[callType] || [{ key: DEFAULT, label: DEFAULT }];
    const type = temps[temps.length - 1 || 0].key;
    const comp = {
      ...DefaultConfig,
      height: 200,
      width: 3,
      uuid: uuid(),
      entityType: 'EndpointRelation',
    };

    state.topoEndpointDependency[type].push(comp);
    localStorage.setItem('topologyEndpointDependency', JSON.stringify(state.topoEndpointDependency));
  },
  [types.ADD_TOPO_SERVICE_DEPENDENCY_COMP](state: State) {
    if (!state.selectedServiceCall) {
      return;
    }
    const sourceType = state.selectedServiceCall.source.type || DEFAULT;
    const serviceDependencyTemplateType = state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_DEPENDENCY] || {};
    const temps = serviceDependencyTemplateType[sourceType] || serviceDependencyTemplateType[DEFAULT] || [];
    const type = temps[temps.length - 1 || 0] ? temps[temps.length - 1 || 0].key : [DEFAULT];
    const mode: any = state.mode ? 'server' : 'client';

    if (!(state.topoServicesDependency[type] && state.topoServicesDependency[type][mode])) {
      return;
    }
    const comp = {
      ...DefaultConfig,
      uuid: uuid(),
      entityType: 'ServiceRelation',
    };
    state.topoServicesDependency[type][mode].push(comp);
    window.localStorage.setItem('topologyServicesDependency', JSON.stringify(state.topoServicesDependency));
  },
  [types.ADD_TOPO_INSTANCE_DEPENDENCY_COMP](state: State) {
    if (!state.selectedInstanceCall) {
      return;
    }
    const sourceType = state.selectedInstanceCall.sourceObj.type || DEFAULT;
    const serviceDependencyTemplateType =
      state.topoTemplatesType[TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY] || {};
    const temps = serviceDependencyTemplateType[sourceType] || [{ key: DEFAULT, label: DEFAULT }];
    const type = temps[temps.length - 1 || 0].key;
    const mode: any = state.instanceDependencyMode;

    if (!(state.topoServicesInstanceDependency[type] && state.topoServicesInstanceDependency[type][mode])) {
      return;
    }
    const comp = {
      ...DefaultConfig,
      uuid: uuid(),
      entityType: 'ServiceInstanceRelation',
    };
    state.topoServicesInstanceDependency[type][mode].push(comp);
    localStorage.setItem('topologyServicesInstanceDependency', JSON.stringify(state.topoServicesInstanceDependency));
  },
  [types.SET_ENDPOINT_DEPENDENCY](state: State, data: { calls: Call[]; nodes: Node[] }) {
    const obj = {} as any;
    let nodes = [];
    let calls = [];
    nodes = data.nodes.reduce((prev: Node[], next: Node) => {
      if (!obj[next.id]) {
        obj[next.id] = true;
        prev.push(next);
      }
      return prev;
    }, []);
    calls = data.calls.reduce((prev: Call[], next: Call) => {
      if (!obj[next.id]) {
        obj[next.id] = true;
        prev.push(next);
      }
      return prev;
    }, []);
    state.endpointDependency = { nodes, calls };
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
  [types.UPDATE_TOPO_TEMPLATE_TYPES](state: State, data: any) {
    state.topoTemplatesType = data;
    localStorage.setItem('topoTemplateTypes', JSON.stringify(data));
  },
  [types.SET_TOPO_ERRORS](state: State, data: { msg: string; desc: string }) {
    state.topoErrors = {
      ...state.topoErrors,
      [data.msg]: data.desc,
    };
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
        context.commit(types.SET_TOPO_ERRORS, { msg: 'serviceTopoErrors', desc: res.data.errors });
        if (res.data.errors) {
          return [];
        }
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
        context.commit(types.SET_TOPO_ERRORS, { msg: 'endpointErrors', desc: res.data.errors });
        if (res.data.errors) {
          return [];
        }
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
        context.commit(types.SET_TOPO_ERRORS, { msg: query, desc: res.data.errors || '' });
        if (!res.data.data) {
          context.commit(types.SET_TOPO, { calls: [], nodes: [] });
          return;
        }
        const calls = res.data.data.topo.calls;
        const nodes = res.data.data.topo.nodes;
        const ids = nodes.map((i: any) => i.id);
        const idsC = calls.filter((i: any) => i.detectPoints.includes('CLIENT')).map((b: any) => b.id);
        const idsS = calls.filter((i: any) => i.detectPoints.includes('SERVER')).map((b: any) => b.id);
        if (!ids.length) {
          return context.commit(types.SET_TOPO, { calls: [], nodes: [] });
        }
        const queryName = !idsC.length ? 'queryTopoInfoServer' : !idsS.length ? 'queryTopoInfoClient' : 'queryTopoInfo';
        return graph
          .query(queryName)
          .params({ ...params, ids, idsC, idsS })
          .then((info: AxiosResponse) => {
            context.commit(types.SET_TOPO_ERRORS, { msg: 'queryTopoInfo', desc: info.data.errors || '' });
            const resInfo = info.data.data;
            if (!resInfo) {
              context.commit(types.SET_TOPO, { calls: [], nodes: [] });
              return;
            }
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
        const endpointIds = res.nodes
          .map((item: Node) => item.id)
          .filter((d: string) => !params.endpointIds.includes(d));
        if (!endpointIds.length) {
          context.commit(types.SET_ENDPOINT_DEPENDENCY, res);
          return;
        }
        context.dispatch('GET_ENDPOINT_TOPO', { endpointIds, duration: params.duration }).then((json) => {
          if (context.state.currentEndpointDepth.key > 2) {
            const ids = json.nodes
              .map((item: Node) => item.id)
              .filter((d: string) => ![...endpointIds, ...params.endpointIds].includes(d));
            if (!ids.length) {
              const nodes = [...res.nodes, ...json.nodes];
              const calls = [...res.calls, ...json.calls];
              context.commit(types.SET_ENDPOINT_DEPENDENCY, { nodes, calls });
              return;
            }
            context.dispatch('GET_ENDPOINT_TOPO', { endpointIds: ids, duration: params.duration }).then((topo) => {
              if (context.state.currentEndpointDepth.key > 3) {
                const endpoints = topo.nodes
                  .map((item: Node) => item.id)
                  .filter((d: string) => ![...ids, ...endpointIds, ...params.endpointIds].includes(d));
                if (!endpoints.length) {
                  const nodes = [...res.nodes, ...json.nodes, ...topo.nodes];
                  const calls = [...res.calls, ...json.calls, ...topo.calls];
                  context.commit(types.SET_ENDPOINT_DEPENDENCY, { nodes, calls });
                }
                context
                  .dispatch('GET_ENDPOINT_TOPO', { endpointIds: endpoints, duration: params.duration })
                  .then((data) => {
                    if (context.state.currentEndpointDepth.key > 4) {
                      const nodeIds = data.nodes
                        .map((item: Node) => item.id)
                        .filter(
                          (d: string) => ![...endpoints, ...ids, ...endpointIds, ...params.endpointIds].includes(d),
                        );
                      if (!nodeIds.length) {
                        const nodes = [...res.nodes, ...json.nodes, ...topo.nodes, ...data.nodes];
                        const calls = [...res.calls, ...json.calls, ...topo.calls, ...data.calls];
                        context.commit(types.SET_ENDPOINT_DEPENDENCY, { nodes, calls });
                        return;
                      }
                      context
                        .dispatch('GET_ENDPOINT_TOPO', { endpointIds: nodeIds, duration: params.duration })
                        .then((toposObj) => {
                          const nodes = [...res.nodes, ...json.nodes, ...topo.nodes, ...data.nodes, ...toposObj.nodes];
                          const calls = [...res.calls, ...json.calls, ...topo.calls, ...data.calls, ...toposObj.calls];
                          context.commit(types.SET_ENDPOINT_DEPENDENCY, { nodes, calls });
                        });
                    } else {
                      const nodes = [...res.nodes, ...json.nodes, ...topo.nodes, ...data.nodes];
                      const calls = [...res.calls, ...json.calls, ...topo.calls, ...data.calls];
                      context.commit(types.SET_ENDPOINT_DEPENDENCY, { nodes, calls });
                    }
                  });
              } else {
                const nodes = [...res.nodes, ...json.nodes, ...topo.nodes];
                const calls = [...res.calls, ...json.calls, ...topo.calls];
                context.commit(types.SET_ENDPOINT_DEPENDENCY, { nodes, calls });
              }
            });
          } else {
            const nodes = [...res.nodes, ...json.nodes];
            const calls = [...res.calls, ...json.calls];
            context.commit(types.SET_ENDPOINT_DEPENDENCY, { nodes, calls });
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
          const msg = res.data.errors.map((e: { message: string }) => e.message).join(' ');

          context.commit(types.SET_TOPO_ERRORS, { msg: 'endpointDependencyError', desc: msg });
          context.commit(types.SET_ENDPOINT_DEPENDENCY, { calls: [], nodes: [] });
          return;
        }
        const topo = res.data.data;
        let calls = [] as any;
        let nodes = [] as any;
        for (const key of Object.keys(topo)) {
          calls.push(...topo[key].calls);
          nodes.push(...topo[key].nodes);
        }
        if (!nodes.length) {
          context.commit(types.SET_TOPO_ERRORS, { msg: 'endpointDependencyError', desc: '' });
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
        calls = calls.reduce((prev: Call[], next: Call) => {
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
                call.serviceId = node.serviceId;
                call.endpointId = node.id;
                call.type = node.type;
              }
              if (node.id === call.target) {
                target = node;
                call.destServiceName = node.serviceName;
                call.destServiceId = node.serviceId;
                call.destEndpointName = node.name;
                call.destEndpointId = node.id;
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
              const msg = json.data.errors.map((e: { message: string }) => e.message).join(' ');

              context.commit(types.SET_TOPO_ERRORS, { msg: 'endpointDependencyError', desc: msg });
              context.commit(types.SET_ENDPOINT_DEPENDENCY, { calls: [], nodes: [] });
              return;
            }
            context.commit(types.SET_TOPO_ERRORS, { msg: 'endpointDependencyError', desc: '' });
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
        context.commit(types.SET_TOPO_ERRORS, { msg: 'queryTopoInstanceDependency', desc: res.data.errors || '' });
        if (res.data.errors) {
          return [];
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
              context.commit(types.SET_TOPO_ERRORS, {
                msg: 'queryDependencyInstanceClientMetric',
                desc: json.data.errors || '',
              });
              if (json.data.errors) {
                return [];
              }
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
              context.commit(types.SET_TOPO_ERRORS, {
                msg: 'queryDependencyInstanceServerMetric',
                desc: jsonResp.data.errors || '',
              });
              if (jsonResp.data.errors) {
                return [];
              }
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
