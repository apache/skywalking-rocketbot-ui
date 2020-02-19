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

import { Commit, ActionTree, Dispatch } from 'vuex';
import axios, { AxiosResponse } from 'axios';

import graph from '@/graph';
import { cancelToken } from '@/utils/cancelToken';
import * as types from '../../mutation-types';
import { DurationTime } from '@/types/global';
import { queryChartData } from '@/utils/queryChartData';
import fragmentAll from '@/graph/query/comparison';
import { IOption, ITaskOptions, TaskSourceType } from '@/types/profile';
import { InitTaskField, InitTaskFieldSource, ChangeTaskOpt } from './profile-constant';

export interface State {
  headerSource: {
    serviceSource: IOption[];
    currentService: IOption;
  };
  newTaskFields: ITaskOptions;
  taskFieldSource: TaskSourceType;
}
const initState: State = {
  headerSource: {
    serviceSource: [{ key: '', label: 'None' }],
    currentService: { key: '', label: 'None' },
  },
  newTaskFields: InitTaskField,
  taskFieldSource: InitTaskFieldSource,
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
    state.headerSource.serviceSource = data;
    state.headerSource.currentService = data[0];
    state.taskFieldSource.serviceSource = data;
    state.newTaskFields.service = data[0];
  },
  [types.SET_TASK_OPTIONS](state: State, data: any) {
    state.newTaskFields = {
      ...state.newTaskFields,
      [data.type]: data.item,
    };
  },
};

// actions
const actions = {
  GET_SERVICES(
    context: { commit: Commit },
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
