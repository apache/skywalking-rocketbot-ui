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
      { o: 'Global', name: 'Global Brief',
      comp: 'ChartBrief', title: 'Global Brief', type: 'global', width: 3 },
      { o: 'Global', name: 'Global Percent Response',
      comp: 'ChartResponse', title: 'Global Percent Response', type: 'global', width: 3 },
      { o: 'Global', name: 'Global Percent Response(line)',
      comp: 'ChartResponseLine', title: 'Global Percent Response', type: 'global', width: 3 },
      { o: 'Global', name: 'Global Heatmap',
      comp: 'ChartHeatmap', title: 'Global Heatmap', type: 'global', width: 3 },
      { o: 'Global', name: 'Global Heatmap(Scatter)',
      comp: 'ChartHeatmapScatter', title: 'Global Heatmap', type: 'global', width: 3 },
      { o: 'Global', name: 'Global Top Slow Endpoint',
      comp: 'ChartSlow', title: 'Global Top Slow Endpoint', type: 'global.getTopNSlowEndpoint', width: 3 },
      { o: 'Global', name: 'Global Top Throughput',
      comp: 'ChartTroughput', title: 'Global Top Throughput', type: 'global.getTopNServiceThroughput', width: 3 },
      // service
      { o: 'Service', name: 'Service Avg Response',
      comp: 'ChartAvgResponse', title: 'Service Avg Response', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Avg Throughput',
      comp: 'ChartAvgThroughput', title: 'Service Avg Throughput', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Avg SLA',
      comp: 'ChartAvgSLA', title: 'Service Avg SLA', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Percent Response',
      comp: 'ChartResponse', title: 'Service Percent Response', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Percent Response(line)',
      comp: 'ChartResponseLine', title: 'Service Percent Response', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Top Slow Endpoint',
      comp: 'ChartSlow', title: 'Service Top Slow Endpoint', type: 'serviceInfo.getSlowEndpoint', width: 3 },
      { o: 'Service', name: 'Running ServiceInstance',
      comp: 'ChartTroughput', title: 'Running ServiceInstance', type: 'serviceInfo.getInstanceThroughput', width: 3 },
      // Endpoint
      { o: 'ServiceEndpoint', name: 'Endpoint Avg Response',
      comp: 'ChartAvgResponse', title: 'Endpoint Avg Response', type: 'endpointInfo', width: 3 },
      { o: 'ServiceEndpoint', name: 'Endpoint Avg Throughput',
      comp: 'ChartAvgThroughput', title: 'Endpoint Avg Throughput', type: 'endpointInfo', width: 3 },
      { o: 'ServiceEndpoint', name: 'Endpoint Avg SLA',
      comp: 'ChartAvgSLA', title: 'Endpoint Avg SLA', type: 'endpointInfo', width: 3 },
      { o: 'ServiceEndpoint', name: 'Endpoint Percent Response',
      comp: 'ChartResponse', title: 'Endpoint Percent Response', type: 'endpointInfo', width: 3 },
      { o: 'ServiceEndpoint', name: 'Endpoint Percent Response(line)',
      comp: 'ChartResponseLine', title: 'Endpoint Percent Response', type: 'endpointInfo', width: 3 },
      { o: 'ServiceEndpoint', name: 'Dependency Map',
      comp: 'ChartDependency', title: 'Dependency Map', type: 'endpointInfo', width: 6 },
      { o: 'ServiceEndpoint', name: 'Endpoint Top Slow Traces',
      comp: 'ChartTrace', title: 'Endpoint Top Slow Traces', type: 'endpointInfo.queryBasicTraces', width: 6 },
      // instance
      { o: 'ServiceInstance', name: 'Instance Avg Response',
      comp: 'ChartAvgResponse', title: 'Instance Avg Response', type: 'instanceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'Instance Avg Throughput',
      comp: 'ChartAvgThroughput', title: 'Instance Avg Throughput', type: 'instanceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'Instance Avg SLA',
      comp: 'ChartAvgSLA', title: 'Instance Avg SLA', type: 'instanceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'Instance Info',
      comp: 'ChartInstance', title: 'Instance Info', type: 'global', width: 3 },
      { o: 'ServiceInstance', name: 'Instance JVM CPU',
      comp: 'ChartCpu', title: 'Instance CPU %' , width: 3 },
      { o: 'ServiceInstance', name: 'Instance JVM GC',
      comp: 'ChartGC', title: 'Instance GC (ms)' , width: 3 },
      { o: 'ServiceInstance', name: 'Instance JVM Heap',
      comp: 'ChartHeap', title: 'Instance Heap (MB)' , width: 3 },
      { o: 'ServiceInstance', name: 'Instance JVM NonHeap',
      comp: 'ChartNonHeap', title: 'Instance Non-Heap MB' , width: 3 },
      { o: 'ServiceInstance', name: 'Envoy Memory',
      comp: 'ChartEnvoyMemory', title: 'Envoy Memory', type: 'instanceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'Envoy Connections',
      comp: 'ChartEnvoyCollections', title: 'Envoy Connection(s)', type: 'instanceInfo', width: 3 },
    ],
    proxy: [],
    database: [
        // global
        { o: 'Global', name: 'Global Brief',
        comp: 'ChartBrief', title: 'Global Brief', type: 'global', width: 3 },
        { o: 'Global', name: 'Global Percent Response',
        comp: 'ChartResponse', title: 'Global Percent Response', type: 'global', width: 3 },
        { o: 'Global', name: 'Global Percent Response(line)',
        comp: 'ChartResponseLine', title: 'Global Percent Response', type: 'global', width: 3 },
        { o: 'Global', name: 'Global Heatmap',
        comp: 'ChartHeatmap', title: 'Global Heatmap', type: 'global', width: 3 },
        { o: 'Global', name: 'Global Top Slow Endpoint',
        comp: 'ChartTroughput', title: 'Global Top Slow Endpoint', type: 'global.getTopNSlowEndpoint', width: 3 },
        { o: 'Global', name: 'Global Top Throughput',
        comp: 'ChartSlow', title: 'Global Top Throughput', type: 'global.getTopNServiceThroughput', width: 3 },
        // database
        { o: 'Database', name: 'Database Avg Response',
        comp: 'ChartAvgResponse', title: 'Database Avg Response', type: 'databaseInfo', width: 3 },
        { o: 'Database', name: 'Database Avg Throughput',
        comp: 'ChartAvgThroughput', title: 'Database Avg Throughput', type: 'databaseInfo', width: 3 },
        { o: 'Database', name: 'Database Avg SLA',
        comp: 'ChartAvgSLA', title: 'Database Avg SLA', type: 'databaseInfo', width: 3 },
        { o: 'Database', name: 'Database Percent Response',
        comp: 'ChartResponse', title: 'Database Percent Response', type: 'databaseInfo', width: 3 },
        { o: 'Database', name: 'Database Top Slow SQL',
        comp: 'ChartTraceDB', title: 'Database Top Slow SQL', type: 'databaseInfo.getTopNRecords', width: 6 },

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
