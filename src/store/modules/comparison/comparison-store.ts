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
import axios, {AxiosPromise, AxiosResponse} from 'axios';

import graph from '@/graph';
import {cancelToken} from '@/utils/cancelToken';
import * as types from '../../mutation-types';
import { DurationTime } from '@/types/global';
import { queryChartData } from '@/utils/queryChartData';
import fragmentAll from '@/store/modules/dashboard/fragments';
import { ICurrentOptions, DataSourceType } from '@/types/comparison';
import { ComparisonOption, InitSource, MetricsSource } from './comparison-const';

export interface State {
  currentOptions: ICurrentOptions;
  dataSource: DataSourceType;
  chartSource: any;
}

interface ActionsParamType {
  duration: DurationTime;
}

const initState: State = {
  currentOptions: ComparisonOption,
  dataSource: InitSource,
  chartSource: {},
};

// getters
const getters = {
  Graphqls(state: State) {
    const { currentOptions } = state;
    const preType = currentOptions.preType.key;
    const preMetric = currentOptions.preMetrics.key;
    const nextType = currentOptions.nextType.key;
    const nextMetric =  currentOptions.nextMetrics.key;
    const preItem = queryChartData.service.filter((opt: {
      o: string;
      c: string;
      d: string
    }) => opt.d === preMetric && opt.o === preType && opt.c !== 'ChartNum')[0] || {};
    const preParam = (fragmentAll as any)[preItem.d];
    const nextItem = queryChartData.service.filter((opt: {
      o: string;
      c: string;
      d: string
    }) => opt.d === nextMetric && opt.o === nextType && opt.c !== 'ChartNum')[0] || {};
    const nextParam = (fragmentAll as any)[nextItem.d];
    const variables = [...preParam.variable, ...nextParam.variable];

    return `query queryData(${variables.join(',')}) {${preParam.fragment} ${nextParam.fragment}}`;
  },
  currentOptions(state: State) {
    return state.currentOptions;
  },
};

// mutations
const mutations = {
  [types.SET_SERVICES](state: State, data: any) {
    const { services } = data;
    if (!services.length) { return; }
    state.dataSource.preServiceSource = services;
    state.dataSource.nextServiceSource = services;
    state.currentOptions.preService = services[0];
    state.currentOptions.nextService = services[0];
    const type = state.currentOptions.preType.key;

    state.dataSource.preMetricsSource = MetricsSource[type];
    state.currentOptions.preMetrics = MetricsSource[type][0];
    state.dataSource.nextMetricsSource = MetricsSource[type];
    state.currentOptions.nextMetrics = MetricsSource[type][1];
  },
  [types.SET_ENDPOINTS](state: State, data: any) {
    if (!data.length) {
      return;
    }
    state.dataSource.preObjectSource = data;
    state.dataSource.nextObjectSource = data;
    state.currentOptions.preObject = data[0];
    state.currentOptions.nextObject = data[0];
  },
  [types.SET_CHARTVAL](state: State, data: any) {
    const keys = Object.keys(data);
    const obj = {} as any;
    for (const key of keys) {
      const value = data[key].values.map((d: {value: number}) => d.value);
      const strKey = `${state.currentOptions.preService.label}-${state.currentOptions.preObject.label}-${key}`;
      obj[strKey] = value;
    }
    state.chartSource = obj;
  },
};

// actions
const actions: ActionTree<State, ActionsParamType> = {
  GET_SERVICES(context: { commit: Commit, dispatch: Dispatch, rootState: any  }, params: {duration: string}) {
    return graph.query('queryServices').params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_SERVICES, {services: res.data.data.services});
      }).then(() => {
        context.dispatch('GET_SERVICE_ENDPOINTS', params.duration);
      });
  },
  async GET_SERVICE_ENDPOINTS(context: { commit: Commit, state: State, dispatch: Dispatch }, date: string) {
    if (!context.state.currentOptions.preService.key) {
      return new Promise((resolve) => resolve());
    }
    await graph
      .query('queryEndpoints')
      .params({serviceId: context.state.currentOptions.preService.key, keyword: ''})
      .then((res: AxiosResponse) => {
        context.commit(types.SET_ENDPOINTS, res.data.data.getEndpoints);
      });
    await context.dispatch('GET_COMPARISON', date);
  },
  GET_COMPARISON(context: { commit: Commit, state: State, dispatch: Dispatch, getters: any }, date: string) {
    const { currentOptions } = context.getters;
    const variablesData = {
      serviceId: currentOptions.preService.key || '',
      endpointId: currentOptions.preObject.key || '',
      endpointName: currentOptions.preObject.label || '',
      // instanceId: this.currentOptions.currentInstance.key || '',
      // databaseId: this.currentOptions.currentDatabase.key || '',
      duration: date,
    };
    return axios.post('/graphql', {
      query: context.getters.Graphqls,
      variables: variablesData,
    }, {cancelToken: cancelToken()}).then((res: AxiosResponse<any>) => {
        const data = res.data.data;

        context.commit('SET_CHARTVAL', data);
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
