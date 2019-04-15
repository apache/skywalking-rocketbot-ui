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
    o: 'Service',
    name: 'Service Avg Response',
    comp: 'ChartAvgResponse',
    title: 'Service Avg Response',
    type: 'serviceInfo',
    width: 3,
  },
  {
    o: 'Service',
    name: 'Service Avg Throughput',
    comp: 'ChartAvgThroughput',
    title: 'Service Avg Throughput',
    type: 'serviceInfo',
    width: 3,
  },
  {
    o: 'Service',
    name: 'Service Avg SLA',
    comp: 'ChartAvgSLA',
    title: 'Service Avg SLA',
    type: 'serviceInfo',
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
    o: 'Service',
    name: 'Service Percent Response(line)',
    comp: 'ChartResponseLine',
    title: 'Service Percent Response',
    type: 'serviceInfo',
    width: 3,
  },
  {
    o: 'Service',
    name: 'Service Top Slow Endpoint',
    comp: 'ChartSlow',
    title: 'Service Top Slow Endpoint',
    type: 'serviceInfo.getSlowEndpoint',
    width: 3,
  },
  {
    o: 'Service',
    name: 'Running ServiceInstance',
    comp: 'ChartTroughput',
    title: 'Running ServiceInstance',
    type: 'serviceInfo.getInstanceThroughput',
    width: 3,
  },
];
