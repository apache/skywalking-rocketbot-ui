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

interface Option {
  key: string;
  label: string;
}

export interface State {
  services: Option[];
}

const initState: State = {
  services: [],
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_SERVICES](state: State, data: Option[]): void {
    state.services = data;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit }, params: any): Promise<void> {
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
