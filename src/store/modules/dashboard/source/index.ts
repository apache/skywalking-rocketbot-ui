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

import { Commit, ActionTree, MutationTree, Dispatch, Getter } from 'vuex';
import {initState as globalPercent, SetGlobalPercent} from './globalPercent';
import { AxiosResponse } from 'axios';

export interface State {
  globalPercent: {
    p50: number[],
    p75: number[],
    p90: number[],
    p95: number[],
    p99: number[],
  };
}

const initState: State = {
  ...globalPercent,
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  COOK_SOURCE(state: State, params: any) {
    SetGlobalPercent(state, params);
  },
};

// actions
const actions: ActionTree<State, any> = {
  COOK_SOURCE(context: { commit: Commit }, params: any) {
    context.commit('COOK_SOURCE', params.data);
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
