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
  {key: 'ServiceDependency', label: 'Service Dependency'},
];

export enum ObjectType {
  Service = 'Service',
  ServiceInstance = 'ServiceInstance',
  ServiceEndpoint = 'ServiceEndpoint',
  Database = 'Database',
  ServiceDependency = 'ServiceDependency',
}

export enum ServiceType {
  PREVIOUS = 'PREVIOUS',
  NEXT = 'NEXT',
}

export const ComparisonOption: ICurrentOptions = {
  preService: {key: 0, label: ''},
  preType: {key: 'ServiceEndpoint', label: 'Service Endpoint'},
  preObject: {key: 0, label: ''},
  preMetrics: [{key: 0, label: ''}],
  nextService: {key: 0, label: ''},
  nextType: {key: 'ServiceEndpoint', label: 'Service Endpoint'},
  nextObject: {key: 0, label: ''},
  nextMetrics: [{key: 0, label: ''}],
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

export enum StatusType {
  Init = 'init',
  Pre = 'pre',
  Next = 'next',
}

export const LinearType = ['ChartBar', 'ChartLine'];
