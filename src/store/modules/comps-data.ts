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

import { ActionTree, MutationTree } from 'vuex';
import { CompsContainer } from '../interfaces';

export interface State {
  data: CompsContainer;
}

const initState: State = {
  data: {
    service: [
      // global
      { o: 'Global', n: 'Global Brief',
      comp: 'ChartBrief', t: 'Global Brief', type: 'global', w: 3 },
      { o: 'Global', n: 'Global Percent Response',
      comp: 'ChartResponse', t: 'Global Percent Response', type: 'global', w: 3 },
      { o: 'Global', n: 'Global Percent Response(line)',
      comp: 'ChartResponseLine', t: 'Global Percent Response', type: 'global', w: 3 },
      { o: 'Global', n: 'Global Heatmap',
      comp: 'ChartHeatmap', t: 'Global Heatmap', type: 'global', w: 3 },
      { o: 'Global', n: 'Global Heatmap(Scatter)',
      comp: 'ChartHeatmapScatter', t: 'Global Heatmap', type: 'global', w: 3 },
      { o: 'Global', n: 'Global Top Slow Endpoint',
      comp: 'ChartSlow', t: 'Global Top Slow Endpoint', type: 'global.getTopNSlowEndpoint', w: 3 },
      { o: 'Global', n: 'Global Top Throughput',
      comp: 'ChartTroughput', t: 'Global Top Throughput', type: 'global.getTopNServiceThroughput', w: 3 },
      // service
      { o: 'Service', n: 'Service Avg Response',
      comp: 'ChartAvgResponse', t: 'Service Avg Response', type: 'serviceInfo', w: 3 },
      { o: 'Service', n: 'Service Avg Throughput',
      comp: 'ChartAvgThroughput', t: 'Service Avg Throughput', type: 'serviceInfo', w: 3 },
      { o: 'Service', n: 'Service Avg SLA',
      comp: 'ChartAvgSLA', t: 'Service Avg SLA', type: 'serviceInfo', w: 3 },
      { o: 'Service', n: 'Service Percent Response',
      comp: 'ChartResponse', t: 'Service Percent Response', type: 'serviceInfo', w: 3 },
      { o: 'Service', n: 'Service Percent Response(line)',
      comp: 'ChartResponseLine', t: 'Service Percent Response', type: 'serviceInfo', w: 3 },
      { o: 'Service', n: 'Service Top Slow Endpoint',
      comp: 'ChartSlow', t: 'Service Top Slow Endpoint', type: 'serviceInfo.getSlowEndpoint', w: 3 },
      { o: 'Service', n: 'Running ServiceInstance',
      comp: 'ChartTroughput', t: 'Running ServiceInstance', type: 'serviceInfo.getInstanceThroughput', w: 3 },
      // Endpoint
      { o: 'ServiceEndpoint', n: 'Endpoint Avg Response',
      comp: 'ChartAvgResponse', t: 'Endpoint Avg Response', type: 'endpointInfo', w: 3 },
      { o: 'ServiceEndpoint', n: 'Endpoint Avg Throughput',
      comp: 'ChartAvgThroughput', t: 'Endpoint Avg Throughput', type: 'endpointInfo', w: 3 },
      { o: 'ServiceEndpoint', n: 'Endpoint Avg SLA',
      comp: 'ChartAvgSLA', t: 'Endpoint Avg SLA', type: 'endpointInfo', w: 3 },
      { o: 'ServiceEndpoint', n: 'Endpoint Percent Response',
      comp: 'ChartResponse', t: 'Endpoint Percent Response', type: 'endpointInfo', w: 3 },
      { o: 'ServiceEndpoint', n: 'Endpoint Percent Response(line)',
      comp: 'ChartResponseLine', t: 'Endpoint Percent Response', type: 'endpointInfo', w: 3 },
      { o: 'ServiceEndpoint', n: 'Dependency Map',
      comp: 'ChartDependency', t: 'Dependency Map', type: 'endpointInfo', w: 6 },
      { o: 'ServiceEndpoint', n: 'Endpoint Top Slow Traces',
      comp: 'ChartTrace', t: 'Endpoint Top Slow Traces', type: 'endpointInfo.queryBasicTraces', w: 6 },
      // instance
      { o: 'ServiceInstance', n: 'Instance Avg Response',
      comp: 'ChartAvgResponse', t: 'Instance Avg Response', type: 'instanceInfo', w: 3 },
      { o: 'ServiceInstance', n: 'Instance Avg Throughput',
      comp: 'ChartAvgThroughput', t: 'Instance Avg Throughput', type: 'instanceInfo', w: 3 },
      { o: 'ServiceInstance', n: 'Instance Avg SLA',
      comp: 'ChartAvgSLA', t: 'Instance Avg SLA', type: 'instanceInfo', w: 3 },
      { o: 'ServiceInstance', n: 'Instance Info',
      comp: 'ChartInstance', t: 'Instance Info', type: 'global', w: 3 },
      { o: 'ServiceInstance', n: 'Instance JVM CPU',
      comp: 'ChartCpu', t: 'JVM CPU %' , w: 3 },
      { o: 'ServiceInstance', n: 'Instance JVM GC',
      comp: 'ChartGC', t: 'JVM GC (ms)' , w: 3 },
      { o: 'ServiceInstance', n: 'Instance JVM Heap',
      comp: 'ChartHeap', t: 'JVM Heap (MB)' , w: 3 },
      { o: 'ServiceInstance', n: 'Instance JVM NonHeap',
      comp: 'ChartNonHeap', t: 'JVM Non-Heap MB' , w: 3 },
      { o: 'ServiceInstance', n: 'Instance CLR CPU',
      comp: 'ChartClrCPU', t: 'CLR CPU %' , w: 3 },
      { o: 'ServiceInstance', n: 'Instance CLR Heap',
      comp: 'ChartClrHeap', t: 'CLR HeapMemory (MB)' , w: 3 },
      { o: 'ServiceInstance', n: 'Instance CLR GC',
      comp: 'ChartClrGC', t: 'CLR GC (Count)' , w: 3 },
      { o: 'ServiceInstance', n: 'Envoy Memory',
      comp: 'ChartEnvoyMemory', t: 'Envoy Memory', type: 'instanceInfo', w: 3 },
      { o: 'ServiceInstance', n: 'Envoy Connections',
      comp: 'ChartEnvoyCollections', t: 'Envoy Connection(s)', type: 'instanceInfo', w: 3 },
    ],
    proxy: [],
    database: [
        // global
        { o: 'Global', n: 'Global Brief',
        comp: 'ChartBrief', t: 'Global Brief', type: 'global', w: 3 },
        { o: 'Global', n: 'Global Percent Response',
        comp: 'ChartResponse', t: 'Global Percent Response', type: 'global', w: 3 },
        { o: 'Global', n: 'Global Percent Response(line)',
        comp: 'ChartResponseLine', t: 'Global Percent Response', type: 'global', w: 3 },
        { o: 'Global', n: 'Global Heatmap',
        comp: 'ChartHeatmap', t: 'Global Heatmap', type: 'global', w: 3 },
        { o: 'Global', n: 'Global Top Slow Endpoint',
        comp: 'ChartTroughput', t: 'Global Top Slow Endpoint', type: 'global.getTopNSlowEndpoint', w: 3 },
        { o: 'Global', n: 'Global Top Throughput',
        comp: 'ChartSlow', t: 'Global Top Throughput', type: 'global.getTopNServiceThroughput', w: 3 },
        // database
        { o: 'Database', n: 'Database Avg Response',
        comp: 'ChartAvgResponse', t: 'Database Avg Response', type: 'databaseInfo', w: 3 },
        { o: 'Database', n: 'Database Avg Throughput',
        comp: 'ChartAvgThroughput', t: 'Database Avg Throughput', type: 'databaseInfo', w: 3 },
        { o: 'Database', n: 'Database Avg SLA',
        comp: 'ChartAvgSLA', t: 'Database Avg SLA', type: 'databaseInfo', w: 3 },
        { o: 'Database', n: 'Database Percent Response',
        comp: 'ChartResponse', t: 'Database Percent Response', type: 'databaseInfo', w: 3 },
        { o: 'Database', n: 'Database Top Slow SQL',
        comp: 'ChartTraceDB', t: 'Database Top Slow SQL', type: 'databaseInfo.getTopNRecords', w: 6 },

    ],
  },
};

// mutations
const mutations: MutationTree<State> = {
};

// actions
const actions: ActionTree<State, any> = {} ;

// getters
const getters = {
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
