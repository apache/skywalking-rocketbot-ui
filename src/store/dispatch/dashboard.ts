import store from '../index';
import { Option, Server } from '@/store/modules/options.ts';
// export const appChange = (products: CartProduct[]) => {
//   return store.dispatch('checkout', products)
// }

export const appChange = (application:Option): void => {
  store.commit('options/SET_APPLICATION', application);
  store.dispatch('options/GET_SERVICES', store.state.options.currentApplication.key)
    .then(() => {
      store.dispatch('dashboard/GET_SERVICE_INFO', {
        applicationId: store.state.options.currentApplication.key,
        service: store.state.options.currentService,
      });
    });
  store.dispatch('options/GET_SERVERS', store.state.options.currentApplication.key)
    .then(() => {
      store.dispatch('dashboard/GET_SERVER_INFO', store.state.options.currentServer.key);
    });
};

export const serviceChange = (service:Option) => {
  store.commit('options/SET_SERVICE', service);
  store.dispatch('dashboard/GET_SERVICE_INFO', {
    applicationId: store.state.options.currentApplication.key,
    service: store.state.options.currentService,
  });
};
interface ServApp {
  app:Option;
  service:Option;
}
export const serviceAppChange = (servApp:ServApp) => {
  store.dispatch('options/GET_SERVICES', servApp.app.key);
  store.dispatch('options/GET_SERVERS', servApp.app.key);
  store.commit('options/SET_APPLICATION', servApp.app);
  store.commit('options/SET_SERVICE', servApp.service);
  store.dispatch('dashboard/GET_SERVICE_INFO', {
    applicationId: store.state.options.currentApplication.key,
    service: store.state.options.currentService,
  });
};

export const serverChange = (server: Server) => {
  store.commit('options/SET_SERVER', server);
  store.dispatch('dashboard/GET_SERVER_INFO', store.state.options.currentServer.key);
};
