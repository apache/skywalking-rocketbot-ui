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
    o: 'Service',
    d: 'serviceApdexScore',
    c: 'ChartNum',
    t: 'Service Avg ApdexScore',
    w: 3,
    h: 80,
  },
  {
    o: 'Service',
    d: 'serviceResponseTime',
    c: 'ChartNum',
    t: 'Service Avg ResponseTime',
    w: 3,
    h: 80,
  },
  {
    o: 'Service',
    d: 'serviceThroughput',
    c: 'ChartNum',
    t: 'Service Avg Throughput',
    w: 3,
    h: 80,
  },
  {
    o: 'Service',
    d: 'serviceSLA',
    c: 'ChartNum',
    t: 'Service Avg SLA',
    w: 3,
    h: 80,
  },
  {
    o: 'Service',
    d: 'serviceApdexScore',
    c: 'ChartLine',
    t: 'Service ApdexScore',
    w: 3,
    h: 170,
  },
  {
    o: 'Service',
    d: 'serviceResponseTime',
    c: 'ChartLine',
    t: 'Service ResponseTime',
    w: 3,
    h: 170,
  },
  {
    o: 'Service',
    d: 'serviceThroughput',
    c: 'ChartLine',
    t: 'Service Throughput',
    w: 3,
    h: 170,
  },
  {
    o: 'Service',
    d: 'serviceSLA',
    c: 'ChartBar',
    t: 'Service SLA',
    w: 3,
    h: 170,
  },
  {
    o: 'Global',
    d: 'globalPercent',
    c: 'ChartLine',
    t: 'Global Response Time Percentile',
    w: 3,
    h: 250,
  },
  {
    o: 'Service',
    d: 'servicePercent',
    c: 'ChartLine',
    t: 'Service Response Time Percentile',
    w: 3,
    h: 250,
  },
  {
    o: 'Service',
    d: 'serviceSlowEndpoint',
    c: 'ChartSlow',
    t: 'Service Slow Endpoint',
    w: 3,
    h: 250,
  },
  {
    o: 'Service',
    d: 'serviceInstanceThroughput',
    c: 'ChartTrace',
    t: 'Running ServiceInstance',
    w: 3,
    h: 250,
  },
];
