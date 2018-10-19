import { Commit, ActionTree } from 'vuex';
import { getAlarm } from '@/api/alarm';
import * as types from '../mutation-types';

export interface AlarmParams {
  paging:Number;
  type:String;
}

export interface Alarm {
  causeType: String;
  content: String;
  key: String;
  startTime: String;
  title: String;
}

export interface State {
  alarmList: Alarm[];
  total: Number;
}

const initState: State = {
  alarmList: [],
  total: 0,
};

// getters
const getters = {
};

// mutations
const mutations = {
  [types.SET_ALARM](state: State, data: Alarm[]) {
    state.alarmList = data;
  },
  [types.SET_ALARM_TOTAL](state: State, total:Number) {
    state.total = total;
  },
  [types.CLEAR_ALARM](state: State) {
    state.alarmList = [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_ALARM(context: { commit: Commit; state: State, rootState: any }, params:AlarmParams) {
    const { paging, type } = params;
    return getAlarm(context.rootState.global.duration, type, paging).then((res) => {
      context.commit(types.SET_ALARM, res.data.data.alarmList.items);
      context.commit(types.SET_ALARM_TOTAL, res.data.data.alarmList.total);
    });
  },
  CLEAR_ALARM(context: { commit: Commit; state: State, rootState: any }) {
    context.commit(types.CLEAR_ALARM);
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
