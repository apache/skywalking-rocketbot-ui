import { Commit, ActionTree, MutationTree } from 'vuex';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import * as types from '../mutation-types';

export interface State {
  global: any;
  services: any;
  serviceInfo: any;
  currentService: any;
  endpoints: any;
  endpointInfo: any;
  currentEndpoint: any;
  instances: any;
  currentInstance: any;
  instanceInfo: any;
}

const initState: State = {
  global: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
    getTopNServiceThroughput: [],
    getTopNSlowEndpoint: [],
  },
  services: [],
  currentService: {},
  serviceInfo: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
    getResponseTimeTrend: [],
    getSLATrend: [],
    getInstanceThroughput: [],
    getSlowEndpoint: [],
    getThroughputTrend: [],
  },
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
  instances: [],
  currentInstance: {},
  instanceInfo: {
    getCPUTrend: [],
    getResponseTimeTrend: [],
    getSLATrend: [],
    getThroughputTrend: [],
    heap: [],
    maxHeap: [],
    maxNoheap: [],
    noheap: [],
    oldGCCount: [],
    oldGCTime: [],
    youngGCCount: [],
    youngGCTime: [],
  },
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_GLOBAL](state: State, data: any) {
    state.global.p50 = data.getP50.values;
    state.global.p75 = data.getP75.values;
    state.global.p90 = data.getP90.values;
    state.global.p95 = data.getP95.values;
    state.global.p99 = data.getP99.values;
    state.global.getTopNServiceThroughput = data.getTopNServiceThroughput;
    state.global.getTopNSlowEndpoint = data.getTopNSlowEndpoint;
  },
  [types.SET_SERVICES](state: State, data: any) {
    state.services = data;
    if (!state.currentService.key && data.length) {
      state.currentService = data[0];
    }
  },
  [types.SET_SERVICEINFO](state: State, data: any) {
    state.serviceInfo.p50 = data.getP50.values;
    state.serviceInfo.p75 = data.getP75.values;
    state.serviceInfo.p90 = data.getP90.values;
    state.serviceInfo.p95 = data.getP95.values;
    state.serviceInfo.p99 = data.getP99.values;
    state.serviceInfo.getResponseTimeTrend = data.getResponseTimeTrend.values;
    state.serviceInfo.getSLATrend = data.getSLATrend.values;
    state.serviceInfo.getInstanceThroughput = data.getServiceInstanceThroughput;
    state.serviceInfo.getSlowEndpoint = data.getSlowEndpoint;
    state.serviceInfo.getThroughputTrend = data.getThroughputTrend.values;
  },
  [types.SET_CURRENTSERVICE](state: State, service: any) {
    state.currentService = service;
  },
  [types.SET_ENDPOINTS](state: State, data: any) {
    state.endpoints = data;
    if ((!state.currentEndpoint.key && data.length) || state.endpoints.indexOf(state.currentEndpoint) === -1 ) {
      state.currentEndpoint = data[0];
    }
  },
  [types.SET_CURRENTENDPOINT](state: State, endpoint: any) {
    state.currentEndpoint = endpoint;
  },
  [types.SET_ENDPOINTINFO](state: State, data: any) {
    state.endpointInfo.p50 = data.getP50.values;
    state.endpointInfo.p75 = data.getP75.values;
    state.endpointInfo.p90 = data.getP90.values;
    state.endpointInfo.p95 = data.getP95.values;
    state.endpointInfo.p99 = data.getP99.values;
    state.endpointInfo.getResponseTimeTrend = data.getEndpointResponseTimeTrend.values;
    state.endpointInfo.getSLATrend = data.getEndpointSLATrend.values;
    state.endpointInfo.getThroughputTrend = data.getEndpointThroughputTrend.values;
    state.endpointInfo.queryBasicTraces = data.queryBasicTraces.traces;
  },
  [types.SET_INSTANCES](state: State, data: any) {
    state.instances = data;
    if ((!state.currentInstance.key && data.length) || state.instances.indexOf(state.currentInstance) === -1 ) {
      state.currentInstance = data[0];
    }
  },
  [types.SET_CURRENTINSTANCE](state: State, instance: any) {
    state.currentInstance = instance;
  },
  [types.SET_INSTANCEINFO](state: State, data: any) {
    state.instanceInfo.getCPUTrend = data.getCPUTrend.values;
    state.instanceInfo.getResponseTimeTrend = data.getServiceInstanceResponseTimeTrend.values;
    state.instanceInfo.getSLATrend = data.getServiceInstanceSLA.values;
    state.instanceInfo.getThroughputTrend = data.getServiceInstanceThroughputTrend.values;
    state.instanceInfo.heap = data.heap.values;
    state.instanceInfo.maxHeap = data.maxHeap.values;
    state.instanceInfo.maxNoheap = data.maxNoheap.values;
    state.instanceInfo.noheap = data.noheap.values;
    state.instanceInfo.oldGCCount = data.oldGCCount.values;
    state.instanceInfo.oldGCTime = data.oldGCTime.values;
    state.instanceInfo.youngGCCount = data.youngGCCount.values;
    state.instanceInfo.youngGCTime = data.youngGCTime.values;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_GLOBAL(context: { commit: Commit }, params: any) {
    return graph
    .query('queryDashBoardGlobal')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_GLOBAL, res.data.data);
    });
  },
  GET_SERVICES(context: { commit: Commit }, params: any) {
    return graph
    .query('queryServices')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_SERVICES, res.data.data.services);
    });
  },
  GET_SERVICE(context: { commit: Commit }, params: any) {
    return graph
    .query('queryDashBoardService')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_ENDPOINTS, res.data.data.getEndpoints);
      context.commit(types.SET_INSTANCES, res.data.data.getServiceInstances);
      context.commit(types.SET_SERVICEINFO, res.data.data);
    });
  },
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
      context.commit(types.SET_ENDPOINTINFO, res.data.data);
    });
  },
  GET_INSTANCES(context: { commit: Commit }, params: any) {
    return graph
    .query('queryInstances')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_INSTANCES, res.data.data);
    });
  },
  GET_INSTANCE(context: { commit: Commit }, params: any) {
    return graph
    .query('queryDashBoardInstance')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_INSTANCEINFO, res.data.data);
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
