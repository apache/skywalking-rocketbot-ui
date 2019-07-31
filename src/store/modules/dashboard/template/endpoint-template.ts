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
    d: 'globalBrief',
    c: 'ChartBrief',
    t: 'Global Brief',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointResponseTime',
    c: 'ChartNum',
    t: 'Endpoint Avg ResponseTime',
    w: 3,
    h: 80,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointThroughput',
    c: 'ChartNum',
    t: 'Endpoint Avg Throughput',
    w: 3,
    h: 80,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointSLA',
    c: 'ChartNum',
    t: 'Endpoint Avg SLA',
    w: 3,
    h: 80,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointResponseTime',
    c: 'ChartLine',
    t: 'Endpoint ResponseTime',
    w: 3,
    h: 170,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointThroughput',
    c: 'ChartLine',
    t: 'Endpoint Throughput',
    w: 3,
    h: 170,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointSLA',
    c: 'ChartBar',
    t: 'Endpoint SLA',
    w: 3,
    h: 170,
  },
  {
    o: 'Global',
    d: 'globalPercent',
    c: 'ChartLine',
    t: 'Global Percent Response',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointPercent',
    c: 'ChartLine',
    t: 'Endpoint Percent Response',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointTopology',
    c: 'ChartSankey',
    t: 'Dependency Map',
    w: 6,
    h: 250,
  },
  {
    o: 'Global',
    d: 'globalSlow',
    c: 'ChartSlow',
    t: 'Global Top Slow Endpoint',
    w: 6,
    h: 250,
  },
  {
    o: 'ServiceEndpoint',
    d: 'endpointTraces',
    c: 'ChartTrace',
    t: 'Endpoint Slow',
    w: 6,
    h: 250,
  },
];
