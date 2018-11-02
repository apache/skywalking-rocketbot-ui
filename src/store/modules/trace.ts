import { Commit, ActionTree } from 'vuex';
import { getTraces, getTraceSpans } from '@/api/trace.ts';
import * as types from '../mutation-types';

export interface Trace {
  duration: Number;
  isError: Boolean;
  key: String;
  operationNames: String[];
  start: String;
  traceIds: String[];
}
export interface Span {
  duration: Number;
  isError: Boolean;
  key: String;
  operationNames: String[];
  start: String;
  traceIds: String[];
}

export interface State {
  traces: Trace[];
  spans: Span[];
  tracesTotal: Number;
}

const initState: State = {
  traces: [],
  spans: [],
  tracesTotal: 0,
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_TRACE](state: State, data: Trace[]) {
    state.traces = data;
  },
  [types.SET_TRACE_TOTAL](state: State, total: Number) {
    state.tracesTotal = total;
  },
  [types.SET_SPAN](state: State, data: Span[]) {
    state.spans = data;
  },
  [types.CLEAR_TRACE](state: State) {
    state.traces = [];
    state.spans = [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_TRACES(
    context: { commit: Commit; state: State; rootState: any },
    params: String,
  ) {
    return getTraces(params).then((res) => {
      context.commit(types.SET_TRACE, res.data.data.queryBasicTraces.traces);
      context.commit(
        types.SET_TRACE_TOTAL,
        res.data.data.queryBasicTraces.total,
      );
    });
  },
  GET_SPANS(
    context: { commit: Commit; state: State; rootState: any },
    params: String,
  ) {
    context.commit(types.SET_SPAN, []);
    return getTraceSpans(params).then((res) => {
      // context.commit(types.SET_SPAN, span.data.queryTrace.spans);
      context.commit(types.SET_SPAN, res.data.data.queryTrace.spans);
    });
  },
  CLEAR_TRACE(context: { commit: Commit; state: State; rootState: any }) {
    context.commit(types.CLEAR_TRACE);
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
