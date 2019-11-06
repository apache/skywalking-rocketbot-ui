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
import axios, { AxiosPromise, AxiosResponse } from 'axios';

import graph from '@/graph';
import { cancelToken } from '@/utils/cancelToken';
import * as types from '../../mutation-types';
import { DurationTime } from '@/types/global';
import { queryChartData } from '@/utils/queryChartData';
import fragmentAll from '@/store/modules/dashboard/fragments';
import { ICurrentOptions, DataSourceType, ISelectConfig } from '@/types/comparison';
import {
  ComparisonOption, InitSource, MetricsSource,
  ObjectType, ServiceType, ChangeType,
  StatusType,
} from './comparison-const';

type GenericIdentityFn<T> = (arg: T) => T;

function identity<T>(arg: T): T {
  return arg;
}
export interface State {
  currentOptions: ICurrentOptions;
  dataSource: DataSourceType;
  chartSource: GenericIdentityFn<string>;
  isPrevious: StatusType;
}

interface ActionsParamType {
  duration: DurationTime;
}

const initState: State = {
  currentOptions: ComparisonOption,
  dataSource: InitSource,
  chartSource: identity,
  isPrevious: StatusType.Init,
};

// getters
const getters = {
  queryPreValue(state: State) {
    const { currentOptions } = state;
    const preType = currentOptions.preType.key;
    const preMetric = currentOptions.preMetrics.key;
    const preItem =  [...queryChartData.service, ...queryChartData.database].filter((opt: {
      o: string;
      c: string;
      d: string
    }) => opt.d === preMetric && opt.o === preType && opt.c !== 'ChartNum')[0] || {};
    const preParam = (fragmentAll as any)[preItem.d] || {};

    return `query queryData(${preParam.variable.join(',')}) {${preParam.fragment}}`;
  },
  queryNextValue(state: State) {
    const { currentOptions } = state;
    const nextType = currentOptions.nextType.key;
    const nextMetric =  currentOptions.nextMetrics.key;
    const nextItem = [...queryChartData.service, ...queryChartData.database].filter((opt: {
      o: string;
      c: string;
      d: string
    }) => opt.d === nextMetric && opt.o === nextType && opt.c !== 'ChartNum')[0] || {};
    const nextParam = (fragmentAll as any)[nextItem.d] || {};

    return `query queryData(${nextParam.variable.join(',')}) {${nextParam.fragment}}`;
  },
  preConfig(state: State) {
    const { currentOptions, isPrevious } = state;
    const variablesData = {
      serviceId: isPrevious === StatusType.Next ? currentOptions.preService.key : currentOptions.nextService.key,
    } as any;
    const { key } = currentOptions.preType;

    if (key === ObjectType.ServiceEndpoint) {
        variablesData.endpointId = currentOptions.preObject.key || '';
        variablesData.endpointName = currentOptions.preObject.label || '';
    } else if (key === ObjectType.ServiceInstance) {
      variablesData.instanceId = currentOptions.preObject.key || '';
    } else if (key === ObjectType.Database) {
      delete variablesData.serviceId;
      variablesData.databaseId = currentOptions.preObject.key || '';
    }

    return variablesData;
  },
  nextConfig(state: State) {
    const { currentOptions } = state;
    const variablesData = {} as any;
    const { key } = currentOptions.nextType;

    if (key === ObjectType.ServiceEndpoint) {
        variablesData.serviceId = currentOptions.nextService.key || '';
        variablesData.endpointId = currentOptions.nextObject.key || '';
        variablesData.endpointName = currentOptions.nextObject.label || '';
    } else if (key === ObjectType.ServiceInstance) {
      variablesData.serviceId = currentOptions.nextService.key || '';
      variablesData.instanceId = currentOptions.nextObject.key || '';
    } else if (key === ObjectType.Database) {
      variablesData.databaseId = currentOptions.nextObject.key || '';
    }

    return variablesData;
  },
  ChangeType() {

    return {
      PreService: 'preService',
      PreType: 'preType',
      PreObject: 'preObject',
      PreMetrics: 'preMetrics',
      NextService: 'nextService',
      NextType: 'nextType',
      NextObject: 'nextObject',
      NextMetrics: 'nextMetrics',
    };
  },
};

// mutations
const mutations = {
  [types.SET_ISPREVIOUS](state: State, data: StatusType) {
    state.isPrevious = data;
  },
  [types.SET_SERVICES](state: State, data: any) {
    const { services } = data;

    state.dataSource.preServiceSource = services;
    state.dataSource.nextServiceSource = services;
    state.currentOptions.preService = services[0];
    state.currentOptions.nextService = services[0];
  },
  [types.SET_ENDPOINTS](state: State, data: any) {
    const { isPrevious, currentOptions } = state;
    const type = isPrevious === StatusType.Pre ? currentOptions.preType.key : currentOptions.nextType.key;

    if (isPrevious === StatusType.Pre) {
      state.dataSource.preObjectSource = data;
      state.currentOptions.preObject = data[0];
      state.dataSource.preMetricsSource = MetricsSource[type];
      state.currentOptions.preMetrics = MetricsSource[type][0];
    } else if (isPrevious === StatusType.Next) {
      state.dataSource.nextObjectSource = data;
      state.currentOptions.nextObject = data[0];
      state.dataSource.nextMetricsSource = MetricsSource[type];
      state.currentOptions.nextMetrics = MetricsSource[type][1];
    } else {
      state.dataSource.nextObjectSource = data;
      state.currentOptions.nextObject = data[0];
      state.dataSource.preObjectSource = data;
      state.currentOptions.preObject = data[0];
      state.dataSource.preMetricsSource = MetricsSource[type];
      state.currentOptions.preMetrics = MetricsSource[type][0];
      state.dataSource.nextMetricsSource = MetricsSource[type];
      state.currentOptions.nextMetrics = MetricsSource[type][1];
    }
  },
  [types.SET_CHARTVAL](state: State, data: any) {
    const keys = Object.keys(data);
    const obj = {} as any;
    for (const key of keys) {
      const value = data[key].values.map((d: {value: number}) => d.value);
      if (key === state.currentOptions.preMetrics.key) {
        const { preObject,  preService } = state.currentOptions;
        const str = `${preObject.label}`;
        const strKeyPre = `${preService.key ? preService.label : ''}${preObject.key ? str : ''}-${key}`;
        obj[strKeyPre] = value;
      } else {
        const { nextObject, nextService } = state.currentOptions;
        const str = `${nextObject.label}`;
        const servicesLabel =  `${nextService.label}-`;
        const strKeyNext = `${nextService.key ? servicesLabel : ''}${nextObject.key ? str : ''}-${key}`;
        obj[strKeyNext] = value;
      }
    }
    state.chartSource = {
      ...obj,
      ...state.chartSource,
    };
  },
  [types.UPDATE_CONFIG](state: any, data: ISelectConfig) {
    const {type, option} = data;

    state.currentOptions[type] = option;
  },
  [types.CLEAR_CHART_VAL](state: State) {
    state.chartSource = {} as any;
  },
  [types.SELECT_TYPE_SERVICES](state: State) {
    const { preType } = state.currentOptions;

    state.currentOptions.preObject = {label: 'No Data' , value: null} as any;
    state.dataSource.preObjectSource = [];
    state.dataSource.preMetricsSource = MetricsSource[preType.key];
    state.currentOptions.preMetrics = MetricsSource[preType.key][0];
  },
  [types.SELECT_TYPE_INSTANCE](state: State, data: any) {
    const { preType, nextType } = state.currentOptions;
    const { isPrevious } = state;

    if (isPrevious === StatusType.Pre) {
      state.dataSource.preMetricsSource = MetricsSource[preType.key];
      state.currentOptions.preMetrics = MetricsSource[preType.key][0];
      state.dataSource.preObjectSource = data;
      state.currentOptions.preObject = data[0];
    } else if (isPrevious === StatusType.Next) {
      state.dataSource.nextMetricsSource = MetricsSource[nextType.key];
      state.currentOptions.nextMetrics = MetricsSource[nextType.key][0];
      state.dataSource.nextObjectSource = data;
      state.currentOptions.nextObject = data[0];
    }
  },
  [types.SELECT_TYPE_DATABASE](state: State, data: any) {
    const { preType, nextType } = state.currentOptions;

    if (state.isPrevious === StatusType.Next) {
      state.dataSource.nextMetricsSource = MetricsSource[nextType.key];
      state.currentOptions.nextMetrics = MetricsSource[nextType.key][0];
      state.currentOptions.nextService = {label: 'No Data', value: null} as any;
      state.currentOptions.nextObject = data[0];
      state.dataSource.nextObjectSource = data;
    } else {
      state.dataSource.preMetricsSource = MetricsSource[preType.key];
      state.currentOptions.preMetrics = MetricsSource[preType.key][0];
      state.currentOptions.preService = {label: 'No Data', value: null} as any;
      state.currentOptions.preObject = data[0];
      state.dataSource.preObjectSource = data;
    }
  },
};

// actions
const actions: ActionTree<State, ActionsParamType> = {
  GET_SERVICES(context: {commit: Commit, dispatch: Dispatch}, params: {duration: string}) {
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
    const { isPrevious, currentOptions } = context.state;
    const servicesId = isPrevious === StatusType.Pre ? currentOptions.preService.key : currentOptions.nextService.key;
    await graph
      .query('queryEndpoints')
      .params({serviceId: servicesId, keyword: ''})
      .then((res: AxiosResponse) => {
        context.commit(types.SET_ENDPOINTS, res.data.data.getEndpoints);
      });
    if (isPrevious === StatusType.Init) {
      context.dispatch('RENDER_CHART', date);
    }
  },
  GET_SERVICE_INSTANCES(context: { commit: Commit, state: State }, params) {
    const { isPrevious, currentOptions } = context.state;
    params.serviceId = isPrevious === StatusType.Pre ? currentOptions.preService.key : currentOptions.nextService.key;
    return graph
      .query('queryInstances')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SELECT_TYPE_INSTANCE, res.data.data.getServiceInstances);
      });
  },
  GET_DATABASES(context: { commit: Commit, state: State  }, params: {duration: string}) {
    return graph
      .query('queryDatabases')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SELECT_TYPE_DATABASE, res.data.data.services);
      });
  },
  RENDER_CHART(context: {dispatch: Dispatch, commit: Commit}, date: string) {
    context.commit(types.CLEAR_CHART_VAL);
    context.dispatch('GET_COMPARISON', {duration: date, type: ServiceType.PREVIOUS});
    context.dispatch('GET_COMPARISON', {duration: date, type: ServiceType.NEXT});
  },
  SELECT_CONFIG(context: {commit: Commit, state: State, dispatch: Dispatch}, params: any) {
    const isPrevious = params.type.includes(StatusType.Next) ? StatusType.Next : StatusType.Pre;

    context.commit(types.SET_ISPREVIOUS, isPrevious);
    context.commit(types.UPDATE_CONFIG, params);

    const { currentOptions } = context.state;
    const objType = isPrevious === StatusType.Next ? currentOptions.nextType : currentOptions.preType;
    const typeList = [ChangeType.PreService, ChangeType.NextService, ChangeType.PreType, ChangeType.NextType];

    if (typeList.includes(params.type)) {
      if (objType.key === ObjectType.Service) {
        context.commit(types.SELECT_TYPE_SERVICES);
      } else if (objType.key === ObjectType.ServiceInstance) {
        context.dispatch('GET_SERVICE_INSTANCES', {
          duration: params.duration,
        });
      } else if (objType.key === ObjectType.ServiceEndpoint) {
        context.dispatch('GET_SERVICE_ENDPOINTS', params.duration);
      } else if (objType.key === ObjectType.Database) {
        context.dispatch('GET_DATABASES', {duration: params.duration});
      }
    }
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

        context.commit(types.SET_CHARTVAL, data);
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
