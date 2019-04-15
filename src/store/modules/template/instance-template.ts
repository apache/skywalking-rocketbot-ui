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
    name: 'Instance Info',
    comp: 'ChartInstance',
    title: 'Instance Info',
    type: 'global',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance Avg Throughput',
    comp: 'ChartAvgThroughput',
    title: 'Instance Avg Throughput',
    type: 'instanceInfo',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance Avg Response',
    comp: 'ChartAvgResponse',
    title: 'Instance Avg Response',
    type: 'instanceInfo',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance Avg SLA',
    comp: 'ChartAvgSLA',
    title: 'Instance Avg SLA',
    type: 'instanceInfo',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance JVM GC',
    comp: 'ChartGC',
    title: 'JVM GC (ms)',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance JVM Heap',
    comp: 'ChartHeap',
    title: 'JVM Heap (MB)',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance JVM NonHeap',
    comp: 'ChartNonHeap',
    title: 'JVM Non-Heap MB',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance JVM CPU',
    comp: 'ChartCpu',
    title: 'JVM CPU %',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance CLR CPU',
    comp: 'ChartClrCPU',
    title: 'CLR CPU %',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance CLR Heap',
    comp: 'ChartClrHeap',
    title: 'CLR HeapMemory (MB)',
    width: 3,
  },
  {
    o: 'ServiceInstance',
    name: 'Instance CLR GC',
    comp: 'ChartClrGC',
    title: 'CLR GC (Count)',
    width: 3,
  },
];
