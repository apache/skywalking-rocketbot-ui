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
import { CompsItem, CompsTree } from '@/types/dashboard';
import globalTemp from '../template/global-template';
import serviceTemp from '../template/service-template';
import endpointTemp from '../template/endpoint-template';
import instanceTemp from '../template/instance-template';
import databaseTemp from '../template/database-template';
import groupServiceTemp from '../template/group-service-template';
import groupDatabaseTemp from '../template/group-database-template';
import * as types from '../mutation-types';

export interface State {
  current: number;
  group: number;
  index: number;
  tree: CompsTree[];
}

const initState: State = {
  current: 0,
  group: 0,
  index: 0,
  tree: [{
    name: 'Service Dashboard',
    type: 'service',
    query:  {
      service: {},
      endpoint: {},
      instance: {},
    },
    children: groupServiceTemp,
  }],
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_COMPS_TREE](state: State, data: CompsTree[]) {
    state.tree = data;
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
  [types.ADD_COMPS_GROUP](state: State, params: any) {
    if (!params.name) {return; }
    switch (params.template) {
      case 'nouse':
        state.tree.push({name: params.name, type: params.type, query: {}, children: [
          {name: 'demo', children: []},
        ]});
        break;
      case 'groupService':
        state.tree.push({name: params.name, type: params.type, query: {}, children: groupServiceTemp});
        break;
      case 'groupDatabase':
        state.tree.push({name: params.name, type: params.type, query: {}, children: groupDatabaseTemp});
        break;
    }
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.ADD_COMPS_TREE](state: State, params: any) {
    if (!params.name) {return; }
    switch (params.template) {
      case 'nouse':
        state.tree[state.group].children.push({name: params.name, children: []});
        break;
      case 'global':
        state.tree[state.group].children.push({name: params.name, children: globalTemp});
        break;
      case 'service':
        state.tree[state.group].children.push({name: params.name, children: serviceTemp});
        break;
      case 'endpoint':
        state.tree[state.group].children.push({name: params.name, children: endpointTemp});
        break;
      case 'instance':
        state.tree[state.group].children.push({name: params.name, children: instanceTemp});
        break;
      case 'database':
        state.tree[state.group].children.push({name: params.name, children: databaseTemp});
        break;
    }
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.DELETE_COMPS_GROUP](state: State, index: number) {
    state.tree.splice(index, 1);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.DELETE_COMPS_TREE](state: State, index: number) {
    state.tree[state.group].children.splice(index, 1);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.ADD_COMP](state: State, comp: CompsItem) {
    state.tree[state.group].children[state.current].children.push(comp);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.DELETE_COMP](state: State, index: number) {
    state.tree[state.group].children[state.current].children.splice(index, 1);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.EDIT_COMP](state: State, params: any) {
    const temp: any = state.tree[state.group].children[state.current].children[params.index];
    temp[params.type] = params.value;
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.SWICH_COMP](state: State, params: any) {
    const tempStart: any =
    state.tree[state.group].children[state.current].children[params.start];
    state.tree[state.group].children[state.current].children[params.start] =
    state.tree[state.group].children[state.current].children[params.end];
    state.tree[state.group].children[state.current].children[params.end] = tempStart;
    state.tree = {...state.tree};
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
};


export default {
  state: initState,
  mutations,
};
