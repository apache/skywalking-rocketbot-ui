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

import { Commit, ActionTree } from 'vuex';
import Axios, { AxiosPromise, AxiosResponse } from 'axios';
import graph from '@/graph';
import * as types from '../../mutation-types';
import { DurationTime } from '@/types/global';
import { ICurrentOptions, DataSourceType, IOption } from '@/types/comparison';
import { ComparisonOption, InitSource } from './comparison-const';

interface Option {
  key: number;
  label: string;
}

export interface State {
  currentOptions: ICurrentOptions;
  dataSource: DataSourceType;
}

interface ActionsParamType {
  duration: DurationTime;
}

const initState: State = {
  currentOptions: ComparisonOption,
  dataSource: InitSource,
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_SERVICES](state: State, data: Option[]): void {
    state.dataSource.preServiceSource = data;
    state.dataSource.nextServiceSource = data;
    state.currentOptions.preService = data[0];
    state.currentOptions.nextService = data[0];
  },
};

// actions
const actions: ActionTree<State, ActionsParamType> = {
  GET_SERVICES(context: { commit: Commit }, params: {duration: DurationTime}): Promise<void> {
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
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
