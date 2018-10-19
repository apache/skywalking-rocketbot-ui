import store from '../index';
import { Option } from '@/store/modules/options.ts';

export const getTopo = (): void => {
  if (store.state.topo.current.key === 'default') {
    store.dispatch('topo/GET_TOPO');
  } else {
    store.dispatch('topo/GET_TOPO_APPLICATION', store.state.topo.current.key);
  }
};
