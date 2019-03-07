import Vue from 'vue';
import Vuex from 'vuex';
import rocketbot, { State as RocketbotState } from './modules';
import rocketComps, { State as rocketCompsState } from './modules/comps';
Vue.use(Vuex);

export interface State {
  rocketbot: RocketbotState;
  rocketComps: rocketCompsState;
}

export default new Vuex.Store({
  modules: {
    rocketbot,
    rocketComps,
  },
});
