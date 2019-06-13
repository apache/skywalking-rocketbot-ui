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
    o: 'ServiceInstance',
    n: 'Instance Info',
    comp: 'ChartInstance',
    t: 'Instance Info',
    type: 'global',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance Avg Throughput',
    comp: 'ChartAvgThroughput',
    t: 'Instance Avg Throughput',
    type: 'instanceInfo',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance Avg Response',
    comp: 'ChartAvgResponse',
    t: 'Instance Avg Response',
    type: 'instanceInfo',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance Avg SLA',
    comp: 'ChartAvgSLA',
    t: 'Instance Avg SLA',
    type: 'instanceInfo',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance JVM GC',
    comp: 'ChartGC',
    t: 'JVM GC (ms)',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance JVM Heap',
    comp: 'ChartHeap',
    t: 'JVM Heap (MB)',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance JVM NonHeap',
    comp: 'ChartNonHeap',
    t: 'JVM Non-Heap MB',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance JVM CPU',
    comp: 'ChartCpu',
    t: 'JVM CPU %',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance CLR CPU',
    comp: 'ChartClrCPU',
    t: 'CLR CPU %',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance CLR Heap',
    comp: 'ChartClrHeap',
    t: 'CLR HeapMemory (MB)',
    w: 3,
  },
  {
    o: 'ServiceInstance',
    n: 'Instance CLR GC',
    comp: 'ChartClrGC',
    t: 'CLR GC (Count)',
    w: 3,
  },
];
