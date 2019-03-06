import { ActionTree, MutationTree } from 'vuex';
import { CompsContainer } from '../interfaces';

export interface State {
  data: CompsContainer;
}

const initState: State = {
  data: {
    service: [
      { o: 'Global', name: 'Global Brief',
      comp: 'ChartBrief', title: 'Global Brief', type: 'global', width: 3 },

      { o: 'Global', name: 'Global Response',
      comp: 'ChartResponse', title: 'Global Response', type: 'global', width: 3 },

      { o: 'Global', name: 'Global Heatmap',
      comp: 'ChartHeatmap', title: 'Global Heatmap', type: 'global', width: 3 },

      { o: 'Global', name: 'Instance Info',
      comp: 'ChartInstance', title: 'Instance Info', type: 'global', width: 3 },

      { o: 'Service', name: 'Avg Response',
      comp: 'ChartAvgResponse', title: 'ChartAvgSLA', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Avg Throughput',
      comp: 'ChartAvgThroughput', title: 'ChartAvgSLA', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Avg SLA',
      comp: 'ChartAvgSLA', title: 'ChartAvgSLA', type: 'serviceInfo', width: 3 },
      { o: 'Service', name: 'Critical Response',
      comp: 'ChartResponse', title: 'serviceInfo', type: 'serviceInfo', width: 3 },
      { o: 'ServiceInstance', name: 'CPU',
      comp: 'ChartCpu', title: 'CPU %' , width: 3 },
      { o: 'ServiceInstance', name: 'GC',
      comp: 'ChartGC', title: 'GC ms' , width: 3 },
      { o: 'ServiceInstance', name: 'Heap',
      comp: 'ChartHeap', title: 'Heap MB' , width: 3 },
      { o: 'ServiceInstance', name: 'NonHeap',
      comp: 'ChartNonHeap', title: 'Non-Heap MB' , width: 3 },
      { o: 'Service', name: 'Slow Endpoints',
      comp: 'ChartTrace', title: 'serviceInfo', type: 'serviceInfo.getSlowEndpoint', width: 3 },
      { o: 'Service', name: 'Slow Instance Throughput',
      comp: 'ChartSlow', title: 'serviceInfo', type: 'serviceInfo.getInstanceThroughput', width: 3 },
    ],
    proxy: [
      { o: 'Global', name: 'Critical Response',
      comp: 'ChartResponse', title: 'ChartResponse', type: 'global', width: 3 },
    ],
    database: [
      { o: 'Global', name: 'Critical Response',
      comp: 'ChartResponse', title: 'ChartResponse', type: 'global', width: 3 },
      { o: 'Database', name: 'Avg Response',
      comp: 'ChartAvgResponse', title: 'ChartAvgSLA', type: 'serviceInfo', width: 3 },
      { o: 'Database', name: 'Avg Throughput',
      comp: 'ChartAvgThroughput', title: 'ChartAvgSLA', type: 'serviceInfo', width: 3 },
      { o: 'Database', name: 'Avg SLA', comp: 'ChartAvgSLA', title: 'ChartAvgSLA', type: 'serviceInfo', width: 3 },
      { o: 'Database', name: 'Critical Response',
      comp: 'ChartResponse', title: 'serviceInfo', type: 'serviceInfo', width: 3 },
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
