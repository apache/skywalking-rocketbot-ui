import { Commit, ActionTree, MutationTree, Dispatch } from 'vuex';
import { CompQuery } from '../interfaces';
import * as types from '../mutation-types';
import dashboardGlobal from './dashboard-global';
import dashboardService from './dashboard-service';
import dashboardDatabase from './dashboard-database';
import dashboardEndpoint from './dashboard-endpoint';
import dashboardInstance from './dashboard-instance';

export interface State {
  global: any;
  services: any;
  serviceInfo: any;
  currentService: any;
  databases: any;
  currentDatabase: any;
  endpoints: any;
  endpointInfo: any;
  currentEndpoint: any;
  instances: any;
  currentInstance: any;
  instanceInfo: any;
}

const initState: State = {
  ...dashboardGlobal.state,
  ...dashboardService.state,
  ...dashboardDatabase.state,
  ...dashboardEndpoint.state,
  ...dashboardInstance.state,
};

// getters
const getters = {
  ...dashboardGlobal.getters,
  ...dashboardService.getters,
  ...dashboardDatabase.getters,
  ...dashboardEndpoint.getters,
  ...dashboardInstance.getters,
};

// mutations
const mutations: MutationTree<any> = {
  ...dashboardGlobal.mutations,
  ...dashboardService.mutations,
  ...dashboardDatabase.mutations,
  ...dashboardEndpoint.mutations,
  ...dashboardInstance.mutations,
};

// actions
const actions: ActionTree<any, any> = {
  ...dashboardGlobal.actions,
  ...dashboardService.actions,
  ...dashboardDatabase.actions,
  ...dashboardEndpoint.actions,
  ...dashboardInstance.actions,
  SET_CURRENT_STATE(context: { commit: Commit }, params: CompQuery) {
    context.commit(types.SET_CURRENT_SERVICE, params.service ? params.service : {});
    context.commit(types.SET_CURRENT_DATABASE, params.database ? params.database : {});
    context.commit(types.SET_CURRENT_ENDPOINT, params.endpoint ? params.endpoint : {});
    context.commit(types.SET_CURRENT_INSTANCE, params.instance ? params.instance : {});
  },
  MIXHANDLE_GET_DASHBOARD(context: { commit: Commit, dispatch: Dispatch, state: State, rootState: any }, params: any) {
    if ( params.compType === 'service') {
      context.dispatch('GET_SERVICES', {duration: params.duration})
      .then(() => context.dispatch('GET_SERVICE',
        {duration: params.duration, serviceId: context.state.currentService.key, keyword: ''})
      .then(() => {
        context.dispatch('GET_ENDPOINT',
        {
          duration: params.duration,
          endpointId: context.state.currentEndpoint.key,
          endpointName: context.state.currentEndpoint.label,
        });
        context.dispatch('GET_INSTANCE',
        {
          duration: params.duration,
          serviceInstanceId: context.state.currentInstance.key,
        });
      }));
    } else if ( params.compType === 'database') {
      context.dispatch('GET_DATABASES', {duration: params.duration})
      .then(() => context.dispatch('GET_DATABASE',
        {
          duration: params.duration,
          databaseId: context.state.currentDatabase.key,
          condition: {
            serviceId: context.state.currentDatabase.key,
            metricName: 'top_n_database_statement',
            topN: 20,
            order: 'DES',
            duration: params.duration,
      }}),
      );
    }
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
