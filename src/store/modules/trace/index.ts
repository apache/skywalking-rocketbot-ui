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

import graph from '@/graph';
import * as types from '@/store/mutation-types';
import { Option } from '@/types/global';
import { Span, Trace } from '@/types/topo';
import { AxiosResponse } from 'axios';
import { ActionTree, Commit, Dispatch, MutationTree } from 'vuex';

export interface State {
  services: Option[];
  instances: Option[];
  traceForm: any;
  traceList: Trace[];
  traceTotal: number;
  traceSpans: Span[];
  currentTrace: Trace;
  traceSpanLogs: any[];
  traceSpanLogsTotal: number;
}

const initState: State = {
  services: [],
  instances: [],
  traceForm: {
    paging: { pageNum: 1, pageSize: 15, needTotal: true },
    queryOrder: localStorage.getItem('traceQueryOrder') || 'BY_DURATION',
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
  traceSpanLogs: [],
  traceSpanLogsTotal: 0,
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_SERVICES](state: State, data: Option[]): void {
    state.services = [{ label: 'All', key: '' }].concat(data);
  },
  [types.SET_INSTANCES](state: State, data: Option[]): void {
    state.instances = [{ label: 'All', key: '' }].concat(data);
  },
  [types.SET_TRACE_FORM](state: State, data: any): void {
    if (data.queryOrder) {
      if (data.queryOrder === '') {
        data.queryOrder = 'BY_DURATION';
        localStorage.setItem('traceQueryOrder', 'BY_DURATION');
      } else {
        localStorage.setItem('traceQueryOrder', data.queryOrder);
      }
    }
    state.traceForm = data;
  },
  [types.SET_TRACE_FORM_ITEM](state: State, params: any): void {
    if (params.type && params.type === 'queryOrder') {
      if (params.data === '') {
        params.data = 'BY_DURATION';
        localStorage.setItem('traceQueryOrder', 'BY_DURATION');
      } else {
        localStorage.setItem('traceQueryOrder', params.data);
      }
    }
    state.traceForm[params.type] = params.data;
  },
  [types.SET_TRACELIST](state: State, data: Trace[]): void {
    state.traceList = data;
  },
  [types.SET_TRACELIST_TOTAL](state: State, data: number): void {
    state.traceTotal = data;
  },
  [types.SET_TRACE_SPANS](state: State, data: Span[]): void {
    state.traceSpans = data;
  },
  [types.SET_CURRENT_TRACE](state: State, data: Span): void {
    state.currentTrace = data;
  },
  [types.SET_DEFAULT_EMPTY_TRACE](state: State): void {
    state.currentTrace = {
      operationNames: [],
      duration: 0,
      isError: false,
      key: '',
      start: '',
      traceIds: [],
    };
  },
  [types.SET_TRACE_SPAN_LOGS](state: State, logs: any[]) {
    state.traceSpanLogs = logs;
  },
  [types.SET_TRACE_SPAN_LOGS_TOTAL](state: State, data: number) {
    state.traceSpanLogsTotal = data;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit }, params: { duration: any; keyword: string }): Promise<void> {
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_SERVICES, res.data.data.services);
      });
  },
  GET_INSTANCES(context: { commit: Commit }, params: any): Promise<void> {
    return graph
      .query('queryServiceInstance')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_INSTANCES, res.data.data.instanceId);
      });
  },
  SET_TRACE_FORM(context: { commit: Commit; dispatch: Dispatch }, params: any): void {
    context.commit(types.SET_TRACE_FORM, params);
  },
  GET_TRACELIST(context: { state: State; commit: Commit }): Promise<void> {
    context.commit(types.SET_TRACELIST, []);
    return graph
      .query('queryTraces')
      .params({ condition: context.state.traceForm })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_TRACELIST, res.data.data.data.traces);
        context.commit(types.SET_TRACELIST_TOTAL, res.data.data.data.total);
      });
  },
  GET_TRACE_SPANS(context: { commit: Commit }, params: any): Promise<void> {
    context.commit(types.SET_TRACE_SPANS, []);
    return graph
      .query('queryTrace')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_TRACE_SPANS, res.data.data.trace.spans);
      });
  },
  GET_TRACE_SPAN_LOGS(context: { commit: Commit }, params: any) {
    return graph
      .query('queryServiceLogs')
      .params(params)
      .then((res: AxiosResponse<any>) => {
        if (res.data && res.data.errors) {
          context.commit('SET_TRACE_SPAN_LOGS', []);
          context.commit('SET_TRACE_SPAN_LOGS_TOTAL', 0);

          return;
        }
        context.commit('SET_TRACE_SPAN_LOGS', res.data.data.queryLogs.logs);
        context.commit('SET_TRACE_SPAN_LOGS_TOTAL', res.data.data.queryLogs.total);
      });
  },
};

export default {
  namespaced: true,
  state: initState,
  actions,
  mutations,
};
