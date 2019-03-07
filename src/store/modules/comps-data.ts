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
      { o: 'Global', name: 'Global Response',
      comp: 'ChartResponse', title: 'Global Percent Response', type: 'global', width: 3 },
      { o: 'Global', name: 'Global Heatmap',
      comp: 'ChartHeatmap', title: 'Global Heatmap', type: 'global', width: 3 },
      { o: 'Global', name: 'Global Top Slow Endpoint',
      comp: 'ChartTroughput', title: 'Global Top Slow Endpoint', type: 'global.getTopNSlowEndpoint', width: 3 },
      { o: 'Global', name: 'Global Top Throughput',
      comp: 'ChartSlow', title: 'Global Top Throughput', type: 'global.getTopNServiceThroughput', width: 3 },
      // service
      { o: 'Service', name: 'Service Avg Response',
      comp: 'ChartAvgResponse', title: 'Service Avg Response', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Avg Throughput',
      comp: 'ChartAvgThroughput', title: 'Service Avg Throughput', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Avg SLA',
      comp: 'ChartAvgSLA', title: 'Service Avg SLA', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Percent Response',
      comp: 'ChartResponse', title: 'Service Percent Response', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Service Top Slow Endpoint',
      comp: 'ChartSlow', title: 'Service Top Slow Endpoint', type: 'serviceInfo.getSlowEndpoint', width: 3 },
      { o: 'Service', name: 'Running ServiceInstance',
      comp: 'ChartTroughput', title: 'Running ServiceInstance', type: 'serviceInfo.getInstanceThroughput', width: 3 },
      // instance
      { o: 'ServiceInstance', name: 'Instance Avg Response',
      comp: 'ChartAvgResponse', title: 'Instance Avg Response', type: 'instanceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'Instance Avg Throughput',
      comp: 'ChartAvgThroughput', title: 'Instance Avg Throughput', type: 'instanceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'Instance Avg SLA',
      comp: 'ChartAvgSLA', title: 'Instance Avg SLA', type: 'instanceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'Instance Info',
      comp: 'ChartInstance', title: 'Instance Info', type: 'global', width: 3 },
      { o: 'ServiceInstance', name: 'Instance CPU',
      comp: 'ChartCpu', title: 'Instance CPU %' , width: 3 },
      { o: 'ServiceInstance', name: 'Instance GC',
      comp: 'ChartGC', title: 'Instance GC ms' , width: 3 },
      { o: 'ServiceInstance', name: 'Instance Heap',
      comp: 'ChartHeap', title: 'Instance Heap MB' , width: 3 },
      { o: 'ServiceInstance', name: 'Instance NonHeap',
      comp: 'ChartNonHeap', title: 'Instance Non-Heap MB' , width: 3 },
    ],
    proxy: [],
    database: [
        // global
        { o: 'Global', name: 'Global Brief',
        comp: 'ChartBrief', title: 'Global Brief', type: 'global', width: 3 },
        { o: 'Global', name: 'Global Response',
        comp: 'ChartResponse', title: 'Global Percent Response', type: 'global', width: 3 },
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
        comp: 'ChartTrace', title: 'Database Top Slow SQL', type: 'databaseInfo.getTopNRecords', width: 6 },

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
