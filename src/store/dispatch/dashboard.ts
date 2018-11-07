import store from '../index';
import { Option, Server } from '@/store/modules/options.ts';
// export const appChange = (products: CartProduct[]) => {
//   return store.dispatch('checkout', products)
// }

export const appChange = (application:Option): void => {
  store.commit('options/SET_APPLICATION', application);
  store.dispatch('options/GET_ENDPOINTS', store.state.options.currentApplication.key)
    .then(() => {
      store.dispatch('dashboard/GET_ENDPOINT_INFO', {
        applicationId: store.state.options.currentApplication.key,
        endpoint: store.state.options.currentEndpoint,
      });
    });
  store.dispatch('options/GET_SERVERS', store.state.options.currentApplication.key)
    .then(() => {
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
interface ServApp {
  app:Option;
  endpoint:Option;
}
export const serviceAppChange = (servApp:ServApp) => {
  store.dispatch('options/GET_ENDPOINTS', servApp.app.key);
  store.dispatch('options/GET_SERVERS', servApp.app.key);
  store.commit('options/SET_APPLICATION', servApp.app);
  store.commit('options/SET_ENDPOINT', servApp.endpoint);
  store.dispatch('dashboard/GET_ENDPOINT_INFO', {
    applicationId: store.state.options.currentApplication.key,
    endpoint: store.state.options.currentEndpoint,
  });
};

export const serverChange = (server: Server) => {
  store.commit('options/SET_SERVER', server);
  store.dispatch('dashboard/GET_SERVER_INFO', store.state.options.currentServer.key);
};
