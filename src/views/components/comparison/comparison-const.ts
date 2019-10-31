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
import { IType, ICurrentOptions, DataSourceType } from './comparison-metrics';

export const ComparisonType: IType[] = [
  {key: 0, label: 'Service'},
  {key: 1, label: 'Instance'},
  {key: 2, label: 'Endpoint'},
];

export const ComparisonOption: ICurrentOptions = {
  preService: {key: 0, label: ''},
  preType: {key: 0, label: 'Endpoint'},
  preObject: {key: 0, label: '/projectB/{name}'},
  preMetrics: {key: 0, label: 'avg'},
  nextService: {key: 0, label: ''},
  nextType: {key: 0, label: 'Endpoint'},
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
