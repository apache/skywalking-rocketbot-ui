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

import { Commit, ActionTree, Dispatch, MutationTree } from 'vuex';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { cancelToken } from '@/utils/cancelToken';
import { State } from './dashboard-data';
import fragmentAll from '@/store/modules/dashboard/fragments';

// actions
const actions: ActionTree<State, any> = {
  GET_QUERY(
    context: { commit: Commit; dispatch: Dispatch; getters: any; state: State; rootState: any },
    params,
  ): AxiosPromise<void> {
    const { currentDatabase, currentEndpoint, currentInstance, currentService } = context.rootState.rocketOption;
    const normal = context.state.tree[context.state.group].type === 'database' ? false : true;
    const config = context.state.tree[context.state.group].children[context.state.current].children[params.index];
    const names = ['readSampledRecords', 'sortMetrics'];
    const currentServiceId = config.independentSelector ? config.currentService : currentService.key;
    const currentInstanceId = config.independentSelector ? config.currentInstance : currentInstance.key;
    const currentEndpointId = config.independentSelector ? config.currentEndpoint : currentEndpoint.key;
    const variables = names.includes(config.queryMetricType)
      ? {
          duration: params.duration,
          condition: {
            name: config.metricName,
            parentService: config.entityType !== 'All' ? currentServiceId : null,
            normal,
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
              serviceName: config.entityType !== 'All' ? currentServiceId : undefined,
              serviceInstanceName: config.entityType === 'ServiceInstance' ? currentInstanceId : undefined,
              endpointName: config.entityType === 'Endpoint' ? currentEndpointId : undefined,
              normal,
              // destNormal: normal,
              // destServiceName: '',
              // destServiceInstanceName: '',
              // destEndpointName: '',
            },
          },
        };
    const globalArr: any = fragmentAll;
    const fragments = globalArr[config.queryMetricType].fragment;
    const queryVariables = globalArr[config.queryMetricType].variable;
    const query = `query queryData(${queryVariables}) {${fragments}}`;

    return axios
      .post(
        '/graphql',
        {
          query,
          variables,
        },
        { cancelToken: cancelToken() },
      )
      .then((res: AxiosResponse<any>) => {
        const resData = res.data.data;
        // if (resData.data && resData.data.endpointTopology) {
        //   const endpointIds = resData.data.endpointTopology.nodes
        //     .map((n: any) => n.name)
        //     .filter(function onlyUnique(value: any, index: number, self: any) {
        //       return self.indexOf(value) === index;
        //     });
        //   Promise.all(
        //     endpointIds.map((id: any) => {
        //       return axios
        //         .post('/graphql', {
        //           query: EndPointInfoGraphql,
        //           variables: { endpointId: `${id}` },
        //         })
        //         .then((endpointRes: AxiosResponse<any>) => {
        //           return endpointRes.data.data.endpointInfo;
        //         });
        //     }),
        //   ).then((endpointInfos) => {
        //     resData.data.endpointTopology.endpoints = endpointInfos;
        //     context.dispatch('COOK_SOURCE', resData);
        //   });
        // } else {
        //   context.dispatch('COOK_SOURCE', resData);
        // }
        // const data = Object.values(resData)[0] || ({} as any);
        // context.dispatch('COOK_SOURCE', { ...data, id: config.id, metricName: config.metricName });
        // if (Number(data)) {
        //   return { ...resData, id: config.id, metricName: config.metricName };
        // }
        return { ...resData, id: config.id, metricName: config.metricName };
      });
  },
};

export default {
  actions,
};
