import { Commit, ActionTree } from 'vuex';
import { Duration } from '@/store/interfaces/options';
import * as types from '../mutation-types';

export interface State {
  duration: Duration;
  eventStack: any;
  chartStack: any;
}

const initState: State = {
  duration: {
    start: new Date(new Date().getTime() - (15 * 60 * 1000)),
    end: new Date(),
    step: 'MINUTE',
  },
  eventStack: [],
  chartStack: [],
};

// getters
const getters = {
  durationTime(state) {
    let gap = null;
    switch (state.duration.step){
      case 'MINUTE':
        gap = 60;
        break;
      case 'HOUR':
        gap = 60 * 60;
        break;
      case 'DAY':
        gap = 60 * 60 * 24;
        break;
      case 'MONTH':
        gap = 60 * 60 * 24 * 30;
        break;
      default:
        gap = 60 * 60 * 24 * 30 * 365;
    }
    const startUnix = state.duration.start.getTime();
    const endUnix = state.duration.end.getTime();
    const arrayTime = [];
    for (let i = 0; i <= endUnix - startUnix; i += gap * 1000) {
      arrayTime.push(startUnix + i);
    }
    return arrayTime;
  },
};

// mutations
const mutations = {
  [types.SET_DURATION](state: State, data: Duration) {
    state.duration = data;
  },
  [types.SET_EVENTS](state: State, data: any[]) {
    state.eventStack = data;
  },
  [types.CLEAR_EVENTS](state: State) {
    state.eventStack = [];
  },
  [types.RUN_EVENTS](state: State) {
    state.eventStack.forEach((i) => {
      setTimeout(i(), 0);
    });
  },
  [types.SET_CHARTS](state: State, data: any[]) {
    state.chartStack.push(data);
  },
  [types.CLEAR_CHARTS](state: State) {
    state.chartStack = [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  SET_DURATION(context: { commit: Commit }, data: Duration) {
    context.commit(types.SET_DURATION, data);
    context.commit(types.RUN_EVENTS);
  },
  RUN_EVENTS(context: { commit: Commit }) {
    context.commit(types.RUN_EVENTS);
  },
  SET_EVENTS(context: { commit: Commit }, data: any[]) {
    context.commit(types.CLEAR_EVENTS);
    context.commit(types.SET_EVENTS, data);
  },
  SET_CHARTS(context: { commit: Commit }, data: any[]) {
    context.commit(types.SET_CHARTS, data);
  },
  CLEAR_CHARTS(context: { commit: Commit }) {
    context.commit(types.CLEAR_CHARTS);
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
