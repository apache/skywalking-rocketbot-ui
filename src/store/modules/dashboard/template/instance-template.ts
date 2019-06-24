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
    d: 'instanceResponseTime',
    c: 'ChartInstance',
    t: 'Instance Info',
    w: 3,
    h: '250',
  },
  {
    o: 'ServiceInstance',
    d: 'instanceResponseTime',
    c: 'ChartNum',
    t: 'Instance Avg ResponseTime',
    w: 3,
    h: '80',
  },
  {
    o: 'ServiceInstance',
    d: 'instanceThroughput',
    c: 'ChartNum',
    t: 'Instance Avg Throughput',
    w: 3,
    h: '80',
  },
  {
    o: 'ServiceInstance',
    d: 'instanceSLA',
    c: 'ChartNum',
    t: 'Instance Avg SLA',
    w: 3,
    h: '80',
  },
  {
    o: 'ServiceInstance',
    d: 'instanceResponseTime',
    c: 'ChartLine',
    t: 'Instance ResponseTime',
    w: 3,
    h: '170',
  },
  {
    o: 'ServiceInstance',
    d: 'instanceThroughput',
    c: 'ChartLine',
    t: 'Instance Throughput',
    w: 3,
    h: '170',
  },
  {
    o: 'ServiceInstance',
    d: 'instanceSLA',
    c: 'ChartLine',
    t: 'Instance SLA',
    w: 3,
    h: '170',
  },
  {
    o: 'ServiceInstance',
    d: 'instanceHeap',
    c: 'ChartLine',
    t: 'JVM Heap (MB)',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceInstance',
    d: 'instanceNonheap',
    c: 'ChartLine',
    t: 'JVM Non-Heap (MB)',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceInstance',
    d: 'instanceGC',
    c: 'ChartLine',
    t: 'JVM GC (ms)',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceInstance',
    d: 'instanceCPU',
    c: 'ChartLine',
    t: 'JVM CPU (%)',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceInstance',
    d: 'instanceClrCPU',
    c: 'ChartLine',
    t: 'CLR CPU (%)',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceInstance',
    d: 'instanceClrGC',
    c: 'ChartLine',
    t: 'CLR GC (Count)',
    w: 3,
    h: 250,
  },
  {
    o: 'ServiceInstance',
    d: 'instanceClrHeap',
    c: 'ChartLine',
    t: 'CLR HeapMemory (MB)',
    w: 3,
    h: 250,
  },
];
