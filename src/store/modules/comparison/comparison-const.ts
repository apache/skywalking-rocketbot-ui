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
  {key: 'Database', label: 'Database'},
];

export enum ObjectType {
  Service = 'Service',
  ServiceInstance = 'ServiceInstance',
  ServiceEndpoint = 'ServiceEndpoint',
  Database = 'Database',
}

export enum ServiceType {
  PREVIOUS = 'PREVIOUS',
  NEXT = 'NEXT',
  INIT = 'INIT',
}

export const ComparisonOption: ICurrentOptions = {
  preService: {key: 0, label: ''},
  preType: {key: 'ServiceEndpoint', label: 'Service Endpoint'},
  preObject: {key: 0, label: '/projectB/{name}'},
  preMetrics: {key: 0, label: ''},
  nextService: {key: 0, label: ''},
  nextType: {key: 'ServiceEndpoint', label: 'Service Endpoint'},
  nextObject: {key: 0, label: '/projectA/{name}'},
  nextMetrics: {key: 0, label: ''},
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

export const MetricsSource: any = {
  Service: [
    {label: 'Service Response Time', key: 'serviceResponseTime'},
    {label: 'Service SLA', key: 'serviceSLA'},
    {label: 'service_cpm', key: 2},
    {label: 'service_p99', key: 3},
    {label: 'service_p95', key: 4},
    {label: 'service_p90', key: 5},
    {label: 'service_p75', key: 6},
    {label: 'service_p50', key: 7},
  ],
  ServiceEndpoint: [
    {label: 'Endpoint Avg ResponseTime', key: 'endpointResponseTime'},
    {label: 'Endpoint SLA', key: 'endpointSLA'},
    {label: 'endpoint_cpm', key: 2},
    {label: 'endpoint_p99', key: 3},
    {label: 'endpoint_p95', key: 4},
    {label: 'endpoint_p90', key: 5},
    {label: 'endpoint_p75', key: 7},
    {label: 'endpoint_p50', key: 8},
  ],
  ServiceInstance: [
    {label: 'Instance ResponseTime', key: 'instanceResponseTime'},
    {label: 'Instance SLA', key: 'instanceSLA'},
    {label: 'service_instan_cpm', key: 2},
  ],
  Database: [
    {label: 'Database ResponseTime', key: 'databaseResponseTime'},
    {label: 'Database Throughput', key: 'databaseThroughput'},
    {label: 'database_access_sla', key: 'database_access_sla'},
    {label: 'database_access_cpm', key: 'database_access_cpm'},
    {label: 'database_access_p99', key: 'database_access_p99'},
    {label: 'database_access_p95', key: 'database_access_p95'},
    {label: 'database_access_p90', key: 'database_access_p90'},
    {label: 'database_access_p75', key: 'database_access_p75'},
    {label: 'database_access_p50', key: 'database_access_p50'},
  ],
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

export enum StatusType {
  Init = 'init',
  Pre = 'pre',
  Next = 'next',
}
