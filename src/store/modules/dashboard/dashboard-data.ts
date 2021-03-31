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

import { ActionTree, MutationTree, Commit, Dispatch } from 'vuex';
import { CompsTree, Event } from '@/types/dashboard';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import dashboardLayout from './dashboard-data-layout';
import dashboardQuery from './dashboard-data-query';
import { QueryEventCondition } from '../../../types/dashboard';
import { dateFormatTime } from '@/utils/dateFormat';
import { DurationTime, Option } from '@/types/global';
import * as types from './mutation-types';
import { PageEventsType } from '@/constants/constant';

const EntityType = ['Service', 'ServiceInstance', 'Endpoint'];
export interface State {
  current: number;
  group: number;
  tree: CompsTree[];
  serviceEvents: Event[];
  serviceInstanceEvents: Event[];
  endpointEvents: Event[];
  enableEvents: boolean;
  eventsPageType: string;
  currentSeriesType: Option[];
}

const initState: State = {
  serviceEvents: [],
  endpointEvents: [],
  serviceInstanceEvents: [],
  enableEvents: false,
  eventsPageType: PageEventsType.DASHBOARD_EVENTS,
  currentSeriesType: [],
  ...dashboardLayout.state,
};

// mutations
const mutations: MutationTree<any> = {
  ...dashboardLayout.mutations,
  [types.SET_DASHBOARD_EVENTS](state: State, param: { events: Event[]; type: string; duration: DurationTime }) {
    const events = param.events.map((d: Event, index: number) => {
      d.entityType = param.type;
      d.startTime = dateFormatTime(new Date(Number(d.startTime)), param.duration.step);
      d.endTime = dateFormatTime(new Date(Number(d.endTime)), param.duration.step);
      if (index > 2) {
        return d;
      }
      for (const item of state.currentSeriesType) {
        if (item.key === param.type) {
          d.checked = true;
        }
      }
      return d;
    });
    if (param.type === EntityType[0]) {
      state.serviceEvents = events;
    } else if (param.type === EntityType[1]) {
      state.serviceInstanceEvents = events;
    } else {
      state.endpointEvents = events;
    }
  },
  [types.SET_CHECKED_EVENTS](state: State, selectedEvents: Event[]) {
    for (const event of selectedEvents) {
      if (event.entityType === EntityType[0]) {
        for (const item of state.serviceEvents) {
          if (event.uuid === item.uuid && event.entityType === item.entityType) {
            item.checked = event.checked;
            break;
          }
        }
      }
      if (event.entityType === EntityType[1]) {
        for (const item of state.serviceInstanceEvents) {
          if (event.uuid === item.uuid && event.entityType === item.entityType) {
            item.checked = event.checked;
            break;
          }
        }
      }
      if (event.entityType === EntityType[2]) {
        for (const item of state.endpointEvents) {
          if (event.uuid === item.uuid && event.entityType === item.entityType) {
            item.checked = event.checked;
            break;
          }
        }
      }
    }
  },
  [types.SET_ENABLE_EVENTS](state: State, enable: boolean) {
    state.enableEvents = enable;
  },
  [types.SET_EVENTS_PAGE_TYPE](state: State, type: string) {
    state.eventsPageType = type;
  },
  [types.SET_CURRENT_SERIES_TYPE](state: State, data: { item: Option; index: number }) {
    if (data.index > -1) {
      state.currentSeriesType.splice(data.index, 1);
    } else {
      state.currentSeriesType.push(data.item);
    }
  },
  [types.SET_CLEAR_SELECTED_EVENTS](state: State) {
    for (const item of [...state.serviceEvents, ...state.serviceInstanceEvents, ...state.endpointEvents]) {
      item.checked = false;
    }
  },
};

// actions
const actions: ActionTree<State, any> = {
  ...dashboardQuery.actions,
  MIXHANDLE_CHANGE_GROUP(
    context: { commit: Commit; dispatch: Dispatch; state: State; rootState: any },
    index: number,
  ): void {
    const rocketOption = context.rootState.rocketOption;
    const temp: any = {};
    if (rocketOption.currentService) {
      temp.service = rocketOption.currentService;
    }
    if (rocketOption.currentEndpoint) {
      temp.endpoint = rocketOption.currentEndpoint;
    }
    if (rocketOption.currentInstance) {
      temp.instance = rocketOption.currentInstance;
    }
    if (rocketOption.currentDatabase) {
      temp.database = rocketOption.currentDatabase;
    }
    context.commit('SET_GROUP_QUERY', temp);
    context.commit('SET_CURRENT_GROUP', index);
    context.dispatch('RUN_EVENTS', {}, { root: true });
  },
  MIXHANDLE_CHANGE_GROUP_WITH_CURRENT(
    context: { commit: Commit; dispatch: Dispatch; state: State; rootState: any },
    { index, current = 0 }: { index: number; current: number },
  ): void {
    const { rocketOption } = context.rootState;
    const temp: any = {};
    if (rocketOption.currentService) {
      temp.service = rocketOption.currentService;
    }
    if (rocketOption.currentEndpoint) {
      temp.endpoint = rocketOption.currentEndpoint;
    }
    if (rocketOption.currentInstance) {
      temp.instance = rocketOption.currentInstance;
    }
    if (rocketOption.currentDatabase) {
      temp.database = rocketOption.currentDatabase;
    }
    context.commit('SET_GROUP_QUERY', temp);
    context.commit('SET_CURRENT_GROUP_WITH_CURRENT', { index, current });
    context.dispatch('RUN_EVENTS', {}, { root: true });
  },
  TYPE_METRICS(context, params: { name: string }) {
    const metricNames = (params.name || '').split(',').map((item: string) => item.replace(/^\s*|\s*$/g, ''));
    return Promise.all(
      metricNames.map((item: string) => {
        return graph
          .query('queryTypeOfMetrics')
          .params({ name: item })
          .then((res: AxiosResponse) => {
            return res.data.data;
          });
      }),
    );
  },
  GET_ALL_TEMPLATES(context) {
    return graph
      .query('queryGetAllTemplates')
      .params({})
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        return res.data.data.getAllTemplates || [];
      });
  },
  GET_EVENT(context: { commit: Commit }, params: { condition: QueryEventCondition; type: string }) {
    return graph
      .query('queryEvents')
      .params({ condition: params.condition })
      .then((res: AxiosResponse) => {
        if (!(res.data.data && res.data.data.fetchEvents)) {
          context.commit('SET_DASHBOARD_EVENTS', { events: [], type: params.type, duration: params.condition.time });
          return [];
        }
        context.commit('SET_DASHBOARD_EVENTS', {
          events: res.data.data.fetchEvents.events,
          type: params.type,
          duration: params.condition.time,
        });

        return res.data.data.fetchEvents.events || [];
      });
  },
};

export default {
  state: initState,
  actions,
  mutations,
};
