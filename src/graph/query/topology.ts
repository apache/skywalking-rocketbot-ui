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

import {
  Topo,
  ServiceTopo,
  ServicesTopo,
  TopoMetric,
  TopoInstanceDependency,
  TopoInstanceClientInfo,
  TopoInstanceServerInfo,
  TopoServiceMetric,
  TopoClientMetric,
  TopoServiceInfo,
  TopoClientInfo,
  DependencyInstanceServerMetric,
  DependencyInstanceClientMetric,
  TopoServiceDetail,
  endpointTopology,
  TopoEndpointDependencyMetrics,
} from '../fragments/topology';

export const queryTopo = `query queryTopo(${Topo.variable}) {${Topo.query}}`;

export const queryServiceTopo = `query queryServiceTopo(${ServiceTopo.variable}) {${ServiceTopo.query}}`;

export const queryServicesTopo = `query queryServiceTopo(${ServicesTopo.variable}) {${ServicesTopo.query}}`;

export const queryTopoInfo = `query queryTopoInfo(
    ${Topo.variable},
    ${TopoMetric.variable},
    ${TopoServiceMetric.variable},
    ${TopoClientMetric.variable})
      {
        ${TopoMetric.query},
        ${TopoServiceMetric.query},
        ${TopoClientMetric.query}
      }`;

export const queryTopoServiceInfo = `query queryTopoServiceInfo(
  ${TopoServiceInfo.variable}) {${TopoServiceInfo.query}}`;

export const queryTopoClientInfo = `query queryTopoClientInfo(
  ${TopoClientInfo.variable}) {${TopoClientInfo.query}}`;

export const queryTopoInstanceDependency = `query queryTopoInstanceDependency(
  ${TopoInstanceDependency.variable}) {${TopoInstanceDependency.query}}`;

export const queryTopoInstanceServerInfo = `query queryTopoInstanceServerInfo(
  ${TopoInstanceServerInfo.variable}) {${TopoInstanceServerInfo.query}}`;

export const queryTopoInstanceClientInfo = `query queryTopoInstanceClientInfo(
  ${TopoInstanceClientInfo.variable}) {${TopoInstanceClientInfo.query}}`;

export const queryDependencyInstanceServerMetric = `query queryDependencyInstanceServerMetric(
  ${DependencyInstanceServerMetric.variable}) {${DependencyInstanceServerMetric.query}}`;

export const queryDependencyInstanceClientMetric = `query queryDependencyInstanceClientMetric(
  ${DependencyInstanceClientMetric.variable}) {${DependencyInstanceClientMetric.query}}`;

export const queryTopoServiceDetail = `query queryTopoServiceDetail(
  ${TopoServiceDetail.variable}) {${TopoServiceDetail.query}}`;

export const queryEndpointTopology = `query queryEndpointTopology(${endpointTopology.variable}) {
  ${endpointTopology.query}}`;

export const queryTopoEndpointDependencyMetrics = `query queryTopoEndpointDependencyMetrics(
  ${TopoEndpointDependencyMetrics.variable}) {${TopoEndpointDependencyMetrics.query}}`;
