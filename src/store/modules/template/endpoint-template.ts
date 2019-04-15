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

export default [
  {
    o: 'Global',
    name: 'Global Brief',
    comp: 'ChartBrief',
    title: 'Global Brief',
    type: 'global',
    width: 3,
  },
  {
    o: 'ServiceEndpoint',
    name: 'Endpoint Avg Response',
    comp: 'ChartAvgResponse',
    title: 'Endpoint Avg Response',
    type: 'endpointInfo',
    width: 3,
  },
  {
    o: 'ServiceEndpoint',
    name: 'Endpoint Avg Throughput',
    comp: 'ChartAvgThroughput',
    title: 'Endpoint Avg Throughput',
    type: 'endpointInfo',
    width: 3,
  },
  {
    o: 'ServiceEndpoint',
    name: 'Endpoint Avg SLA',
    comp: 'ChartAvgSLA',
    title: 'Endpoint Avg SLA',
    type: 'endpointInfo',
    width: 3,
  },
  {
    o: 'Global',
    name: 'Global Percent Response(line)',
    comp: 'ChartResponseLine',
    title: 'Global Percent Response',
    type: 'global',
    width: 3,
  },
  {
    o: 'ServiceEndpoint',
    name: 'Endpoint Percent Response(line)',
    comp: 'ChartResponseLine',
    title: 'Endpoint Percent Response',
    type: 'endpointInfo',
    width: 3,
  },
  {
    o: 'ServiceEndpoint',
    name: 'Dependency Map',
    comp: 'ChartDependency',
    title: 'Dependency Map',
    type: 'endpointInfo',
    width: 6,
  },
  {
    o: 'ServiceEndpoint',
    name: 'Endpoint Top Slow Traces',
    comp: 'ChartTrace',
    title: 'Endpoint Top Slow Traces',
    type: 'endpointInfo.queryBasicTraces',
    width: 6,
  },
  {
    o: 'Global',
    name: 'Global Top Slow Endpoint',
    comp: 'ChartSlow',
    title: 'Global Top Slow Endpoint',
    type: 'global.getTopNSlowEndpoint',
    width: 6,
  },
];
