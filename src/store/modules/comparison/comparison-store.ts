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
import axios, { AxiosResponse } from 'axios';

import graph from '@/graph';
import { cancelToken } from '@/utils/cancelToken';
import * as types from '../../mutation-types';
import { DurationTime } from '@/types/global';
import { queryChartData } from '@/utils/queryChartData';
import fragmentAll from '@/store/modules/dashboard/fragments';
import { ICurrentOptions, DataSourceType, ISelectConfig, MetricsType } from '@/types/comparison';
import {
  ComparisonOption, InitSource, LinearType, ComparisonType,
  ObjectType, ServiceType, ChangeType, StatusType,
} from './comparison-const';

type GenericIdentityFn<T> = (arg: T) => T;

function identity<T>(arg: T): T {
  return arg;
}
export interface State {
  currentOptions: ICurrentOptions;
  dataSource: DataSourceType;
  chartSource: GenericIdentityFn<any>;
  isPrevious: StatusType;
  metricSource: MetricsType;
}

interface ActionsParamType {
  duration: DurationTime;
}

const initState: State = {
  currentOptions: ComparisonOption,
  dataSource: InitSource,
  chartSource: identity,
  isPrevious: StatusType.Init,
  metricSource: {} as MetricsType,
};

// getters
const getters = {
  queryPreValue(state: State) {
    const { currentOptions } = state;
    const preMetric = currentOptions.preMetrics.key;
    const preParam = (fragmentAll as any)[preMetric];
    if (!preParam) {
      return;
    }

    return `query queryData(${preParam.variable.join(',')}) {${preParam.fragment}}`;
  },
  queryNextValue(state: State) {
    const { currentOptions } = state;
    const nextMetric =  currentOptions.nextMetrics.key;
    const nextParam = (fragmentAll as any)[nextMetric];

    if (!nextParam) {
      return;
    }
    return `query queryData(${nextParam.variable.join(',')}) {${nextParam.fragment}}`;
  },
  preConfig(state: State) {
    const { currentOptions } = state;
    const variablesData = {
      serviceId: currentOptions.preService.key,
    } as any;
    const { key } = currentOptions.preType;

    if (key === ObjectType.ServiceEndpoint) {
        variablesData.endpointId = currentOptions.preObject.key;
        variablesData.endpointName = currentOptions.preObject.label;
    } else if (key === ObjectType.ServiceInstance) {
      variablesData.instanceId = currentOptions.preObject.key;
    } else if (key === ObjectType.Database) {
      delete variablesData.serviceId;
      variablesData.databaseId = currentOptions.preObject.key;
    }

    return variablesData;
  },
  nextConfig(state: State) {
    const { currentOptions } = state;
    const { nextType, nextService, nextObject } = currentOptions;
    let variablesData = {serviceId: nextService.key} as any;

    if (nextType.key === ObjectType.ServiceEndpoint) {
      variablesData = {
        ...variablesData,
        endpointId: nextObject.key,
        endpointName: nextObject.label,
      };
    } else if (nextType.key === ObjectType.ServiceInstance) {
      variablesData = {
        ...variablesData,
        instanceId: nextObject.key,
      };
    } else if (nextType.key === ObjectType.Database) {
      variablesData.databaseId = nextObject.key;
    }

    return variablesData;
  },
  ChangeType() {
    return {
      PreService: ChangeType.PreService,
      PreType: ChangeType.PreType,
      PreObject: ChangeType.PreObject,
      PreMetrics: ChangeType.PreMetrics,
      NextService: ChangeType.NextService,
      NextType: ChangeType.NextType,
      NextObject: ChangeType.NextObject,
      NextMetrics: ChangeType.NextMetrics,
    };
  },
  AllMetrics() {
    const { service, database } = queryChartData;
    const MetricsObj = {
      Service: [],
      ServiceEndpoint: [],
      ServiceInstance: [],
      Database: [],
    } as MetricsType;

    for (const item of service) {
      if (!LinearType.includes(item.c)) {
        continue;
      }
      if (item.o === ObjectType.Service) {
        MetricsObj.Service.push({
          label: item.t,
          key: item.d,
        });
      } else if (item.o === ObjectType.ServiceInstance) {
        MetricsObj.ServiceInstance.push({
          label: item.t,
          key: item.d,
        });
      } else if (item.o === ObjectType.ServiceEndpoint) {
        MetricsObj.ServiceEndpoint.push({
          label: item.t,
          key: item.d,
        });
      }
    }
    for (const data of database) {
      if (!LinearType.includes(data.c)) {
        continue;
      }
      if (data.o === ObjectType.Database) {
        MetricsObj.Database.push({
          label: data.t,
          key: data.d,
        });
      }
    }

    return MetricsObj;
  },
};

// mutations
const mutations = {
  [types.SET_ISPREVIOUS](state: State, data: StatusType) {
    state.isPrevious = data;
  },
  [types.SET_METRICSOURCE](state: State, source: MetricsType) {
    state.metricSource = source;
  },
  [types.SET_SERVICES](state: State, data: {services: any[]}) {
    const { services } = data;

    if (!services.length) {
      return;
    }
    state.dataSource.preServiceSource = services;
    state.dataSource.nextServiceSource = services;
    state.currentOptions.preService = services[0];
    state.currentOptions.nextService = services[0];
  },
  [types.SET_CONFIG](state: State, data: any[]) {
    const { isPrevious, currentOptions, metricSource } = state as any;
    const type = isPrevious === StatusType.Pre ? currentOptions.preType.key : currentOptions.nextType.key;

    if (isPrevious === StatusType.Pre) {
      state.dataSource.preObjectSource = data;
      state.currentOptions.preObject = data[0];
      state.dataSource.preMetricsSource = metricSource[type];
      state.currentOptions.preMetrics = metricSource[type][0];
    } else if (isPrevious === StatusType.Next) {
      state.dataSource.nextObjectSource = data;
      state.currentOptions.nextObject = data[0];
      state.dataSource.nextMetricsSource = metricSource[type];
      state.currentOptions.nextMetrics = metricSource[type][1];
    } else {
      state.currentOptions = {
        ...state.currentOptions,
        nextObject: data[0],
        preObject: data[0],
        preMetrics: metricSource[type][0],
        nextMetrics: metricSource[type][1],
        preType: ComparisonType[2],
        nextType: ComparisonType[2],
      };
      state.dataSource = {
        ...state.dataSource,
        nextObjectSource: data,
        preObjectSource: data,
        preMetricsSource: metricSource[type],
        nextMetricsSource: metricSource[type],
      };
    }
  },
  [types.SET_CHARTVAL](state: State, data: {value: any, type: string}) {
    const keys = Object.keys(data.value);
    const obj = {} as any;
    for (const key of keys) {
      const value = data.value[key].values.map((d: {value: number}) => d.value);
      if (data.type === ServiceType.PREVIOUS) {
        const { preObject, preService, preType } = state.currentOptions;
        const str = `${preService.label}-`;
        const strKeyPre = `${preType.key === ObjectType.Database ? '' : str}${preType.key === ObjectType.Service ? '' : preObject.label}-${key}`;
        obj[strKeyPre] = value;
      } else {
        const { nextObject, nextService, nextType } = state.currentOptions;
        const str = `${nextObject.label}`;
        const servicesLabel =  `${nextService.label}-`;
        const strKeyNext = `${nextType.key === ObjectType.Database ? '' : servicesLabel}${nextType.key === ObjectType.Service ? '' : str}-${key}`;
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
    const { preType, nextType } = state.currentOptions;
    const { isPrevious, metricSource } = state as any;

    if (isPrevious === StatusType.Pre) {
      state.dataSource.preMetricsSource = metricSource[preType.key] || [];
      state.currentOptions.preMetrics = metricSource[preType.key][0];
    } else {
      state.dataSource.nextMetricsSource = metricSource[nextType.key] || [];
      state.currentOptions.nextMetrics = metricSource[nextType.key][0];
    }
  },
  [types.SELECT_TYPE_INSTANCE](state: State, data: any) {
    const { preType, nextType } = state.currentOptions;
    const { isPrevious, metricSource } = state as any;

    if (isPrevious === StatusType.Pre) {
      state.dataSource.preMetricsSource = metricSource[preType.key];
      state.currentOptions.preMetrics = metricSource[preType.key][0];
      state.dataSource.preObjectSource = data;
      state.currentOptions.preObject = data[0];
    } else if (isPrevious === StatusType.Next) {
      state.dataSource.nextMetricsSource = metricSource[nextType.key];
      state.currentOptions.nextMetrics = metricSource[nextType.key][0];
      state.dataSource.nextObjectSource = data;
      state.currentOptions.nextObject = data[0];
    }
  },
  [types.SELECT_TYPE_DATABASE](state: State, data: any) {
    const { preType, nextType } = state.currentOptions;
    const metricSource = state.metricSource as any;

    if (state.isPrevious === StatusType.Next) {
      state.dataSource.nextMetricsSource = metricSource[nextType.key];
      state.currentOptions.nextMetrics = metricSource[nextType.key][0];
      state.currentOptions.nextObject = data[0];
      state.dataSource.nextObjectSource = data;
    } else {
      state.dataSource.preMetricsSource = metricSource[preType.key];
      state.currentOptions.preMetrics = metricSource[preType.key][0];
      state.currentOptions.preObject = data[0];
      state.dataSource.preObjectSource = data;
    }
  },
};

// actions
const actions: ActionTree<State, ActionsParamType> = {
  GET_SERVICES(context: {commit: Commit, dispatch: Dispatch, getters: any, state: State}, params: {
    duration: string;
  }) {
    if (context.state.isPrevious !== StatusType.Init) {
      return;
    }

    context.commit(types.SET_METRICSOURCE, context.getters.AllMetrics);
    context.commit(types.SET_ISPREVIOUS, StatusType.Init);
    return graph.query('queryServices').params(params)
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit(types.SET_SERVICES, {services: res.data.data.services});
      }).then(() => {
        context.dispatch('GET_SERVICE_ENDPOINTS', params.duration);
      });
  },
  GET_SERVICE_ENDPOINTS(context: { commit: Commit, state: State, dispatch: Dispatch }, date: string) {
    if (!context.state.currentOptions.preService) {
      return new Promise((resolve) => resolve());
    }
    const { isPrevious, currentOptions } = context.state;
    const servicesId = isPrevious === StatusType.Pre ? currentOptions.preService.key : currentOptions.nextService.key;
    graph
      .query('queryEndpoints')
      .params({serviceId: servicesId, keyword: ''})
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit(types.SET_CONFIG, res.data.data.getEndpoints);
      }).then(() => {
        if (isPrevious === StatusType.Init) {
          context.dispatch('RENDER_CHART', date);
        }
      });
  },
  GET_SERVICE_INSTANCES(context: { commit: Commit, state: State }, params) {
    const { isPrevious, currentOptions } = context.state;
    params.serviceId = isPrevious === StatusType.Pre ? currentOptions.preService.key : currentOptions.nextService.key;
    return graph
      .query('queryInstances')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data) {
          return;
        }
        context.commit(types.SELECT_TYPE_INSTANCE, res.data.data.getServiceInstances);
      });
  },
  GET_DATABASES(context: { commit: Commit, state: State  }, params: {duration: string}) {
    return graph
      .query('queryDatabases')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data) {
          return;
        }
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
        if (!data) {
          return;
        }
        context.commit(types.SET_CHARTVAL, {value: data, type: param.type});
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
