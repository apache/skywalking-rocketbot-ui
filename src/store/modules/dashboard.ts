import { Commit, ActionTree } from 'vuex';
import { getServiceInfo, getApplicationInfo, getServerInfo } from '@/api/dashboard';
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
  oldGCount: Number[];
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
    oldGCount: [],
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
    // state.cpu = data.cpu.cost;
    // state.gc = data.gc;
    // state.memory = data.memory;
    state.serverResponseTime = data.serverResponseTime.trendList;
    state.serverThroughput = data.serverThroughput.trendList;
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
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
