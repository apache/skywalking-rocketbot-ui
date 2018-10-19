import { Commit, ActionTree } from 'vuex';
import { getServiceInfo, getApplicationInfo, getServerInfo, getServerDetail } from '@/api/dashboard';
import * as types from '../mutation-types';

interface SlowTrace {
  key: String;
  duration: Number;
  isError: Boolean;
  start: String;
  traceIds: String[];
  operationNames: String[];
}
interface Service{
  key: String;
  applicationName: String;
  applicationOd: String;
  label: String;
}
interface SlowService {
  service: Service;
  value: Number;
}
interface ApplicationThroughput {
  key: Number;
  label: String;
  value: Number;
}
interface Memory {
  heap: Number[];
  maxHeap: Number[];
  maxNoHeap: Number[];
  noHeap: Number[];
}
interface Gc {
  oldGCTime: Number[];
  oldGCCount: Number[];
  youngGCCount: Number[];
  youngGCTime: Number[];
}
export interface State {
  throughput: Number[];
  responseTime: Number[];
  sla: Number[];
  slowTrace: SlowTrace[];
  slowService: SlowService[];
  applicationThroughput: ApplicationThroughput[];

  cpu: Number[];
  gc: Gc;
  memory: Memory;
  serverResponseTime: Number[];
  serverThroughput: Number[];
}

const initState: State = {
  throughput: [],
  responseTime: [],
  sla: [],
  slowTrace:[],
  slowService:[],
  applicationThroughput:[],

  cpu: [],
  gc: {
    oldGCTime: [],
    oldGCCount: [],
    youngGCCount: [],
    youngGCTime: [],
  },
  memory: {
    heap: [],
    maxHeap: [],
    maxNoHeap: [],
    noHeap: [],
  },
  serverResponseTime: [],
  serverThroughput: [],
};

// getters
const getters = {
  // checkoutStatus: (state: State) => state.application,
};

// mutations
const mutations = {
  [types.SET_SERVICE_INFO](state: State, data: any) {
    state.throughput = data.throughput.trendList;
    state.responseTime = data.responseTime.trendList;
    state.sla = data.sla.trendList;
    state.slowTrace = data.slowTrace.traces;
  },
  [types.SET_APPLICATION_INFO](state: State, data: any) {
    state.slowService = data.slowService;
    state.applicationThroughput = data.applicationThroughput;
  },
  [types.SET_SERVER_INFO](state: State, data: any) {
    state.serverResponseTime = data.serverResponseTime.trendList;
    state.serverThroughput = data.serverThroughput.trendList;
  },
  [types.SET_SERVER_DETAIL](state: State, data: any) {
    state.cpu = data.cpu.cost;
    state.gc = data.gc;
    state.memory.heap = data.memory.heap.map(i => (i / 1024 / 1024).toFixed(2));
    state.memory.maxHeap = data.memory.maxHeap.map(i => (i / 1024 / 1024).toFixed(2));
    state.memory.maxNoHeap = data.memory.maxNoheap.map(i => (i / 1024 / 1024).toFixed(2));
    state.memory.noHeap = data.memory.noheap.map(i => (i / 1024 / 1024).toFixed(2));
  },
  [types.CLEAR_DASHBOARD](state: State) {
    state.throughput = [];
    state.responseTime = [];
    state.sla = [];
    state.slowTrace = [];
    state.slowService = [];
    state.applicationThroughput = [];
    state.cpu = [];
    state.gc = {
      oldGCTime: [],
      oldGCCount: [],
      youngGCCount: [],
      youngGCTime: [],
    };
    state.memory = {
      heap: [],
      maxHeap: [],
      maxNoHeap: [],
      noHeap: [],
    },
    state.serverResponseTime = [];
    state.serverThroughput = [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_APPLICATION_INFO(context: { commit: Commit; state: State, rootState: any }) {
    return getApplicationInfo(context.rootState.global.duration).then((res) => {
      context.commit(types.SET_APPLICATION_INFO, res.data.data);
    }).catch(() => {
      context.commit(types.SET_APPLICATION_INFO, { slowService: [], applicationThroughput: [] });
    });
  },
  GET_SERVICE_INFO(context: { commit: Commit; state: State, rootState: any }, params:any) {
    const { applicationId, service } = params;
    return getServiceInfo(context.rootState.global.duration, applicationId, service).then((res) => {
      context.commit(types.SET_SERVICE_INFO, res.data.data);
    });
  },
  GET_SERVER_INFO(context: { commit: Commit; state: State, rootState: any }, serverId) {
    return getServerInfo(context.rootState.global.duration, serverId).then((res) => {
      context.commit(types.SET_SERVER_INFO, res.data.data);
    });
  },
  GET_SERVER_DETAIL(context: { commit: Commit; state: State, rootState: any }, serverId) {
    return getServerDetail(context.rootState.global.duration, serverId).then((res) => {
      context.commit(types.SET_SERVER_DETAIL, res.data.data);
    });
  },
  CLEAR_DASHBOARD(context: { commit: Commit; state: State, rootState: any }) {
    context.commit(types.CLEAR_DASHBOARD);
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
