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

import { MutationTree } from 'vuex';
import { CompsTree } from '@/types/dashboard';
import * as types from './mutation-types';
export interface State {
  current: number;
  group: number;
  index: number;
  tree: CompsTree[];
  templates: CompsTree[];
}

export const initState: State = {
  current: 0,
  group: 0,
  index: 0,
  tree: [
    {
      name: '',
      serviceGroup: '',
      type: 'service',
      query: {
        service: {},
        endpoint: {},
        instance: {},
        database: {},
      },
      children: [],
    },
  ],
  templates: [],
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_COMPS_TREE](state: State, data: CompsTree[]) {
    state.tree = data;
  },
  [types.IMPORT_TREE](state: State, data: CompsTree[]) {
    state.tree.push(...data);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.SET_GROUP_QUERY](state: State, params: any) {
    state.tree[state.group].query = params;
  },
  [types.SET_CURRENT_COMPS](state: State, current: number) {
    state.current = current;
  },
  [types.SET_CURRENT_INDEX](state: State, index: number) {
    state.index = index;
  },
  [types.SET_CURRENT_GROUP](state: State, current: number) {
    state.group = current;
    state.current = 0;
  },
  [types.SET_CURRENT_SERVICE_GROUP](state: State, serviceGroup: string) {
    state.tree.splice(state.group, 1, Object.assign(state.tree[state.group], { serviceGroup }));
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.SET_CURRENT_GROUP_WITH_CURRENT](state: State, { index, current = 0 }: { index: number; current: number }) {
    state.group = index;
    state.current = current;
  },
  [types.ADD_COMPS_GROUP](state: State, params: { type: string; name: string; templateName: string }) {
    if (!params.name) {
      return;
    }
    const template = state.templates.filter((item) => item.name === params.templateName && params.type === item.type);
    let group = { name: params.name, type: params.type, query: {}, children: [{ name: 'demo', children: [] }] };

    if (template.length) {
      group = { ...group, children: template[0].children };
    }
    state.tree.push(group);

    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.ADD_COMPS_TREE](state: State, params: { name: string }) {
    if (!params.name) {
      return;
    }
    state.tree[state.group].children.push({ name: params.name, children: [] });
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.IMPORT_COMPS_TREE](state: State, params: any) {
    state.tree[state.group].children.push(params);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.DELETE_COMPS_GROUP](state: State, index: number) {
    state.tree.splice(index, 1);
    if (!state.tree[state.group]) {
      state.group--;
    }
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.DELETE_COMPS_TREE](state: State, index: number) {
    state.tree[state.group].children.splice(index, 1);
    if (!state.tree[state.group].children[state.current]) {
      state.current--;
    }
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.ADD_COMP](state: State) {
    const comp = {
      width: 3,
      title: 'Title',
      height: 350,
      entityType: 'Service',
      independentSelector: true,
      metricType: 'UNKNOWN',
    };
    state.tree[state.group].children[state.current].children.push(comp);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.DELETE_COMP](state: State, index: number) {
    state.tree[state.group].children[state.current].children.splice(index, 1);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.EDIT_COMP_CONFIG](state: State, params: { values: any; index: number }) {
    const temp = state.tree[state.group].children[state.current].children[params.index];

    state.tree[state.group].children[state.current].children[params.index] = { ...temp, ...params.values };
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.SET_TEMPLATES](state: State, templates) {
    state.templates = templates;
  },
};

export default {
  state: initState,
  mutations,
};
