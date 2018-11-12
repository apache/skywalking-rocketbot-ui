import { Commit, ActionTree } from 'vuex';
import { getEndpointInfo, getApplicationInfo, getServerInfo, getServerDetail } from '@/api/dashboard';
import * as types from '../mutation-types';

interface SlowTrace {
  key: String;
  duration: Number;
  isError: Boolean;
  start: String;
  traceIds: String[];
  operationNames: String[];
}
interface Endpoint{
  key: String;
  applicationName: String;
  applicationOd: String;
  label: String;
}
interface SlowService {
  endpoint: Endpoint;
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
interface P {
  p99: Number[];
  p95: Number[];
  p90: Number[];
  p75: Number[];
  p50: Number[];
}
export interface State {
  throughput: Number[];
  responseTime: Number[];
  p: P;
  endpointP: P;
  slowTrace: SlowTrace[];
  slowService: SlowService[];
  applicationThroughput: ApplicationThroughput[];
  sla: Number[];
  cpu: Number[];
  gc: Gc;
  memory: Memory;
  serverResponseTime: Number[];
  serverThroughput: Number[];
}

const initState: State = {
  throughput: [],
  responseTime: [],
  p: {
    p99: [],
    p95: [],
    p90: [],
    p75: [],
    p50: [],
  },
  endpointP: {
    p99: [],
    p95: [],
    p90: [],
    p75: [],
    p50: [],
  },
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
  [types.SET_ENDPOINT_INFO](state: State, data: any) {
    state.throughput = data.data.throughput.values.map((i) => {
      if (i.hasOwnProperty('value')) return i.value;
      return i;
    });
    state.responseTime = data.data.responseTime.values.map((i) => {
      if (i.hasOwnProperty('value')) return i.value;
      return i;
    });
    state.sla = data.data.sla.values.map((i) => {
      if (i.hasOwnProperty('value')) return i.value;
      return i;
    });
    state.slowTrace = data.data.slowTrace.traces;
    state.endpointP = data.p;
  },
  [types.SET_APPLICATION_INFO](state: State, data: any) {
    state.slowService = data.data.slowService;
    state.applicationThroughput = data.data.applicationThroughput;
    state.p = data.p;
  },
  [types.SET_SERVER_INFO](state: State, data: any) {
    state.serverResponseTime = data.serverResponseTime.values.map((i) => {
      if (i.hasOwnProperty('value')) return i.value;
      return i;
    });
    state.serverThroughput = data.serverThroughput.values.map((i) => {
      if (i.hasOwnProperty('value')) return i.value;
      return i;
    });
  },
  [types.SET_SERVER_DETAIL](state: State, data: any) {
    if (data.cpu.values) {
      state.cpu = data.cpu.values.map(i => i.value);
      state.gc = {
        oldGCTime: data.oldGCTime.values.map(i => i.value),
        oldGCCount:data.oldGCCount.values.map(i => i.value),
        youngGCCount: data.youngGCCount.values.map(i => i.value),
        youngGCTime: data.youngGCTime.values.map(i => i.value),
      };
      state.memory.heap = data.heap.values.map(i => (i.value / 1024 / 1024).toFixed(2));
      state.memory.maxHeap = data.maxHeap.values.map(i => (i.value / 1024 / 1024).toFixed(2));
      state.memory.maxNoHeap = data.maxNoheap.values.map(i => (i.value / 1024 / 1024).toFixed(2));
      state.memory.noHeap = data.noheap.values.map(i => (i.value / 1024 / 1024).toFixed(2));
    } else {
      state.cpu = data.cpu.cost;
      state.gc = data.gc;
      state.memory.heap = data.memory.heap.map(i => (i / 1024 / 1024).toFixed(2));
      state.memory.maxHeap = data.memory.maxHeap.map(i => (i / 1024 / 1024).toFixed(2));
      state.memory.maxNoHeap = data.memory.maxNoheap.map(i => (i / 1024 / 1024).toFixed(2));
      state.memory.noHeap = data.memory.noheap.map(i => (i / 1024 / 1024).toFixed(2));
    }
  },
  [types.CLEAR_DASHBOARD](state: State) {
    state.throughput = [];
    state.responseTime = [];
    state.sla = [];
    state.slowTrace = [];
    state.slowService = [];
    state.p.p99 = [];
    state.p.p95 = [];
    state.p.p90 = [];
    state.p.p75 = [];
    state.p.p50 = [];
    state.endpointP.p99 = [];
    state.endpointP.p95 = [];
    state.endpointP.p90 = [];
    state.endpointP.p75 = [];
    state.endpointP.p50 = [];
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
      let p = {
        p99: [],
        p95: [],
        p90: [],
        p75: [],
        p50: [],
      };
      if (res.data.data.getP99) {
        p = {
          p99: res.data.data.getP99.values.map(i => i.value),
          p95: res.data.data.getP95.values.map(i => i.value),
          p90: res.data.data.getP90.values.map(i => i.value),
          p75: res.data.data.getP75.values.map(i => i.value),
          p50: res.data.data.getP50.values.map(i => i.value),
        };
      }
      context.commit(types.SET_APPLICATION_INFO, { data:res.data.data, p });
    }).catch(() => {
      context.commit(types.SET_APPLICATION_INFO, { data:{
        slowService: [],
        applicationThroughput: [],
      }, p: {
        p99: [],
        p95: [],
        p90: [],
        p75: [],
        p50: [],
      },
      });
    });
  },
  GET_ENDPOINT_INFO(context: { commit: Commit; state: State, rootState: any }, params:any) {
    const { applicationId, endpoint } = params;
    return getEndpointInfo(context.rootState.global.duration, applicationId, endpoint).then((res) => {
      let p = {
        p99: [],
        p95: [],
        p90: [],
        p75: [],
        p50: [],
      };
      if (res.data.data.getP99) {
        p = {
          p99: res.data.data.getP99.values.map(i => i.value),
          p95: res.data.data.getP95.values.map(i => i.value),
          p90: res.data.data.getP90.values.map(i => i.value),
          p75: res.data.data.getP75.values.map(i => i.value),
          p50: res.data.data.getP50.values.map(i => i.value),
        };
      }
      context.commit(types.SET_ENDPOINT_INFO, { data:res.data.data, p });
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
