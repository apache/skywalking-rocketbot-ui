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
import axios, {AxiosPromise, AxiosResponse} from 'axios';

import graph from '@/graph';
import {cancelToken} from '@/utils/cancelToken';
import * as types from '../../mutation-types';
import { DurationTime } from '@/types/global';
import { queryChartData } from '@/utils/queryChartData';
import fragmentAll from '@/store/modules/dashboard/fragments';
import { ICurrentOptions, DataSourceType } from '@/types/comparison';
import { ComparisonOption, InitSource } from './comparison-const';

interface Option {
  key: number;
  label: string;
}

export interface State {
  currentOptions: ICurrentOptions;
  // dataSource: DataSourceType;
}

interface ActionsParamType {
  duration: DurationTime;
}

const initState: State = {
  currentOptions: ComparisonOption,
  // dataSource: InitSource,
};

// getters
const getters = {
  Graphqls(state: State, source: any) {
    const { currentOptions } = state;
    const type = currentOptions.preType.key;
    const metric = currentOptions.preMetrics.key;
    const item = queryChartData.service.filter((
      opt: {o: string; c: string; d: string},
    ) => opt.d === metric && opt.o === type && opt.c === 'ChartLine')[0] || {};
    const param = (fragmentAll as any)[item.d];
    return `query queryData(${param.variable.join(',')}) {${param.fragment}}`;
  },
};

// mutations
const mutations = {
  ['UPDATESOURCE'](state: State, data: State) {
    state.currentOptions = data.currentOptions;
  },
};

// actions
const actions: ActionTree<State, ActionsParamType> = {
  GET_COMPARISON(context: { commit: Commit, dispatch: Dispatch, getters: any }, variablesData: any) {
    return axios.post('/graphql', {
      query: context.getters.Graphqls,
      variables: variablesData,
    }, {cancelToken: cancelToken()}).then((res: AxiosResponse<any>) => {
        return res.data.data;
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
