import store from '../index';

export const getTopo = (): void => {
  store.dispatch('topo/GET_TOPO');
};
