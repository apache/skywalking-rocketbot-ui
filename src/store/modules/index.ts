/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Commit, ActionTree, MutationTree, GetterTree, Getter } from 'vuex';
import getLocalTime from '@/utils/localtime';
import { Duration } from '../interfaces';
import * as types from '../mutation-types';

const w = window as any;
let timer: any = null;

const dateFormate = (date: Date, step: string) => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) {
    month = `0${monthTemp}`;
  }
  if (step === 'MONTH') {
    return `${year}-${month}`;
  }
  const dayTemp = date.getDate();
  let day: string = `${dayTemp}`;
  if (dayTemp < 10) { day = `0${dayTemp}`; }
  if (step === 'DAY') { return `${year}-${month}-${day}`; }
  const hourTemp = date.getHours();
  let hour: string = `${hourTemp}`;
  if (hourTemp < 10) { hour = `0${hourTemp}`; }
  if (step === 'HOUR') { return `${year}-${month}-${day} ${hour}`; }
  const minuteTemp = date.getMinutes();
  let minute: string = `${minuteTemp}`;
  if (minuteTemp < 10) { minute = `0${minuteTemp}`; }
  if (step === 'MINUTE') { return `${year}-${month}-${day} ${hour}${minute}`; }
};
const dateFormateTime = (date: Date, step: string) => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) {
    month = `0${monthTemp}`;
  }
  if (step === 'MONTH') {
    return `${year}-${month}`;
  }
  const dayTemp = date.getDate();
  let day: string = `${dayTemp}`;
  if (dayTemp < 10) { day = `0${dayTemp}`; }
  if (step === 'DAY') { return `${month}-${day}`; }
  const hourTemp = date.getHours();
  let hour: string = `${hourTemp}`;
  if (hourTemp < 10) { hour = `0${hourTemp}`; }
  if (step === 'HOUR') { return `${month}-${day} ${hour}`; }
  const minuteTemp = date.getMinutes();
  let minute: string = `${minuteTemp}`;
  if (minuteTemp < 10) { minute = `0${minuteTemp}`; }
  if (step === 'MINUTE') { return `${hour}:${minute}\n${month}-${day}`; }
};
export interface State {
  durationRow: Duration;
  eventStack: any;
  chartStack: any;
  edit: boolean;
  utc: string | number;
}

let utc = w.localStorage.getItem('utc');
if (!utc) {
  utc = (-(new Date().getTimezoneOffset() / 60)).toString();
  w.localStorage.setItem('utc', utc);
}
const initState: State = {
  durationRow: {
    start: new Date(new Date().getTime() - 900000),
    end: new Date(),
    step: 'MINUTE',
  },
  eventStack: [],
  chartStack: [],
  edit: false,
  utc: window.localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60),
};

// getters
const getters = {
  duration(state: State) {
    return {
      start: getLocalTime(parseInt(state.utc + '', 10), state.durationRow.start),
      end: getLocalTime(parseInt(state.utc + '', 10), state.durationRow.end),
      step: state.durationRow.step,
    };
  },
  intervalTime(state: State, getter: any) {
    let interval: number = 946080000000;
    switch (getter.duration.step) {
      case 'MINUTE':
        interval = 60000;
        break;
      case 'HOUR':
        interval = 3600000;
        break;
      case 'DAY':
        interval = 86400000;
        break;
      case 'MONTH':
        interval = (getter.duration.end.getTime() - getter.duration.start.getTime())
        / (getter.duration.end.getFullYear() * 12 + getter.duration.end.getMonth()
        - getter.duration.start.getFullYear() * 12 - getter.duration.start.getMonth());
        break;
    }
    const utcSpace = (parseInt(state.utc + '', 10) + new Date().getTimezoneOffset() / 60) * 3600000;
    const startUnix: number = getter.duration.start.getTime();
    const endUnix: number = getter.duration.end.getTime();
    const timeIntervals: number[] = [];
    for (let i = 0; i <= endUnix - startUnix; i += interval) {
      const temp: any = dateFormateTime(new Date(startUnix + i - utcSpace), getter.duration.step);
      timeIntervals.push(temp);
    }
    return timeIntervals;
  },
  durationTime(_: State, getter: any) {
    return {
      start: dateFormate(getter.duration.start, getter.duration.step),
      end: dateFormate(getter.duration.end, getter.duration.step),
      step: getter.duration.step,
    };
  },
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_DURATION](state: State, data: Duration) {
    state.durationRow = data;
  },
  [types.SET_UTC](state: State, data: number) {
    state.utc = data;
  },
  [types.SET_EVENTS](state: State, data: any[]) {
    state.eventStack = data;
  },
  [types.SET_CHARTS](state: State, data: any[]) {
    state.chartStack.push(data);
  },
  [types.RUN_EVENTS](state: State) {
    clearTimeout(timer);
    timer = setTimeout(() => state.eventStack.forEach((event: any) => { setTimeout(event(), 0); }), 500);
  },
  [types.SET_EDIT](state: State, status: boolean) {
    state.edit = status;
  },
};

// actions
const actions: ActionTree<State, any> = {
  SET_DURATION(context: { commit: Commit }, data: Duration) {
    context.commit(types.SET_DURATION, data);
    context.commit(types.RUN_EVENTS);
  },
  RUN_EVENTS(context: { commit: Commit }) {
    if (w.axiosCancel.length !== 0) {
      for (const event of w.axiosCancel) { setTimeout(event(), 0); }
      w.axiosCancel = [];
    }
    context.commit(types.RUN_EVENTS);
  },
  SET_CHARTS(context: { commit: Commit }, data: any[]) {
    context.commit(types.SET_CHARTS, data);
  },
  CLEAR_CHARTS(context: { commit: Commit }) {
    context.commit(types.SET_CHARTS, []);
  },
  SET_EDIT(context: { commit: Commit }, status: boolean) {
    context.commit(types.SET_EDIT, status);
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
