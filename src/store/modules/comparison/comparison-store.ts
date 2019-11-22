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
import fragmentAll from '@/graph/query/comparison';
import { ICurrentOptions, DataSourceType, ISelectConfig, MetricsType } from '@/types/comparison';
import {
  ComparisonOption, InitSource, LinearType, ComparisonType,
  ObjectType, ServiceType, ChangeType, StatusType, PercentileType,
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
    const { preMetrics } = state.currentOptions;
    const fragments = [];
    let variable = null;

    for (const metric of preMetrics) {
      const preMetric = metric.key;
      const preParam = (fragmentAll as any)[preMetric];
      if (preParam) {
        variable = preParam.variable;
        fragments.push(preParam.fragment);
      }
    }
    return `query queryData(${variable}) {${fragments.join(',')}}`;
  },
  queryNextValue(state: State) {
    const { nextMetrics } = state.currentOptions;
    const fragments = [];
    let variable = null;

    for (const metric of nextMetrics) {
      const nextParam = (fragmentAll as any)[metric.key];
      if (nextParam) {
        variable = nextParam.variable;
        fragments.push(nextParam.fragment);
      }
    }
    return `query queryData(${variable}) {${fragments.join(',')}}`;
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
    } else if (key === ObjectType.ServiceDependency) {
      delete variablesData.serviceId;
      variablesData.id = currentOptions.preObject.key;
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
      delete variablesData.serviceId;
      variablesData.databaseId = nextObject.key;
    } else if (nextType.key === ObjectType.ServiceDependency) {
      delete variablesData.serviceId;
      variablesData.id = nextObject.key;
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
      ServiceDependency: [],
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
      } else if (item.o === ObjectType.ServiceDependency) {
        MetricsObj.ServiceDependency.push({
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
    if (!data.length) {
      data = [{
        key: '',
        label: '',
      }];
    }
    const { isPrevious, currentOptions, metricSource } = state as any;
    const type = isPrevious === StatusType.Pre ? currentOptions.preType.key : currentOptions.nextType.key;

    if (isPrevious === StatusType.Pre) {
      state.dataSource.preObjectSource = data;
      state.currentOptions.preObject = data[0];
      state.dataSource.preMetricsSource = metricSource[type];
      state.currentOptions.preMetrics = [metricSource[type][0]];
    } else if (isPrevious === StatusType.Next) {
      state.dataSource.nextObjectSource = data;
      state.currentOptions.nextObject = data[0];
      state.dataSource.nextMetricsSource = metricSource[type];
      state.currentOptions.nextMetrics = [metricSource[type][1]];
    } else {
      state.currentOptions = {
        ...state.currentOptions,
        nextObject: data[0],
        preObject: data[0],
        preMetrics: [metricSource[type][0]],
        nextMetrics: [metricSource[type][1]],
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
    const { preObject, preService, preType, preMetrics } = state.currentOptions;
    const { nextObject, nextService, nextType, nextMetrics } = state.currentOptions;
    const metrics = data.type === ServiceType.PREVIOUS ? preMetrics : nextMetrics;
    const obj = {} as any;
    for (const key of Object.keys(data.value)) {
      const value = data.value[key].values.map((d: {value: number}) => d.value);
      obj[key] = value;
    }
    for (const metric of metrics) {
      const title = metric.key;
      const percentile = PercentileType[title];
      if (percentile) {
        obj[metric.label] = {};
        for (const item of percentile) {
          obj[metric.label][item] = obj[item];
          delete obj[item];
        }
      }
    }
    for (const key of Object.keys(obj)) {
      if (data.type === ServiceType.PREVIOUS) {
        const str = `${preService.label}_`;
        const strKeyPre = `${preType.key === ObjectType.Database ?
          '' : str}${preType.key === ObjectType.Service ? '' : preObject.label}_${key}`;
        obj[strKeyPre] = obj[key];
        delete obj[key];
      } else {
        const str = `${nextObject.label}`;
        const servicesLabel =  `${nextService.label}_`;
        const strKeyNext = `${nextType.key === ObjectType.Database ?
          '' : servicesLabel}${nextType.key === ObjectType.Service ? '' : str}_${key}`;
        obj[strKeyNext] = obj[key];
        delete obj[key];
      }
    }
    state.chartSource = {
      ...obj,
      ...state.chartSource,
    };
  },
  [types.UPDATE_CONFIG](state: any, data: ISelectConfig) {
    const {type, option} = data;
    const { currentOptions, isPrevious } = state;
    const { nextType, preType } = currentOptions;

    if (type === ChangeType.NextMetrics || type === ChangeType.PreMetrics) {
      const metrics = currentOptions[type];
      const item = metrics.findIndex((d: any) => d.key === option.key);

      if (item > -1) {
        state.currentOptions[type] = metrics.filter((d: any) => d.key !== option.key);
      } else {
        state.currentOptions[type].push(option);
      }
    } else {
      state.currentOptions[type] = option;
    }
  },
  [types.CLEAR_CHART_VAL](state: State) {
    state.chartSource = {} as any;
  },
  [types.SELECT_TYPE_SERVICES](state: State) {
    const { preType, nextType } = state.currentOptions;
    const { isPrevious, metricSource } = state as any;

    if (isPrevious === StatusType.Pre) {
      state.dataSource.preMetricsSource = metricSource[preType.key] || [];
      state.currentOptions.preMetrics = [metricSource[preType.key][0]];
    } else {
      state.dataSource.nextMetricsSource = metricSource[nextType.key] || [];
      state.currentOptions.nextMetrics = [metricSource[nextType.key][0]];
    }
  },
  [types.SELECT_INSTANCE_DATABASE](state: State, data: any) {
    const { preType, nextType } = state.currentOptions;
    const { metricSource, isPrevious } = state as any;

    if (isPrevious === StatusType.Next) {
      state.dataSource.nextMetricsSource = metricSource[nextType.key];
      state.currentOptions.nextMetrics = [metricSource[nextType.key][0]];
      state.currentOptions.nextObject = data[0];
      state.dataSource.nextObjectSource = data;
    } else if (isPrevious === StatusType.Pre) {
      state.dataSource.preMetricsSource = metricSource[preType.key];
      state.currentOptions.preMetrics = [metricSource[preType.key][0]];
      state.currentOptions.preObject = data[0];
      state.dataSource.preObjectSource = data;
    }
  },
  [types.SET_SERVICE_TOPOLOGY](state: State, data: any) {
    const { calls, nodes } = data;
    const { metricSource } = state as any;
    const { preType, nextType } = state.currentOptions;
    for (const call of calls) {
      for (const node of nodes) {
        if (node.id === call.source) {
          call.sourceLabel = node.name;
        }
        if (node.id === call.target) {
          call.targetLabel = node.name;
        }
      }
    }
    const objectSource = calls.map((call: any) => {
      return {
        key: call.id,
        label: `${call.sourceLabel}-${call.targetLabel}`,
      };
    });
    if (state.isPrevious === StatusType.Next) {
      state.dataSource.nextMetricsSource = metricSource[nextType.key];
      state.currentOptions.nextMetrics = [metricSource[nextType.key][0]];
      state.currentOptions.nextObject = objectSource[0];
      state.dataSource.nextObjectSource = objectSource;
    } else {
      state.dataSource.preMetricsSource = metricSource[preType.key];
      state.currentOptions.preMetrics = [metricSource[preType.key][0]];
      state.currentOptions.preObject = objectSource[0];
      state.dataSource.preObjectSource = objectSource;
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
        return res.data.data;
      }).then((data) => {
        if (!data.getEndpoints) {
          return;
        }
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
        context.commit(types.SELECT_INSTANCE_DATABASE, res.data.data.getServiceInstances);
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
        context.commit(types.SELECT_INSTANCE_DATABASE, res.data.data.services);
      });
  },
  GET_SERVICE_TOPOLOGY(context: { commit: Commit, state: State  }, params) {
    const { isPrevious, currentOptions } = context.state;
    params.serviceId = isPrevious === StatusType.Pre ? currentOptions.preService.key : currentOptions.nextService.key;
    return graph
      .query('queryServiceTopo')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit(types.SET_SERVICE_TOPOLOGY, res.data.data.topo);
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
      } else if (objType.key === ObjectType.ServiceDependency) {
        context.dispatch('GET_SERVICE_TOPOLOGY', {duration: params.duration});
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
        context.dispatch('FORMAT_VALUE', {value: data, type: param.type});
    });
  },
  FORMAT_VALUE(context: {commit: Commit, state: State, dispatch: Dispatch}, params: {value: any, type: string}) {
    if (!(params && params.value)) {
      return;
    }
    if (params.value.endpointSLA) {
      params.value.endpointSLA.values = params.value.endpointSLA.values.map((i: any) => {
        return {value: i.value / 100};
      });
    }
    if (params.value.databaseSLA) {
      params.value.databaseSLA.values = params.value.databaseSLA.values.map((i: any) => {
        return {value: i.value / 100};
    });
    }
    if (params.value.serviceSLA) {
      params.value.serviceSLA.values = params.value.serviceSLA.values.map((i: any) => {
        return {value: i.value / 100};
      });
    }
    if (params.value.instanceSLA) {
      params.value.instanceSLA.values = params.value.instanceSLA.values.map((i: any) => {
        return {value: i.value / 100};
      });
    }
    if (params.value.heap && params.value.maxHeap) {
      params.value.heap.values = params.value.heap.values.map((i: any) => {
        return {value: (i.value / 1048576).toFixed(2)};
      });
      params.value.maxHeap.values = params.value.maxHeap.values.map((i: any, index: number) => {
        const val = i.value > -1 ? ((i.value / 1048576) - params.value.heap.values[index].value).toFixed(2) : 0;
        return {value: val};
      });
      if (Math.max.apply(Math, params.value.maxHeap.values) === -1) {
        params.value.maxHeap.values = 'Max Heap Unlimited';
      }
    }
    if (params.value.nonheap && params.value.maxNonHeap) {
      params.value.nonheap.values = params.value.nonheap.values.map((i: any) => {
        return {value : (i.value / 1048576).toFixed(2)};
      });
      params.value.maxNonHeap.values = params.value.maxNonHeap.values
        .map((i: any, index: number) => {
          const val = i.value > -1 ? ((i.value / 1048576) - params.value.nonheap.values[index].value).toFixed(2) : 0;
          return {value: val};
        });
      if (Math.max.apply(Math, params.value.maxNonHeap.values) === -1) {
        params.value.maxNonHeap.values = 'Max NonHeap Unlimited';
      }
    }
    if (params.value.clrHeap) {
      params.value.clrHeap.values =
      params.value.clrHeap.values.map((i: any) => {
        return { value: (i.value / 1048576 ).toFixed(2)};
      });
    }
    context.commit(types.SET_CHARTVAL, params);
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
