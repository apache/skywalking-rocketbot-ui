import { Commit, ActionTree } from 'vuex';
import { getApps, getEndpoints, getServers } from '@/api';
import * as types from '../mutation-types';

export interface Option {
  key: String;
  label: String;
}
export interface Server {
  key: String;
  value: Number;
  pid: Number;
  osName: String;
  ipv4: String[];
}
export interface SlowEndpoint {
  key: String;
  label: String;
  value: Number;
}

export interface State {
  applications: Option[];
  endpoints: Option[];
  servers: Server[];
  serversThroughput: Server[];
  serviceSlow: SlowEndpoint[];
  currentApplication: Option;
  currentEndpoint: Option;
  currentServer: Server;
}

const initState: State = {
  applications: [],
  endpoints: [],
  servers: [],
  serversThroughput: [],
  serviceSlow: [],
  currentApplication: {
    key: '',
    label: '',
  },
  currentEndpoint: {
    key: '',
    label: '',
  },
  currentServer: {
    key: '',
    value: null,
    pid: null,
    osName: '',
    ipv4: [],
  },
};

// getters
const getters = {
  // checkoutStatus: (state: State) => state.application,
};

// actions
const actions: ActionTree<State, any> = {
  GET_APPLICATIONS(context: { commit: Commit; state: State, rootState: any }) {
    return getApps(context.rootState.global.duration).then((res) => {
      context.commit(types.SET_APPLICATIONS, res.data.data.applications);
      // context.commit(types.SET_APPLICATION, res.data.data.applications[0]);
    });
  },
  GET_ENDPOINTS(context: { commit: Commit; state: State }, applicationId: String) {
    return getEndpoints(applicationId).then((res) => {
      context.commit(types.SET_ENDPOINTS, res.data.data.endpoints);
      // context.commit(types.SET_ENDPOINT, res.data.data.endpoints[0]);
    });
  },
  GET_SERVERS(context: { commit: Commit; state: State, rootState: any }, applicationId: String) {
    return getServers(context.rootState.global.duration, applicationId).then((res) => {
      res.data.data.servers.forEach((i) => {
        if (!i.name) {
          i.name = `${i.pid}@${i.ipv4[0]}`;
        }
      });
      if (res.data.data.getServiceInstanceThroughput) {
        context.commit(types.SET_SERVERS_THROUGHPUT, res.data.data.getServiceInstanceThroughput);
      } else {
        context.commit(types.SET_SERVERS_THROUGHPUT, res.data.data.servers);
      }
      context.commit(types.SET_SERVERS, res.data.data.servers);
      context.commit(types.SET_SLOWENDPOINT, res.data.data.serviceSlowEndpoint);
      // context.commit(types.SET_SERVER, res.data.data.servers[0]);
    });
  },
};

// mutations
const mutations = {
  [types.SET_APPLICATIONS](state: State, data: Option[]) {
    state.applications = data;
  },
  [types.SET_ENDPOINTS](state: State, data: Option[]) {
    state.endpoints = data;
  },
  [types.SET_SERVERS](state: State, data: Server[]) {
    state.servers = data;
  },
  [types.SET_SERVERS_THROUGHPUT](state: State, data: Server[]) {
    state.serversThroughput = data;
  },
  [types.SET_SLOWENDPOINT](state: State, data: SlowEndpoint[]) {
    state.serviceSlow = data;
  },
  [types.SET_APPLICATION](state: State, data: Option) {
    state.currentApplication = data;
  },
  [types.SET_ENDPOINT](state: State, data: Option) {
    state.currentEndpoint = data;
  },
  [types.SET_SERVER](state: State, data: Server) {
    state.currentServer = data;
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
