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
import { AxiosResponse } from 'axios';
import { State } from './dashboard-data';
import graph from '@/graph';
import { TopologyType } from '@/constants/constant';

// actions
const actions: ActionTree<State, any> = {
  GET_QUERY(
    context: { commit: Commit; dispatch: Dispatch; getters: any; state: State; rootState: any },
    params: {
      index: number;
      duration: any;
      type: string;
      rocketOption: any;
      templateType: string;
      templateMode: string;
    },
  ) {
    const {
      currentDatabase,
      currentEndpoint,
      currentInstance,
      currentService,
      destService,
      destInstance,
    } = params.rocketOption;
    const dashboard: string = `${window.localStorage.getItem('dashboard')}`;
    const tree = dashboard ? JSON.parse(dashboard) : context.state.tree;
    const normal = params.type ? true : tree[context.state.group].type === 'database' ? false : true;
    let config = {} as any;
    const names = ['readSampledRecords', 'sortMetrics'];
    if (params.type === TopologyType.TOPOLOGY_ENDPOINT) {
      const endpointComps: string = `${window.localStorage.getItem('topologyEndpoints')}`;
      const topoEndpoint = endpointComps ? JSON.parse(endpointComps) : [];
      config = topoEndpoint[params.index];
    } else if (params.type === TopologyType.TOPOLOGY_INSTANCE) {
      const instanceComps: string = `${window.localStorage.getItem('topologyInstances')}`;
      const topoInstance = instanceComps ? JSON.parse(instanceComps) : [];
      config = topoInstance[params.index];
    } else if (params.type === TopologyType.TOPOLOGY_SERVICE) {
      const serviceComps: string = `${window.localStorage.getItem('topologyServices')}`;
      const topoService = serviceComps ? JSON.parse(serviceComps) : {};

      if (!topoService[params.templateType]) {
        return new Promise((resolve) => resolve({}));
      }
      config = topoService[params.templateType][params.index];
    } else if (params.type === TopologyType.TOPOLOGY_SERVICE_DEPENDENCY) {
      const serviceDependencyComps: string = `${window.localStorage.getItem('topologyServicesDependency')}`;
      const topoServiceDependency = serviceDependencyComps ? JSON.parse(serviceDependencyComps) : {};
      if (
        !(topoServiceDependency[params.templateType] && topoServiceDependency[params.templateType][params.templateMode])
      ) {
        return new Promise((resolve) => resolve({}));
      }
      config = topoServiceDependency[params.templateType][params.templateMode][params.index];
    } else if (params.type === TopologyType.TOPOLOGY_SERVICE_INSTANCE_DEPENDENCY) {
      const serviceInstanceDependencyComps: string = `${localStorage.getItem('topologyServicesInstanceDependency')}`;
      const topoServiceInstanceDependency = serviceInstanceDependencyComps
        ? JSON.parse(serviceInstanceDependencyComps)
        : {};
      if (
        !(
          topoServiceInstanceDependency[params.templateType] &&
          topoServiceInstanceDependency[params.templateType][params.templateMode]
        )
      ) {
        return new Promise((resolve) => resolve({}));
      }
      config = topoServiceInstanceDependency[params.templateType][params.templateMode][params.index];
    } else {
      config = tree[context.state.group].children[context.state.current].children[params.index];
    }
    if (!config) {
      return new Promise((resolve) => resolve({}));
    }
    if (!config.metricName) {
      return new Promise((resolve) => resolve({}));
    }
    // remove the space at the beginning and end of the string
    const metricNames = config.metricName.split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    const labelsIndex = (config.labelsIndex || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    const currentServiceId = config.independentSelector ? config.currentService : currentService.label;
    const currentInstanceId = config.independentSelector ? config.currentInstance : currentInstance.label;
    const currentEndpointId = config.independentSelector ? config.currentEndpoint : currentEndpoint.label;
    const currentDatabaseId = config.independentSelector ? config.currentDatabase : currentDatabase.label;
    const labels = config.metricType === 'LABELED_VALUE' ? labelsIndex : undefined;
    const isRelation = ['ServiceRelation', 'ServiceInstanceRelation', 'EndpointRelation'].includes(config.entityType);
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
                topN: Number(config.maxItemNum) || 10,
                order: config.sortOrder || 'DES',
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
        if (names.includes(config.queryMetricType)) {
          const parentService = normal ? currentServiceId : currentDatabaseId;

          if (config.parentService && !parentService) {
            return;
          }
          variables = {
            duration: params.duration,
            condition: {
              name,
              parentService: config.parentService ? parentService : null,
              normal,
              scope: normal ? config.entityType : config.parentService ? 'Service' : config.entityType,
              topN: Number(config.maxItemNum) || 10,
              order: config.sortOrder || 'DES',
            },
          };
        } else {
          const serviceName = normal ? currentServiceId : currentDatabaseId;
          if (!serviceName) {
            return null;
          }
          if (config.entityType === 'ServiceInstance' && !currentInstanceId) {
            return null;
          }
          if (config.entityType === 'Endpoint' && !currentEndpointId) {
            return null;
          }
          variables = {
            duration: params.duration,
            condition: {
              name,
              entity: {
                scope: normal ? config.entityType : 'Service',
                serviceName,
                serviceInstanceName: config.entityType.includes('ServiceInstance') ? currentInstanceId : undefined,
                endpointName: config.entityType.includes('Endpoint') ? currentEndpointId : undefined,
                normal,
                destNormal: isRelation ? normal : undefined,
                destServiceName: isRelation ? destService.label : undefined,
                destServiceInstanceName: isRelation
                  ? config.entityType === 'ServiceInstanceRelation'
                    ? destInstance.label
                    : undefined
                  : undefined,
                destEndpointName: isRelation
                  ? config.entityType === 'EndpointRelation'
                    ? destInstance.label
                    : undefined
                  : undefined,
              },
            },
            labels,
          };
        }
      }

      return variables;
    });

    if (!config.queryMetricType || !variablesList.length) {
      return;
    }
    return Promise.all(
      variablesList.map((variable: any) => {
        if (variable) {
          return graph
            .query(config.queryMetricType)
            .params(variable)
            .then((res: AxiosResponse) => {
              const resData = res.data.data;

              return { ...resData, config, metricName: variable.condition.name };
            });
        } else {
          return { config };
        }
      }),
    ).then((data: any) => {
      return data;
    });
  },
  GET_METRICS_CONFIG(
    context: { state: State },
    params: { type: string; index: number; templateType: string; tree: any },
  ) {
    let config = {};
    if (params.type === TopologyType.TOPOLOGY_ENDPOINT) {
      const endpointComps: string = `${window.localStorage.getItem('topologyEndpoints')}`;
      const topoEndpoint = endpointComps ? JSON.parse(endpointComps) : [];
      config = topoEndpoint[params.index];
    } else if (params.type === TopologyType.TOPOLOGY_INSTANCE) {
      const instanceComps: string = `${window.localStorage.getItem('topologyInstances')}`;
      const topoInstance = instanceComps ? JSON.parse(instanceComps) : [];
      config = topoInstance[params.index];
    } else if (params.type === TopologyType.TOPOLOGY_SERVICE) {
      const serviceComps: string = `${window.localStorage.getItem('topologyServices')}`;
      const topoService = serviceComps ? JSON.parse(serviceComps) : {};

      if (!topoService[params.templateType]) {
        return new Promise((resolve) => resolve({}));
      }
      config = topoService[params.templateType][params.index];
    } else {
      config = params.tree[context.state.group].children[context.state.current].children[params.index];
    }
    return config;
  },
};

export default {
  actions,
};
