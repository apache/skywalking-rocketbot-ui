import store from '../index';
import { Option, Server } from '@/store/modules/options.ts';

export const appChange = (application:Option): void => {
  store.commit('options/SET_APPLICATION', application);
  store.dispatch('options/GET_ENDPOINTS', store.state.options.currentApplication.key)
    .then(() => {
      store.commit('options/SET_ENDPOINT', store.state.options.endpoints[0]);
      store.dispatch('dashboard/GET_ENDPOINT_INFO', {
        applicationId: store.state.options.currentApplication.key,
        endpoint: store.state.options.currentEndpoint,
      });
    });
  store.dispatch('options/GET_SERVERS', store.state.options.currentApplication.key)
    .then(() => {
      store.commit('options/SET_SERVER', store.state.options.servers[0]);
      store.dispatch('dashboard/GET_SERVER_INFO', store.state.options.currentServer.key);
    });
};

export const endpointChange = (endpoint:Option) => {
  store.commit('options/SET_ENDPOINT', endpoint);
  store.dispatch('dashboard/GET_ENDPOINT_INFO', {
    applicationId: store.state.options.currentApplication.key,
    endpoint: store.state.options.currentEndpoint,
  });
};

export const serverChange = (server: Server) => {
  store.commit('options/SET_SERVER', server);
  store.dispatch('dashboard/GET_SERVER_INFO', store.state.options.currentServer.key);
};

interface ServApp {
  app:Option;
  endpoint:Option;
}
export const serviceAppChange = (servApp:ServApp) => {
  store.commit('options/SET_APPLICATION', servApp.app);
  store.dispatch('options/GET_ENDPOINTS', servApp.app.key)
    .then(() => {
      store.commit('options/SET_ENDPOINT', servApp.endpoint);
      store.dispatch('dashboard/GET_ENDPOINT_INFO', {
        applicationId: servApp.app.key,
        endpoint: servApp.endpoint,
      });
    });
  store.dispatch('options/GET_SERVERS', servApp.app.key)
    .then(() => {
      store.commit('options/SET_SERVER', store.state.options.servers[0]);
    });
};
