import { Commit, ActionTree } from 'vuex';
import { getApps, getServices, getServers } from '@/api';
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
export interface State {
  applications: Option[];
  services: Option[];
  servers: Server[];
  currentApplication: Option;
  currentService: Option;
  currentServer: Server;
}

const initState: State = {
  applications: [],
  services: [],
  servers: [],
  currentApplication: {
    key: '',
    label: '',
  },
  currentService: {
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
  GET_SERVICES(context: { commit: Commit; state: State }, applicationId: String) {
    return getServices(applicationId).then((res) => {
      context.commit(types.SET_SERVICES, res.data.data.services);
      context.commit(types.SET_SERVICE, res.data.data.services[0]);
    });
  },
  GET_SERVERS(context: { commit: Commit; state: State, rootState: any }, applicationId: String) {
    return getServers(context.rootState.global.duration, applicationId).then((res) => {
      context.commit(types.SET_SERVERS, res.data.data.server);
      context.commit(types.SET_SERVER, res.data.data.server[0]);
    });
  },
};

// mutations
const mutations = {
  [types.SET_APPLICATIONS](state: State, data: Option[]) {
    state.applications = data;
  },
  [types.SET_SERVICES](state: State, data: Option[]) {
    state.services = data;
  },
  [types.SET_SERVERS](state: State, data: Server[]) {
    state.servers = data;
  },
  [types.SET_APPLICATION](state: State, data: Option) {
    state.currentApplication = data;
  },
  [types.SET_SERVICE](state: State, data: Option) {
    state.currentService = data;
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
