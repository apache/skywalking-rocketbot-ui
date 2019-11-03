/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the 'License'); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { IOption, ICurrentOptions, DataSourceType } from '@/types/comparison';

export const ComparisonType: IOption[] = [
  {key: 'Service', label: 'Service'},
  {key: 'ServiceInstance', label: 'Service Instance'},
  {key: 'ServiceEndpoint', label: 'Service Endpoint'},
];

export const ComparisonOption: ICurrentOptions = {
  preService: {key: 0, label: ''},
  preType: {key: 'ServiceEndpoint', label: 'Service Endpoint'},
  preObject: {key: 0, label: '/projectB/{name}'},
  preMetrics: {key: 0, label: 'avg'},
  nextService: {key: 0, label: ''},
  nextType: {key: 'ServiceEndpoint', label: 'Service Endpoint'},
  nextObject: {key: 0, label: '/projectA/{name}'},
  nextMetrics: {key: 0, label: 'avg'},
};

export const InitSource: DataSourceType = {
  preServiceSource: [],
  preTypeSource: ComparisonType,
  preObjectSource: [],
  preMetricsSource: [],
  nextServiceSource: [],
  nextTypeSource: ComparisonType,
  nextObjectSource: [],
  nextMetricsSource: [],
};

export enum ChangeType {
  PreService = 'preService',
  PreType = 'preType',
  PreObject = 'preObject',
  PreMetrics = 'preMetrics',
  NextService = 'nextService',
  NextType = 'nextType',
  NextObject = 'nextObject',
  NextMetrics = 'nextMetrics',
}

export const MetricsSource: any = {
  Service: [
    {label: 'service_resp_time', key: 0},
    {label: 'service_sla', key: 1},
    {label: 'service_cpm', key: 2},
    {label: 'service_p99', key: 3},
    {label: 'service_p95', key: 4},
    {label: 'service_p90', key: 5},
    {label: 'service_p75', key: 6},
    {label: 'service_p50', key: 7},
  ],
  ServiceEndpoint: [
    {label: 'Endpoint Avg ResponseTime', key: 'endpointResponseTime'},
    {label: 'endpoint_sla', key: 1},
    {label: 'endpoint_cpm', key: 2},
    {label: 'endpoint_p99', key: 3},
    {label: 'endpoint_p95', key: 4},
    {label: 'endpoint_p90', key: 5},
    {label: 'endpoint_p75', key: 7},
    {label: 'endpoint_p50', key: 8},
  ],
  // Instance: ['service_instance_resp_time', 'service_instan_sla', 'service_instan_cpm'],
  // Database: ['database_access_resp_time', 'database_access_sla', 'database_access_cpm',
  //  'database_access_p99', 'database_access_p95',
  //   'database_access_p90', 'database_access_p75', 'database_access_p50'],
};
