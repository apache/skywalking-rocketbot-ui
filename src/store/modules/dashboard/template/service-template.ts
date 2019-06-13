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
    n: 'Global Brief',
    comp: 'ChartBrief',
    t: 'Global Brief',
    type: 'global',
    w: 3,
  },
  {
    o: 'Service',
    n: 'Service Avg Response',
    comp: 'ChartAvgResponse',
    t: 'Service Avg Response',
    type: 'serviceInfo',
    w: 3,
  },
  {
    o: 'Service',
    n: 'Service Avg Throughput',
    comp: 'ChartAvgThroughput',
    t: 'Service Avg Throughput',
    type: 'serviceInfo',
    w: 3,
  },
  {
    o: 'Service',
    n: 'Service Avg SLA',
    comp: 'ChartAvgSLA',
    t: 'Service Avg SLA',
    type: 'serviceInfo',
    w: 3,
  },
  {
    o: 'Global',
    n: 'Global Percent Response(line)',
    comp: 'ChartResponseLine',
    t: 'Global Percent Response',
    type: 'global',
    w: 3,
  },
  {
    o: 'Service',
    n: 'Service Percent Response(line)',
    comp: 'ChartResponseLine',
    t: 'Service Percent Response',
    type: 'serviceInfo',
    w: 3,
  },
  {
    o: 'Service',
    n: 'Service Top Slow Endpoint',
    comp: 'ChartSlow',
    t: 'Service Top Slow Endpoint',
    type: 'serviceInfo.getSlowEndpoint',
    w: 3,
  },
  {
    o: 'Service',
    n: 'Running ServiceInstance',
    comp: 'ChartTroughput',
    t: 'Running ServiceInstance',
    type: 'serviceInfo.getInstanceThroughput',
    w: 3,
  },
];
