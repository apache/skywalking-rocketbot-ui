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

import { Commit, Dispatch } from 'vuex';
import axios, { AxiosResponse } from 'axios';

import graph from '@/graph';
import { cancelToken } from '@/utils/cancelToken';
import * as types from '../../mutation-types';
import { DurationTime } from '@/types/global';
import { IOption, ITaskOptions, TaskSourceType, TaskListSourceType, TracesSourceType } from '@/types/profile';
import { InitTaskField, InitTaskFieldSource, ChangeTaskOpt } from './profile-constant';

export interface State {
  headerSource: {
    serviceSource: IOption[];
    currentService: IOption;
  };
  newTaskFields: ITaskOptions;
  taskFieldSource: TaskSourceType;
  taskListSource: TaskListSourceType[];
  segmentSpans: any[];
  currentSegment: any;
  segmentList: TracesSourceType[];
}
const initState: State = {
  headerSource: {
    serviceSource: [{ key: '', label: 'None' }],
    currentService: { key: '', label: 'None' },
  },
  newTaskFields: InitTaskField,
  taskFieldSource: InitTaskFieldSource,
  taskListSource: [],
  segmentSpans: [],
  currentSegment: {
    operationNames: [],
    duration: 0,
    isError: false,
    key: '',
    start: '',
    traceIds: [],
  },
  segmentList: [],
};
// getters
const getters = {
  updateTaskOpt() {
    return ChangeTaskOpt;
  },
};

// mutations
const mutations = {
  [types.SET_SERVICES](state: State, data: any[]) {
    state.headerSource.serviceSource = [{ key: 'all', label: 'All' }, ...data];
    state.headerSource.currentService = state.headerSource.serviceSource[0];
    state.taskFieldSource.serviceSource = data;
    state.newTaskFields.service = data[0];
  },
  [types.SET_TASK_OPTIONS](state: State, data: any) {
    const param = ['minThreshold', 'endpointName'];
    state.newTaskFields = {
      ...state.newTaskFields,
      [data.type]: param.includes(data.type) ? data.item.key : data.item,
    };
  },
  [types.SET_TASK_LIST](state: State, data: any) {
    state.taskListSource = data;
  },
  [types.SET_SEGMENT_SPANS](state: State, data: any[]): void {
    state.segmentSpans = data;
  },
  [types.SET_SEGMENT_LIST](state: State, data: any[]) {
    state.segmentList = data;
  },
  [types.SET_CURRENT_SEGMENT](state: State, data: any) {
    state.currentSegment = data;
  },
  [types.SET_HEADER_SOURCE](state: State, data: any) {
    // state.headerSource = {
    //   ...state.headerSource,
    //   [data.label]
    // };
  },
};

// actions
const actions = {
  GET_SERVICES(
    context: { commit: Commit; dispatch: Dispatch },
    params: {
      duration: string;
    },
  ) {
    graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit(types.SET_SERVICES, res.data.data.services);
        context.dispatch('GET_TASK_LIST', params);
      });
  },
  GET_TASK_LIST(context: { state: State; dispatch: Dispatch; commit: Commit }) {
    graph
      .query('getProfileTaskList')
      .params({})
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit(types.SET_TASK_LIST, res.data.data.getProfileTaskList);
        return res.data.data.getProfileTaskList;
      })
      .then((data: any) => {
        if (!data) {
          return;
        }
        context.dispatch('GET_SEGMENT_LIST', { taskID: data[0].id });
      });
  },
  GET_SEGMENT_SPANS(context: { state: State; commit: Commit }, params: { segmentId: string }) {
    graph
      .query('queryProfileSegment')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data.data.getProfiledSegment) {
          return;
        }
        context.commit(types.SET_SEGMENT_SPANS, res.data.data.getProfiledSegment.spans);
      });
  },
  GET_SEGMENT_LIST(context: { commit: Commit; dispatch: Dispatch }, params: { taskID: string }) {
    graph
      .query('getProfileTaskSegmentList')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data.data.getProfileTaskSegmentList) {
          return;
        }
        const { getProfileTaskSegmentList } = res.data.data;

        context.commit(types.SET_SEGMENT_LIST, getProfileTaskSegmentList);
        context.commit(types.SET_CURRENT_SEGMENT, getProfileTaskSegmentList[0]);
        context.dispatch('GET_SEGMENT_SPANS', { segmentId: getProfileTaskSegmentList[0].segmentId });
      });
  },
  CREATE_PROFILE_TASK(context: { commit: Commit; state: State; dispatch: Dispatch }) {
    const {
      service,
      endpointName,
      minThreshold,
      monitorDuration,
      dumpPeriod,
      maxSamplingCount,
    } = context.state.newTaskFields;
    const creationRequest = {
      serviceId: service.key,
      endpointName,
      startTime: new Date().getTime(),
      duration: monitorDuration.key,
      minDurationThreshold: Number(minThreshold),
      dumpPeriod: dumpPeriod.key,
      maxSamplingCount: maxSamplingCount.key,
    };

    graph
      .query('saveProfileTask')
      .params({ creationRequest })
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.dispatch('GET_TASK_LIST', {});
      });
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
