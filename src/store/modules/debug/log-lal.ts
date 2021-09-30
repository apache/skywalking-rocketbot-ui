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

import { Commit, ActionTree, MutationTree } from 'vuex';
import * as types from '@/store/mutation-types';
import { LogTestOptions, LogTestMetrics } from '@/types/debug';
import graph from '@/graph';
import { AxiosResponse } from 'axios';
import { DurationTime, Option } from '@/types/global';

export interface State {
  logTestFields: LogTestOptions | any;
  services: Option[];
  instances: Option[];
  endpoints: Option[];
  selectedService: Option;
  selectedEndpoint: Option;
  selectedInstance: Option;
  dsl: string;
  logTestResp: { log: { content: string }; metrics: LogTestMetrics[] };
  tabType: string;
}

const logAnaState: State = {
  logTestFields: {},
  services: [],
  selectedService: { key: '', label: '' },
  instances: [],
  selectedInstance: { key: '', label: '' },
  endpoints: [],
  selectedEndpoint: { key: '', label: '' },
  dsl: '',
  logTestResp: { log: { content: '' }, metrics: [] },
  tabType: '',
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_LOG_TEST_FIELDS](state, item: Option) {
    state.logTestFields = {
      ...state.logTestFields,
      [item.label]: item.key,
    };
  },
  [types.SET_LOG_ANA_SERVICES](state, items: Option[]) {
    state.services = items;
    state.selectedService = items[0] || state.selectedService;
    state.logTestFields.service = state.selectedService.label || undefined;
  },
  [types.SET_LOG_ANA_ENDPOINTS](state, items: Option[]) {
    state.endpoints = [{ key: '', label: 'None' }, ...items];
    state.selectedEndpoint = state.endpoints[0];
    state.logTestFields.endpoint = state.selectedEndpoint.key ? state.selectedEndpoint.label : undefined;
  },
  [types.SET_LOG_ANA_INSTANCES](state, items: Option[]) {
    state.instances = [{ key: '', label: 'None' }, ...items];
    state.selectedInstance = state.instances[0];
    state.logTestFields.serviceInstance = state.selectedInstance.key ? state.selectedInstance.label : undefined;
  },
  [types.SET_SELECTED_SERVICE](state, item: Option) {
    state.selectedService = item;
  },
  [types.SET_SELECTED_ENDPOINT](state, item: Option) {
    state.selectedEndpoint = item;
  },
  [types.SET_SELECTED_INSTANCE](state, item: Option) {
    state.selectedInstance = item;
  },
  [types.SET_DSL](state, content: string) {
    state.dsl = content;
  },
  [types.SET_LOG_TEST_RESPONSE](state, resp: { log: { content: string }; metrics: LogTestMetrics[] }) {
    state.logTestResp = resp;
  },
  [types.SET_TAB_TYPE](state, type: string) {
    state.tabType = type;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_LOG_ANA_SERVICES(context: { commit: Commit }, params: { duration: DurationTime; keyword: string }) {
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_LOG_ANA_SERVICES, res.data.data.services);
      });
  },
  GET_LOG_ANA_ENDPOINTS(
    context: { commit: Commit; state: State },
    params: { keyword: string; currentService?: { key: string; label: string } },
  ) {
    if (!context.state.selectedService.key) {
      context.commit(types.SET_LOG_ANA_ENDPOINTS, []);
      return;
    }
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryEndpoints')
      .params({
        serviceId: context.state.selectedService.key || '',
        ...params,
      })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_LOG_ANA_ENDPOINTS, res.data.data.getEndpoints);
      });
  },
  GET_LOG_ANA_INSTANCES(context: { commit: Commit; state: State }, params: any) {
    if (!context.state.selectedService.key) {
      context.commit(types.SET_LOG_ANA_INSTANCES, []);
      return;
    }
    return graph
      .query('queryInstances')
      .params({ serviceId: context.state.selectedService.key || '', ...params })
      .then((res: AxiosResponse) => {
        context.commit(types.SET_LOG_ANA_INSTANCES, res.data.data.getServiceInstances);
      });
  },
  LOG_ANA_QUERY(context: { commit: Commit; state: State }) {
    const requests = {
      dsl: context.state.dsl,
      log: JSON.stringify(context.state.logTestFields),
    };
    const params = { requests };

    return graph
      .query('queryLogTest')
      .params(params)
      .then((res: AxiosResponse) => {
        if (res.data.errors) {
          context.commit(types.SET_LOG_TEST_RESPONSE, { log: {}, metrics: [] });
          return res.data.errors;
        }
        context.commit(types.SET_LOG_TEST_RESPONSE, res.data.data.test);
      });
  },
};

export default {
  state: logAnaState,
  actions,
  mutations,
};
