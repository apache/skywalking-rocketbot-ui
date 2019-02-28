import { Commit, ActionTree, MutationTree, Dispatch } from 'vuex';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import { Trace, Span, Option } from '../interfaces';
import * as types from '../mutation-types';

export interface State {
  services: Option[];
  instances: Option[];
  traceForm: any;
  traceList: Trace[];
  traceTotal: number;
  traceSpans: Span[];
  currentTrace: Trace;
}

const initState: State = {
  services: [],
  instances: [],
  traceForm: {
    paging: {pageNum: 1, pageSize: 15, needTotal: true},
    queryOrder: 'BY_DURATION',
  },
  traceList: [],
  traceTotal: 0,
  traceSpans: [],
  currentTrace: {
    operationNames: [],
    duration: 0,
    isError: false,
    key: '',
    start: '',
    traceIds: [],
  },
};

// getters
const getters = {};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_SERVICES](state: State, data: any) {
    state.services = [{label: 'All', key: ''}].concat(data);
  },
  [types.SET_INSTANCES](state: State, data: any) {
    state.instances = [{label: 'All', key: ''}].concat(data);
  },
  [types.SET_TRACEFORM](state: State, data: any) {
    state.traceForm = data;
  },
  [types.SET_TRACEFORMITEM](state: State, params: any) {
    state.traceForm[params.type] = params.data;
  },
  [types.SET_TRACELIST](state: State, data: Trace[]) {
    state.traceList = data;
  },
  [types.SET_TRACELIST_TOTAL](state: State, data: number) {
    state.traceTotal = data;
  },
  [types.SET_TRACESPANS](state: State, data: Span[]) {
    state.traceSpans = data;
  },
  [types.SET_CURRENTTRACE](state: State, data: Span) {
    state.currentTrace = data;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit }, params: any) {
    return graph
    .query('queryServices')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_SERVICES, res.data.data.services);
    });
  },
  GET_INSTANCES(context: { commit: Commit }, params: any) {
    return graph
    .query('queryServiceInstance')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_INSTANCES, res.data.data.instanceId);
    });
  },
  SET_TRACEFORM(context: { commit: Commit, dispatch: Dispatch }, params) {
    context.commit(types.SET_TRACEFORM, params);
  },
  GET_TRACELIST(context: { state: State, commit: Commit }) {
    context.commit(types.SET_TRACELIST, []);
    return graph
    .query('queryTraces')
    .params({condition: context.state.traceForm})
    .then((res: AxiosResponse) => {
      context.commit(types.SET_TRACELIST, res.data.data.traces.data);
      context.commit(types.SET_TRACELIST_TOTAL, res.data.data.traces.total);
    });
  },
  GET_TRACESPANS(context: { commit: Commit }, params) {
    context.commit(types.SET_TRACESPANS, []);
    return graph
    .query('queryTrace')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_TRACESPANS, res.data.data.trace.spans);
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
