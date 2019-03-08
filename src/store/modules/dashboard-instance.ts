import { Commit, ActionTree, MutationTree, Dispatch } from 'vuex';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import * as types from '../mutation-types';

export interface State {
  instances: any;
  currentInstance: any;
  instanceInfo: any;
}

const initState: State = {
  instances: [],
  currentInstance: {},
  instanceInfo: {
    getCPUTrend: [],
    getResponseTimeTrend: [],
    getSLATrend: [],
    getThroughputTrend: [],
    heap: [],
    maxHeap: [],
    maxNoheap: [],
    noheap: [],
    oldGCCount: [],
    oldGCTime: [],
    youngGCCount: [],
    youngGCTime: [],
    envoyHeap: [],
    envoyTotal: [],
    envoyParent: [],
  },
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_INSTANCES](state: State, data: any) {
    state.instances = data;
    if ((!state.currentInstance.key && data.length) || state.instances.indexOf(state.currentInstance) === -1 ) {
      state.currentInstance = data[0];
    }
  },
  [types.SET_CURRENT_INSTANCE](state: State, instance: any) {
    state.currentInstance = instance;
  },
  [types.SET_INSTANCE_INFO](state: State, data: any) {
    state.instanceInfo.getCPUTrend = data.getCPUTrend.values;
    state.instanceInfo.getResponseTimeTrend = data.getServiceInstanceResponseTimeTrend.values;
    state.instanceInfo.getSLATrend = data.getServiceInstanceSLA.values;
    state.instanceInfo.getThroughputTrend = data.getServiceInstanceThroughputTrend.values;
    state.instanceInfo.heap = data.heap.values;
    state.instanceInfo.maxHeap = data.maxHeap.values;
    state.instanceInfo.maxNoheap = data.maxNoheap.values;
    state.instanceInfo.noheap = data.noheap.values;
    state.instanceInfo.oldGCCount = data.oldGCCount.values;
    state.instanceInfo.oldGCTime = data.oldGCTime.values;
    state.instanceInfo.youngGCCount = data.youngGCCount.values;
    state.instanceInfo.youngGCTime = data.youngGCTime.values;
    state.instanceInfo.envoyHeap = data.envoyHeap ? data.envoyHeap.values : [];
    state.instanceInfo.envoyParent =  data.envoyParent ? data.envoyParent.values : [];
    state.instanceInfo.envoyTotal =  data.envoyTotal ? data.envoyTotal.values : [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_INSTANCES(context: { commit: Commit }, params: any) {
    return graph
    .query('queryInstances')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_INSTANCES, res.data.data);
    });
  },
  GET_INSTANCE(context: { commit: Commit }, params: any) {
    return graph
    .query('queryDashBoardInstance')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_INSTANCE_INFO, res.data.data);
    });
  },
  SELECT_INSTANCE(context: { commit: Commit, dispatch: Dispatch }, params: any) {
    context.commit('SET_CURRENT_INSTANCE', params.instance);
    context.dispatch('GET_INSTANCE', {
        duration: params.duration,
        serviceInstanceId: params.instance.key,
    });
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
