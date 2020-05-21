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
import { AxiosResponse } from 'axios';

import graph from '@/graph';
import * as types from '../../mutation-types';
import {
  IOption,
  ITaskOptions,
  TaskSourceType,
  TaskListSourceType,
  TracesSourceType,
  IHeaderSource,
} from '@/types/profile';
import { InitTaskField, InitTaskFieldSource, ChangeTaskOpt } from './profile-constant';

export interface State {
  headerSource: IHeaderSource;
  newTaskFields: ITaskOptions;
  taskFieldSource: TaskSourceType;
  taskListSource: TaskListSourceType[];
  segmentSpans: any[];
  currentSegment: any;
  segmentList: TracesSourceType[];
  profileAnalyzation: any;
  highlightTop: boolean;
  currentSpan: any;
}
const initState: State = {
  headerSource: {
    serviceSource: [{ key: '', label: 'None' }],
    currentService: { key: '', label: 'None' },
    endpointName: '',
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
  profileAnalyzation: [],
  highlightTop: true,
  currentSpan: {},
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
    state.newTaskFields.service = data[0] || {};
  },
  [types.SET_TASK_OPTIONS](state: State, data: { type: string; item: IOption }) {
    const param = ['minThreshold', 'endpointName'];
    state.newTaskFields = {
      ...state.newTaskFields,
      [data.type]: param.includes(data.type) ? data.item.key : data.item,
    };
  },
  [types.SET_TASK_LIST](state: State, data: TaskListSourceType[]) {
    state.taskListSource = data;
  },
  [types.SET_SEGMENT_SPANS](state: State, data: any[]) {
    state.segmentSpans = data;
  },
  [types.SET_CURRENT_SPAN](state: State, data: any) {
    state.currentSpan = data;
  },
  [types.SET_SEGMENT_LIST](state: State, data: TracesSourceType[]) {
    state.segmentList = data;
  },
  [types.SET_CURRENT_SEGMENT](state: State, data: any) {
    state.currentSegment = data;
  },
  [types.SET_PROFILE_ANALYZATION](state: State, data: any[]) {
    state.profileAnalyzation = data;
  },
  [types.SET_HEADER_SOURCE](state: State, data: IHeaderSource) {
    state.headerSource = {
      ...state.headerSource,
      ...data,
    };
  },
  [types.SET_HIGHLIGHT_TOP](state: State) {
    state.highlightTop = !state.highlightTop;
  },
};

// actions
const actions = {
  GET_SERVICES(context: { commit: Commit; dispatch: Dispatch }, params: { duration: any; keyword: string }) {
    if (!params.keyword) {
      params.keyword = '';
    }
    graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        if (!res.data.data) {
          return;
        }
        context.commit(types.SET_SERVICES, res.data.data.services);
        context.dispatch('GET_TASK_LIST');
      });
  },
  GET_TASK_LIST(context: { state: State; dispatch: Dispatch; commit: Commit }) {
    const { headerSource } = context.state;
    const param = {
      serviceId: headerSource.currentService.key === 'all' ? '' : headerSource.currentService.key,
      endpointName: headerSource.endpointName,
    };

    graph
      .query('getProfileTaskList')
      .params(param)
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
        if (getProfileTaskSegmentList[0]) {
          context.commit(types.SET_CURRENT_SEGMENT, getProfileTaskSegmentList[0]);
          context.dispatch('GET_SEGMENT_SPANS', { segmentId: getProfileTaskSegmentList[0].segmentId });
        } else {
          context.commit(types.SET_CURRENT_SEGMENT, {
            traceIds: [],
          });
          context.commit(types.SET_SEGMENT_SPANS, []);
          context.commit(types.SET_PROFILE_ANALYZATION, []);
        }
      });
  },
  GET_SEGMENT_SPANS(context: { state: State; commit: Commit; dispatch: Dispatch }, params: { segmentId: string }) {
    graph
      .query('queryProfileSegment')
      .params(params)
      .then((res: AxiosResponse) => {
        const { getProfiledSegment } = res.data.data;
        if (!getProfiledSegment) {
          return;
        }
        context.commit(types.SET_SEGMENT_SPANS, getProfiledSegment.spans);
        if (!(getProfiledSegment.spans && getProfiledSegment.spans.length)) {
          return;
        }
        const index = getProfiledSegment.spans.length - 1 || 0;
        context.commit(types.SET_CURRENT_SPAN, getProfiledSegment.spans[index]);
      })
      .catch((error: any) => {
        throw error;
      });
  },
  GET_PROFILE_ANALYZE(
    context: { commit: Commit; state: State; dispatch: Dispatch },
    params: { segmentId: string; timeRanges: Array<{ start: number; end: number }> },
  ) {
    return graph
      .query('getProfileAnalyze')
      .params(params)
      .then((res: AxiosResponse) => {
        const { getProfileAnalyze, tip } = res.data.data;
        if (tip) {
          return tip;
        }
        if (!getProfileAnalyze) {
          context.commit(types.SET_PROFILE_ANALYZATION, []);
          return;
        }
        context.commit(types.SET_PROFILE_ANALYZATION, getProfileAnalyze.trees);
      });
  },
  CREATE_PROFILE_TASK(context: { commit: Commit; state: State; dispatch: Dispatch }, param: { startTime: number }) {
    const {
      service,
      endpointName,
      minThreshold,
      monitorDuration,
      dumpPeriod,
      maxSamplingCount,
      monitorTime,
    } = context.state.newTaskFields;
    const creationRequest = {
      serviceId: service.key,
      endpointName,
      startTime: monitorTime.key === '1' ? param.startTime : new Date().getTime(),
      duration: monitorDuration.key,
      minDurationThreshold: Number(minThreshold),
      dumpPeriod: dumpPeriod.key,
      maxSamplingCount: maxSamplingCount.key,
    };

    return graph
      .query('saveProfileTask')
      .params({ creationRequest })
      .then((res: AxiosResponse) => {
        if (res.data.data && res.data.data.createTask && res.data.data.createTask.errorReason) {
          return res.data.data.createTask;
        }
        context.dispatch('GET_TASK_LIST');
        return res.data.data.createTask;
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
