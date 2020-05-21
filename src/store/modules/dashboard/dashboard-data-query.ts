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
    const normal = context.state.tree[context.state.group].type === 'database' ? false : true;
    const config = context.state.tree[context.state.group].children[context.state.current].children[params.index];
    const names = ['readSampledRecords', 'sortMetrics'];
    if (!config) {
      return;
    }
    if (!config.metricName) {
      return;
    }
    const metricNames = config.metricName.split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    const metricLabels = (config.metricLabels || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    const currentServiceId = config.independentSelector ? config.currentService : currentService.key;
    const currentInstanceId = config.independentSelector ? config.currentInstance : currentInstance.key;
    const currentEndpointId = config.independentSelector ? config.currentEndpoint : currentEndpoint.key;
    const currentDatabaseId = config.independentSelector ? config.currentDatabase : currentDatabase.key;
    const labels = config.metricType === 'LABELED_VALUE' ? metricLabels : undefined;
    let variables = {} as any;

    if (config.entityType === 'All') {
      variables = names.includes(config.queryMetricType)
        ? {
            duration: params.duration,
            condition: {
              name: config.metricName,
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
              name: config.metricName,
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
              name: config.metricName,
              parentService: normal ? currentServiceId : currentDatabaseId,
              normal,
              scope: normal ? config.entityType : 'Service',
              topN: 10,
              order: 'DES',
            },
          }
        : {
            duration: params.duration,
            condition: {
              name: config.metricName,
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

    const globalArr: any = fragmentAll;
    if (!config.queryMetricType) {
      return;
    }
    const fragments = globalArr[config.queryMetricType].fragment;
    const queryVariables = globalArr[config.queryMetricType].variable;
    const query = `query queryData(${queryVariables}) {${fragments}}`;

    return Promise.all(
      metricNames.map((name: string) => {
        variables.condition.name = name;
        return axios
          .post('/graphql', { query, variables }, { cancelToken: cancelToken() })
          .then((res: AxiosResponse<any>) => {
            const resData = res.data.data;

            return { ...resData, id: config.id, metricName: name };
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
