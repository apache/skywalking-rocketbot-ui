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

export default [{
  o: 'Global',
  n: 'Global Heatmap',
  comp: 'ChartHeatmap',
  t: 'Global Heatmap',
  type: 'global',
  w: 6,
}, {
  o: 'Global',
  n: 'Global Percent Response(line)',
  comp: 'ChartResponseLine',
  t: 'Global Percent Response',
  type: 'global',
  w: 6,
}, {
  o: 'Global',
  n: 'Global Brief',
  comp: 'ChartBrief',
  t: 'Global Brief',
  type: 'global',
  w: 3,
}, {
  o: 'Global',
  n: 'Global Top Throughput',
  comp: 'ChartTroughput',
  t: 'Global Top Throughput',
  type: 'global.getTopNServiceThroughput',
  w: 3,
}, {
  o: 'Global',
  n: 'Global Top Slow Endpoint',
  comp: 'ChartSlow',
  t: 'Global Top Slow Endpoint',
  type: 'global.getTopNSlowEndpoint',
  w: 6,
}];
