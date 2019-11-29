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

export const queryChartData = {
  service: [
    // global
    {
      o: 'Global', d: 'globalHeatmap', c: 'ChartHeatmap', t: 'Global Heatmap', w: 3, h: 250,
    }, {
      o: 'Global', d: 'globalPercent', c: 'ChartLine', t: 'Global Response Time Percentile', w: 3, h: 250,
    }, {
      o: 'Global', d: 'globalBrief', c: 'ChartBrief', t: 'Global Brief', w: 3, h: 250,
    }, {
      o: 'Global', d: 'globalThroughput', c: 'ChartTrace', t: 'Global Top Throughput', w: 3, h: 250,
    }, {
      o: 'Global', d: 'globalSlow', c: 'ChartSlow', t: 'Global Top Slow Endpoint', w: 3, h: 250,
    },
    // service
    { o: 'Service', d: 'serviceResponseTime', c: 'ChartNum', t: 'Service Avg ResponseTime', w: 3, h: 250 },
    { o: 'Service', d: 'serviceThroughput', c: 'ChartNum', t: 'Service Avg Throughput', w: 3, h: 250 },
    { o: 'Service', d: 'serviceSLA', c: 'ChartNum', t: 'Service Avg SLA', w: 3, h: 250 },
    { o: 'Service', d: 'serviceResponseTime', c: 'ChartLine', t: 'Service ResponseTime', w: 3, h: 250 },
    { o: 'Service', d: 'serviceThroughput', c: 'ChartLine', t: 'Service Throughput', w: 3, h: 250 },
    { o: 'Service', d: 'serviceSLA', c: 'ChartBar', t: 'Service SLA', w: 3, h: 250 },
    { o: 'Service', d: 'serviceInstanceThroughput', c: 'ChartTrace', t: 'Running ServiceInstance', w: 3, h: 250 },
    { o: 'Service', d: 'servicePercent', c: 'ChartLine', t: 'Service Response Time Percentile', w: 3, h: 250 },
    { o: 'Service', d: 'serviceSlowEndpoint', c: 'ChartSlow', t: 'Service Slow Endpoint', w: 3, h: 250 },
    { o: 'Service', d: 'serviceApdexScore', c: 'ChartLine', t: 'Service Apdex Score', w: 3, h: 250},
    // Endpoint
    { o: 'ServiceEndpoint', d: 'endpointResponseTime', c: 'ChartNum', t: 'Endpoint Avg ResponseTime', w: 3, h: 250 },
    { o: 'ServiceEndpoint', d: 'endpointThroughput', c: 'ChartNum', t: 'Endpoint Avg Throughput', w: 3, h: 250 },
    { o: 'ServiceEndpoint', d: 'endpointSLA', c: 'ChartNum', t: 'Endpoint Avg SLA', w: 3, h: 250 },
    { o: 'ServiceEndpoint', d: 'endpointResponseTime', c: 'ChartLine', t: 'Endpoint ResponseTime', w: 3, h: 250 },
    { o: 'ServiceEndpoint', d: 'endpointThroughput', c: 'ChartLine', t: 'Endpoint Throughput', w: 3, h: 250 },
    { o: 'ServiceEndpoint', d: 'endpointSLA', c: 'ChartBar', t: 'Endpoint SLA', w: 3, h: 250 },
    { o: 'ServiceEndpoint', d: 'endpointPercent', c: 'ChartLine',
      t: 'Endpoint Response Time Percentile', w: 3, h: 250},
    { o: 'ServiceEndpoint', d: 'endpointTraces', c: 'ChartSlow', t: 'Slow Traces', w: 3, h: 250 },
    { o: 'ServiceEndpoint', d: 'endpointTopology', c: 'ChartSankey', t: 'Dependency Map', w: 3, h: 250 },
    // instance
    { o: 'ServiceInstance', d: 'globalBrief', c: 'ChartInstance', t: 'Instance Info', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceResponseTime', c: 'ChartNum', t: 'Instance Avg ResponseTime', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceThroughput', c: 'ChartNum', t: 'Instance Avg Throughput', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceSLA', c: 'ChartNum', t: 'Instance Avg SLA', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceResponseTime', c: 'ChartLine', t: 'Instance ResponseTime', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceThroughput', c: 'ChartLine', t: 'Instance Throughput', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceSLA', c: 'ChartLine', t: 'Instance SLA', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceHeap', c: 'ChartLine', t: 'JVM Heap (MB)', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceNonheap', c: 'ChartLine', t: 'JVM Non-Heap (MB)', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceGC', c: 'ChartLine', t: 'JVM GC (ms)', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceGCCount', c: 'ChartCount', t: 'JVM GC Count', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceCPU', c: 'ChartLine', t: 'JVM CPU (%)', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceClrCPU', c: 'ChartLine', t: 'CLR CPU (%)', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceClrGC', c: 'ChartLine', t: 'CLR GC (Count)', w: 3, h: 250 },
    { o: 'ServiceInstance', d: 'instanceClrHeap', c: 'ChartLine', t: 'CLR HeapMemory (MB)', w: 3, h: 250 },
    {o: 'ServiceDependency', d: 'dependencyServerPercentile',
      c: 'ChartLine', t: 'Server Response Time Percentile', w: 3, h: 250},
    {o: 'ServiceDependency', d: 'dependencyClientPercentile',
      c: 'ChartLine', t: 'Client Response Time Percentile', w: 3, h: 250},
    {o: 'ServiceDependency', d: 'dependencyServerResponseTimeTrend',
      c: 'ChartLine', t: 'Server Response Time', w: 3, h: 250},
    {o: 'ServiceDependency', d: 'dependencyClientResponseTimeTrend',
      c: 'ChartLine', t: 'Client Response Time', w: 3, h: 250},
    {o: 'ServiceDependency', d: 'dependencyServerThroughputTrend',
      c: 'ChartLine', t: 'Server Throughput', w: 3, h: 250},
    {o: 'ServiceDependency', d: 'dependencyClientThroughputTrend',
      c: 'ChartLine', t: 'Client Throughput', w: 3, h: 250},
    {o: 'ServiceDependency', d: 'dependencyServerSLATrend', c: 'ChartLine', t: 'Server SLA', w: 3, h: 250},
    {o: 'ServiceDependency', d: 'dependencyClientSLATrend', c: 'ChartLine', t: 'Client SLA', w: 3, h: 250},
  ],
  proxy: [],
  database: [
      // global
      { o: 'Global', d: 'globalHeatmap', c: 'ChartHeatmap', t: 'Global Heatmap', w: 3, h: 250 },
      { o: 'Global', d: 'globalPercent', c: 'ChartLine', t: 'Global Response Time Percentile', w: 3, h: 250 },
      { o: 'Global', d: 'globalBrief', c: 'ChartBrief', t: 'Global Brief', w: 3, h: 250 },
      { o: 'Global', d: 'globalThroughput', c: 'ChartTrace', t: 'Global Top Throughput', w: 3, h: 250 },
      { o: 'Global', d: 'globalSlow', c: 'ChartSlow', t: 'Global Top Slow Endpoint', w: 3, h: 250 },
      // database
      { o: 'Database', d: 'databaseResponseTime', c: 'ChartNum', t: 'Database Avg ResponseTime', w: 3, h: 250 },
      { o: 'Database', d: 'databaseThroughput', c: 'ChartNum', t: 'Database Avg Throughput', w: 3, h: 250 },
      { o: 'Database', d: 'databaseSLA', c: 'ChartNum', t: 'Database Avg SLA', w: 3, h: 250 },
      { o: 'Database', d: 'databaseResponseTime', c: 'ChartLine', t: 'Database ResponseTime', w: 3, h: 250 },
      { o: 'Database', d: 'databaseThroughput', c: 'ChartLine', t: 'Database Throughput', w: 3, h: 250 },
      { o: 'Database', d: 'databaseSLA', c: 'ChartBar', t: 'Database SLA', w: 3, h: 250 },
      { o: 'Database', d: 'databasePercent', c: 'ChartLine', t: 'Database Response Time Percentile', w: 3, h: 250 },
      { o: 'Database', d: 'databaseTopNRecords', c: 'ChartSlow', t: 'Database TopN Records', w: 3, h: 250 },
  ],
};
