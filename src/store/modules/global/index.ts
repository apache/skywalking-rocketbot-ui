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
import { Duration, DurationTime } from '@/types/global';
import * as types from '@/store/mutation-types';
import Vue from 'vue';

let timer: any = null;

const dateFormate = (date: Date, step: string): string => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) { month = `0${monthTemp}`; }
  if (step === 'MONTH') { return `${year}-${month}`; }
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
  return '';
};
const dateFormateTime = (date: Date, step: string): string => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) { month = `0${monthTemp}`; }
  if (step === 'MONTH') { return `${year}-${month}`; }
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
  return '';
};

let utc = window.localStorage.getItem('utc');
if (!utc) {
  utc = (-(new Date().getTimezoneOffset() / 60)).toString();
  window.localStorage.setItem('utc', utc);
}

export interface State {
  durationRow: Duration;
  eventStack: any;
  chartStack: any;
  edit: boolean;
  lock: boolean;
  utc: string | number;
  eventHub: any;
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
  lock: true,
  utc: window.localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60),
  eventHub: new Vue(),
};

// getters
const getters = {
  globalEventHub(state: State): any {
    return state.eventHub;
  },
  duration(state: State): Duration {
    return {
      start: getLocalTime(parseInt(state.utc + '', 10), state.durationRow.start),
      end: getLocalTime(parseInt(state.utc + '', 10), state.durationRow.end),
      step: state.durationRow.step,
    };
  },
  intervalTime(state: State, getter: any): string[] {
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
    const timeIntervals: string[] = [];
    for (let i = 0; i <= endUnix - startUnix; i += interval) {
      const temp: string = dateFormateTime(new Date(startUnix + i - utcSpace), getter.duration.step);
      timeIntervals.push(temp);
    }
    return timeIntervals;
  },
  durationTime(_: State, getter: any): DurationTime {
    return {
      start: dateFormate(getter.duration.start, getter.duration.step),
      end: dateFormate(getter.duration.end, getter.duration.step),
      step: getter.duration.step,
    };
  },
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_DURATION](state: State, data: Duration): void {
    state.durationRow = data;
  },
  [types.SET_UTC](state: State, data: number): void {
    state.utc = data;
  },
  [types.SET_EVENTS](state: State, data: any[]): void {
    state.eventStack = data;
  },
  [types.SET_CHARTS](state: State, data: any[]): void {
    state.chartStack.push(data);
  },
  [types.RUN_EVENTS](state: State): void {
    clearTimeout(timer);
    timer = setTimeout(() => state.eventStack.forEach((event: any) => { setTimeout(event(), 0); }), 500);
  },
  [types.SET_EDIT](state: State, status: boolean): void {
    state.edit = status;
  },
};

// actions
const actions: ActionTree<State, any> = {
  SET_DURATION(context: { commit: Commit }, data: Duration): void {
    context.commit(types.SET_DURATION, data);
    context.commit(types.RUN_EVENTS);
  },
  RUN_EVENTS(context: { commit: Commit }): void {
    if (window.axiosCancel.length !== 0) {
      for (const event of window.axiosCancel) { setTimeout(event(), 0); }
      window.axiosCancel = [];
    }
    context.commit(types.RUN_EVENTS);
  },
  SET_CHARTS(context: { commit: Commit }, data: any[]): void {
    context.commit(types.SET_CHARTS, data);
  },
  CLEAR_CHARTS(context: { commit: Commit }): void {
    context.commit(types.SET_CHARTS, []);
  },
  SET_EDIT(context: { commit: Commit }, status: boolean): void {
    context.commit(types.SET_EDIT, status);
  },
  SET_LOCK(context: { commit: Commit }, status: boolean): void {
    context.commit(types.SET_LOCK, status);
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
