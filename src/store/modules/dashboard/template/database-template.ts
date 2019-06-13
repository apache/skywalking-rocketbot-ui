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
    o: 'Database',
    n: 'Database Avg Response',
    comp: 'ChartAvgResponse',
    t: 'Database Avg Response',
    type: 'databaseInfo',
    w: 3,
  },
  {
    o: 'Database',
    n: 'Database Avg Throughput',
    comp: 'ChartAvgThroughput',
    t: 'Database Avg Throughput',
    type: 'databaseInfo',
    w: 3,
  },
  {
    o: 'Database',
    n: 'Database Avg SLA',
    comp: 'ChartAvgSLA',
    t: 'Database Avg SLA',
    type: 'databaseInfo',
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
    o: 'Database',
    n: 'Database Percent Response',
    comp: 'ChartResponse',
    t: 'Database Percent Response',
    type: 'databaseInfo',
    w: 3,
  },
  {
    o: 'Database',
    n: 'Database Top Slow SQL',
    comp: 'ChartTraceDB',
    t: 'Database Top Slow SQL',
    type: 'databaseInfo.getTopNRecords',
    w: 6,
  },
];
