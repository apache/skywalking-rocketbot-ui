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
import { ComparisonOption, InitSource, MetricsSource, ObjectType, ServiceType } from './comparison-const';

type GenericIdentityFn<T> = (arg: T) => T;

function identity<T>(arg: T): T {
  return arg;
}
export interface State {
  currentOptions: ICurrentOptions;
  dataSource: DataSourceType;
  chartSource: GenericIdentityFn<string>;
}

interface ActionsParamType {
  duration: DurationTime;
}

const initState: State = {
  currentOptions: ComparisonOption,
  dataSource: InitSource,
  chartSource: identity,
};

// getters
const getters = {
  queryPreValue(state: State) {
    const { currentOptions } = state;
    const preType = currentOptions.preType.key;
    const preMetric = currentOptions.preMetrics.key;
    const preItem = queryChartData.service.filter((opt: {
      o: string;
      c: string;
      d: string
    }) => opt.d === preMetric && opt.o === preType && opt.c !== 'ChartNum')[0] || {};
    const preParam = (fragmentAll as any)[preItem.d];

    return `query queryData(${preParam.variable.join(',')}) {${preParam.fragment}}`;
  },
  queryNextValue(state: State) {
    const { currentOptions } = state;
    const nextType = currentOptions.nextType.key;
    const nextMetric =  currentOptions.nextMetrics.key;
    const nextItem = queryChartData.service.filter((opt: {
      o: string;
      c: string;
      d: string
    }) => opt.d === nextMetric && opt.o === nextType && opt.c !== 'ChartNum')[0] || {};
    const nextParam = (fragmentAll as any)[nextItem.d];

    return `query queryData(${nextParam.variable.join(',')}) {${nextParam.fragment}}`;
  },
  currentOptions(state: State) {
    return state.currentOptions;
  },
  preConfig(state: State) {
    const { currentOptions } = state;
    const variablesData = {
      serviceId: currentOptions.preService.key || '',
    } as any;
    const { key } = currentOptions.preType;
    if (key === ObjectType.ServiceEndpoint) {
        variablesData.endpointId = currentOptions.preObject.key || '';
        variablesData.endpointName = currentOptions.preObject.label || '';
    } else if (key === ObjectType.ServiceInstance) {
      variablesData.instanceId = currentOptions.preObject.key || '';
    } else if (key === ObjectType.Database) {
      variablesData.databaseId = currentOptions.preObject.key || '';
    }

    return variablesData;
  },
  nextConfig(state: State) {
    const { currentOptions } = state;
    const variablesData = {
      serviceId: currentOptions.nextService.key || '',
    } as any;
    const { key } = currentOptions.nextType;
    if (key === ObjectType.ServiceEndpoint) {
        variablesData.endpointId = currentOptions.nextObject.key || '';
        variablesData.endpointName = currentOptions.nextObject.label || '';
    } else if (key === ObjectType.ServiceInstance) {
      variablesData.instanceId = currentOptions.nextObject.key || '';
    } else if (key === ObjectType.Database) {
      variablesData.databaseId = currentOptions.nextObject.key || '';
    }

    return variablesData;
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
    state.chartSource = {
      ...obj,
      ...state.chartSource,
    };
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
    context.dispatch('GET_COMPARISON', {duration: date, type: ServiceType.PREVIOUS});
    context.dispatch('GET_COMPARISON', {duration: date, type: ServiceType.NEXT});
  },
  GET_COMPARISON(
    context: {commit: Commit, state: State, dispatch: Dispatch, getters: any}, param: {duration: string, type: string},
  ) {
    let variablesData = {
      duration: param.duration,
    } as any;
    let queryVal = '';
    if (param.type === ServiceType.PREVIOUS) {
      variablesData = {
        ...variablesData,
        ...context.getters.preConfig,
      };
      queryVal = context.getters.queryPreValue;
    } else {
      variablesData = {
        ...variablesData,
        ...context.getters.nextConfig,
      };
      queryVal = context.getters.queryNextValue;
    }
    return axios.post('/graphql', {
      query: queryVal,
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
