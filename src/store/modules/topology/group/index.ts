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

import { ActionTree, MutationTree } from 'vuex';
import { genID } from '@/utils/genID';
import * as types from './mutation-types';

export interface Group {
  id: string;
  name: string;
  services: Array<{key: string, label: string}>;
}
export interface State {
  groupId: string;
  groups: Group[];
}

const initState: State = {
  groupId: 'all',
  groups: [],
};

// getters
const getters = {
  services(state: State) {
    if (!state.groups.length) {
      return [];
    }
    if (state.groupId === 'all') {
      return [];
    }
    const index = state.groups.findIndex((i: Group) => i.id === state.groupId);
    return state.groups[index].services;
  },
};

// mutations
const mutations: MutationTree<State> = {
  [types.INIT_GROUPS](state: State): void {
    const storage = localStorage.getItem('topology-groups');
    if (storage) {
      state.groups = JSON.parse(storage);
    } else {
      state.groups = [];
    }
  },
  [types.SAVE_GROUPS](state: State): void {
    localStorage.setItem('topology-groups', JSON.stringify(state.groups));
  },
  [types.CREATE_GROUP](state: State, name: string): void {
    state.groups.push({
      id: `${genID(5)}`,
      name,
      services: [],
    });
    localStorage.setItem('topology-groups', JSON.stringify(state.groups));
  },
  [types.DELETE_GROUP](state: State, id: string): void {
    const index = state.groups.findIndex((i: Group) => i.id === id);
    if (index === -1) {
      return;
    }
    state.groups.splice(index, 1);
    state.groupId = 'all';
    localStorage.setItem('topology-groups', JSON.stringify(state.groups));
  },
  [types.SELECT_GROUP](state: State, id: string): void {
    state.groupId = id;
    localStorage.setItem('topology-group-history', id);
  },
  [types.UNSELECT_GROUP](state: State): void {
    state.groupId = 'all';
    localStorage.removeItem('topology-group-history');
  },
  [types.ADD_GROUP_SERVICE](state: State, data: { id: string; service: {label: string, key: string} }): void {
    const groupIndex = state.groups.findIndex((i: Group) => i.id === data.id);
    if (groupIndex === -1) {
      return;
    }
    const services = state.groups[groupIndex].services;
    const index = services.findIndex((i) => i.label === data.service.label);
    if (index === -1) {
      services.push(data.service);
    }
    localStorage.setItem('topology-groups', JSON.stringify(state.groups));
  },
  [types.DELETE_GROUP_SERVICE](state: State, data: { id: string; service: {label: string, key: string} }): void {
    const groupIndex = state.groups.findIndex((i: Group) => i.id === data.id);
    if (groupIndex === -1) {
      return;
    }
    const services = state.groups[groupIndex].services;
    const index = services.findIndex((i) => i.label === data.service.label);
    if (index !== -1) {
      services.splice(index, 1);
    }
    localStorage.setItem('topology-groups', JSON.stringify(state.groups));
  },
};

// actions
const actions: ActionTree<State, any> = {};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
