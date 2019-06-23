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

import { ActionTree, MutationTree, Commit, Dispatch } from 'vuex';
import { CompsTree } from '@/types/dashboard';
import dashboardLayout from './dashboard-data-layout';
import dashboardQuery from './dashboard-data-query';

export interface State {
  current: number;
  group: number;
  tree: CompsTree[];
  data: any;
}

const initState: State = {
  ...dashboardLayout.state,
  data: {
    service: [
      // global
      {
        o: 'Global', d: 'globalHeatmap', c: 'ChartHeatmap', t: 'Global Heatmap', w: 3, h: 200,
      }, {
        o: 'Global', d: 'globalPercent', c: 'ChartLine', t: 'Global Percent Response', w: 3, h: 200,
      }, {
        o: 'Global', d: 'globalBrief', c: 'ChartBrief', t: 'Global Brief', w: 3, h: 200,
      }, {
        o: 'Global', d: 'globalThroughput', c: 'ChartTrace', t: 'Global Top Throughput', w: 3, h: 200,
      }, {
        o: 'Global', d: 'globalSlow', c: 'ChartSlow', t: 'Global Top Slow Endpoint', w: 3, h: 200,
      },
      // service
      { o: 'Service', d: 'serviceInstanceThroughput', c: 'ChartTrace', t: 'Service Instance Throughput', w: 3, h: 200 },
      { o: 'Service', d: 'servicePercent', c: 'ChartLine', t: 'Service Percent', w: 3, h: 200 },
      { o: 'Service', d: 'serviceResponseTime', c: 'ChartLine', t: 'Service ResponseTime', w: 3, h: 200 },
      { o: 'Service', d: 'serviceSLA', c: 'ChartBar', t: 'Service SLA', w: 3, h: 200 },
      { o: 'Service', d: 'serviceSlowEndpoint', c: 'ChartSlow', t: 'Service Slow Endpoint', w: 3, h: 200 },
      { o: 'Service', d: 'serviceThroughput', c: 'ChartLine', t: 'Global Throughput', w: 3, h: 200 },
      // Endpoint
      { o: 'ServiceEndpoint', d: 'endpointPercent', c: 'ChartLine', t: 'Global Percent', w: 3, h: 200 },
      { o: 'ServiceEndpoint', d: 'endpointResponseTime', c: 'ChartLine', t: 'Global ResponseTime', w: 3, h: 200 },
      { o: 'ServiceEndpoint', d: 'endpointSLA', c: 'ChartBar', t: 'Global SLA', w: 3, h: 200 },
      { o: 'ServiceEndpoint', d: 'endpointTraces', c: 'ChartSlow', t: 'Endpoint Slow', w: 3, h: 200 },
      { o: 'ServiceEndpoint', d: 'endpointThroughput', c: 'ChartLine', t: 'Endpoint Throughput', w: 3, h: 200 },
      { o: 'ServiceEndpoint', d: 'endpointTopology', c: 'ChartSankey', t: 'Endpoint Topology', w: 3, h: 200 },
      // instance
      { o: 'ServiceInstance', d: 'instanceResponseTime', c: 'ChartInstance', t: 'Instance Info', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceResponseTime', c: 'ChartLine', t: 'Instance ResponseTime', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceSLA', c: 'ChartLine', t: 'Instance SLA', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceThroughput', c: 'ChartLine', t: 'Instance Throughput', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceHeap', c: 'ChartLine', t: 'Instance Heap', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceNonheap', c: 'ChartLine', t: 'Instance Nonheap', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceGC', c: 'ChartLine', t: 'Instance GC', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceCPU', c: 'ChartLine', t: 'Instance CPU', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceClrCPU', c: 'ChartLine', t: 'Instance ClrCPU', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceClrGC', c: 'ChartLine', t: 'Instance ClrGC', w: 3, h: 200 },
      { o: 'ServiceInstance', d: 'instanceClrHeap', c: 'ChartLine', t: 'Instance ClrHeap', w: 3, h: 200 },
    ],
    proxy: [],
    database: [
        // global
        { o: 'Global', d: 'globalHeatmap', c: 'ChartHeatmap', t: 'Global Heatmap', w: 3, h: 200 },
        { o: 'Global', d: 'globalPercent', c: 'ChartLine', t: 'Global Percent Response', w: 3, h: 200 },
        { o: 'Global', d: 'globalBrief', c: 'ChartBrief', t: 'Global Brief', w: 3, h: 200 },
        { o: 'Global', d: 'globalThroughput', c: 'ChartTrace', t: 'Global Top Throughput', w: 3, h: 200 },
        { o: 'Global', d: 'globalSlow', c: 'ChartSlow', t: 'Global Top Slow Endpoint', w: 3, h: 200 },
        // database
        { o: 'Database', d: 'databaseResponseTime', c: 'ChartLine', t: 'Database ResponseTime', w: 3, h: 200 },
        { o: 'Database', d: 'databaseThroughput', c: 'ChartLine', t: 'Database Throughput', w: 3, h: 200 },
        { o: 'Database', d: 'databaseSLA', c: 'ChartBar', t: 'Database SLA', w: 3, h: 200 },
        { o: 'Database', d: 'databasePercent', c: 'ChartLine', t: 'Database Percent', w: 3, h: 200 },
        { o: 'Database', d: 'databaseTopNRecords', c: 'ChartSlow', t: 'Database TopN Records', w: 3, h: 200 },
    ],
  },
};

// mutations
const mutations: MutationTree<any> = {
  ...dashboardLayout.mutations,
};

// actions
const actions: ActionTree<State, any> = {
  ...dashboardQuery.actions,
  MIXHANDLE_CHANGE_GROUP(
    context: { commit: Commit, dispatch: Dispatch, state: State, rootState: any }, index: number): void {
    const rocketOption = context.rootState.rocketOption;
    const temp: any = {};
    if (rocketOption.currentService) { temp.service = rocketOption.currentService; }
    if (rocketOption.currentEndpoint) { temp.endpoint = rocketOption.currentEndpoint; }
    if (rocketOption.currentInstance) { temp.instance = rocketOption.currentInstance; }
    if (rocketOption.currentDatabase) { temp.database = rocketOption.currentDatabase; }
    context.commit('SET_GROUP_QUERY', temp);
    context.commit('SET_CURRENT_GROUP', index);
    context.dispatch('rocketOption/SET_CURRENT_STATE', context.state.tree[index].query);
    context.dispatch('RUN_EVENTS', {}, {root: true});
  },
} ;

// getters
const getters = {
  ...dashboardQuery.getters,
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
