import { Commit, ActionTree } from 'vuex';
import { Duration } from '@/store/interfaces/options';
import getLocalTime from '@/utils/localtime';
import { debounce } from '@/utils/debounce';

import * as types from '../mutation-types';

export interface State {
  duration: Duration;
  eventStack: any;
  chartStack: any;
}
let utc = -(new Date().getTimezoneOffset() / 60);
if (window.localStorage.getItem('utc')) {
  utc = parseInt(window.localStorage.getItem('utc'), 10);
} else {
  window.localStorage.setItem('utc', utc.toString());
}
const initState: State = {
  duration: {
    start: getLocalTime(utc, new Date(new Date().getTime() - (15 * 60 * 1000))),
    end: getLocalTime(utc, new Date()),
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
let timer = null;
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
    clearTimeout(timer);
    timer = setTimeout(() => state.eventStack.forEach((i) => { setTimeout(i(), 0); }), 500);
  },
  [types.SET_CHARTS](state: State, data: any[]) {
    state.chartStack.push(data);
  },
  [types.CLEAR_CHARTS](state: State) {
    state.chartStack = [];
  },
};
const w:any = window;
// actions
const actions: ActionTree<State, any> = {
  SET_DURATION(context: { commit: Commit }, data: Duration) {
    context.commit(types.SET_DURATION, data);
    if (w.axiosCancel.length !== 0) {
      for (let i = 0; i < w.axiosCancel.length; i += 1) setTimeout(w.axiosCancel[i](), 0);
      w.axiosCancel = [];
    }
    context.commit(types.RUN_EVENTS);
    return new Promise((resolve) => {
      resolve();
    });
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
