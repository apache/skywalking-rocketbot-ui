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
import { cancelToken } from '@/utils/cancelToken';
import { State } from './dashboard-data';
import fragmentAll from './constant-metrics-query';

// actions
const actions: ActionTree<State, any> = {
  GET_QUERY(
    context: { commit: Commit; dispatch: Dispatch; getters: any; state: State; rootState: any },
    params: {
      index: number;
      duration: any;
    },
  ) {
    const { currentDatabase, currentEndpoint, currentInstance, currentService } = context.rootState.rocketOption;
    const dashboard: string = `${window.localStorage.getItem('dashboard')}`;
    const tree = JSON.parse(dashboard);
    const normal = tree[context.state.group].type === 'database' ? false : true;
    const config = tree[context.state.group].children[context.state.current].children[params.index];
    const names = ['readSampledRecords', 'sortMetrics'];
    if (!config) {
      return;
    }
    if (!config.metricName) {
      return;
    }
    // remove the space at the beginning and end of the string
    const metricNames = config.metricName.split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    const labelsIndex = (config.labelsIndex || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    const currentServiceId = config.independentSelector ? config.currentService : currentService.label;
    const currentInstanceId = config.independentSelector ? config.currentInstance : currentInstance.label;
    const currentEndpointId = config.independentSelector ? config.currentEndpoint : currentEndpoint.label;
    const currentDatabaseId = config.independentSelector ? config.currentDatabase : currentDatabase.label;
    const labels = config.metricType === 'LABELED_VALUE' ? labelsIndex : undefined;
    const variablesList = metricNames.map((name: string) => {
      let variables = {} as any;

      if (config.entityType === 'All') {
        variables = names.includes(config.queryMetricType)
          ? {
              duration: params.duration,
              condition: {
                name,
                parentService: null,
                normal: true,
                scope: config.entityType,
                topN: 10,
                order: 'DES',
              },
            }
          : {
              duration: params.duration,
              condition: {
                name,
                entity: {
                  scope: config.entityType,
                  normal: true,
                },
              },
              labels,
            };
      } else {
        variables = names.includes(config.queryMetricType)
          ? {
              duration: params.duration,
              condition: {
                name,
                parentService: config.parentService ? (normal ? currentServiceId : currentDatabaseId) : null,
                normal,
                scope: normal ? config.entityType : config.parentService ? 'Service' : config.entityType,
                topN: 10,
                order: 'DES',
              },
            }
          : {
              duration: params.duration,
              condition: {
                name,
                entity: {
                  scope: normal ? config.entityType : 'Service',
                  serviceName: normal ? currentServiceId : currentDatabaseId,
                  serviceInstanceName: config.entityType === 'ServiceInstance' ? currentInstanceId : undefined,
                  endpointName: config.entityType === 'Endpoint' ? currentEndpointId : undefined,
                  normal,
                  // destNormal: normal,
                  // destServiceName: '',
                  // destServiceInstanceName: '',
                  // destEndpointName: '',
                },
              },
              labels,
            };
      }

      return variables;
    });

    const globalArr: any = fragmentAll;
    if (!config.queryMetricType || !variablesList.length) {
      return;
    }
    const fragments = globalArr[config.queryMetricType].fragment;
    const queryVariables = globalArr[config.queryMetricType].variable;
    const query = `query queryData(${queryVariables}) {${fragments}}`;

    return Promise.all(
      variablesList.map((variable: string, index: string) => {
        return axios
          .post('/graphql', { query, variables: variable }, { cancelToken: cancelToken() })
          .then((res: AxiosResponse<any>) => {
            const resData = res.data.data;

            return { ...resData, config, metricName: variablesList[index].condition.name };
          });
      }),
    ).then((data: any) => {
      return data;
    });
  },
};

export default {
  actions,
};
