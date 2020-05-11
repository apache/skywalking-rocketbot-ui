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
// import globalTemp from '../template/global-template';
// import serviceTemp from '../template/service-template';
// import endpointTemp from '../template/endpoint-template';
// import instanceTemp from '../template/instance-template';
// import databaseTemp from '../template/database-template';
import groupServiceTemp from '../template/group-service-template';
import groupDatabaseTemp from '../template/group-database-template';
import * as types from '../mutation-types';

export interface State {
  current: number;
  group: number;
  index: number;
  tree: CompsTree[];
}

export const initState: State = {
  current: 0,
  group: 0,
  index: 0,
  tree: [
    {
      name: 'Service Dashboard',
      type: 'service',
      query: {
        service: {},
        endpoint: {},
        instance: {},
        database: {},
      },
      children: groupServiceTemp,
    },
    {
      name: 'Database Dashboard',
      type: 'database',
      query: {
        service: {},
        endpoint: {},
        instance: {},
        database: {},
      },
      children: groupDatabaseTemp,
    },
  ],
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
  [types.SET_CURRENT_GROUP_WITH_CURRENT](state: State, { index, current = 0 }: { index: number; current: number }) {
    state.group = index;
    state.current = current;
  },
  [types.ADD_COMPS_GROUP](state: State, params: any) {
    if (!params.name) {
      return;
    }
    switch (params.template) {
      case 'nouse':
        const newTree = [];
        Object.keys(state.tree).forEach((i: any) => {
          newTree.push(state.tree[i]);
        });
        newTree.push({ name: params.name, type: params.type, query: {}, children: [{ name: 'demo', children: [] }] });
        state.tree = newTree;
        break;
      case 'groupService':
        const newServerTree = [];
        Object.keys(state.tree).forEach((i: any) => {
          newServerTree.push(state.tree[i]);
        });
        newServerTree.push({ name: params.name, type: params.type, query: {}, children: groupServiceTemp });
        state.tree = newServerTree;
        break;
      case 'groupDatabase':
        const newDatabaseTree = [];
        Object.keys(state.tree).forEach((i: any) => {
          newDatabaseTree.push(state.tree[i]);
        });
        newDatabaseTree.push({ name: params.name, type: params.type, query: {}, children: groupDatabaseTemp });
        state.tree = newDatabaseTree;
        break;
    }
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.ADD_COMPS_TREE](state: State, params: { name: string }) {
    if (!params.name) {
      return;
    }
    state.tree[state.group].children.push({ name: params.name, children: [] });
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
  [types.ADD_COMP](
    state: State,
    param: { type: string; currentService: string } = { type: 'service', currentService: '' },
  ) {
    const comp =
      param.type === 'database'
        ? {
            c: 'ChartLine',
            w: 6,
            d: 'databaseThroughput',
            t: 'Database Throughput',
            h: 350,
            version: '1.0',
            currentService: param.currentService,
            entityType: 'Service',
            independentSelector: true,
            currentMetric: '',
          }
        : {
            c: 'ChartTrace',
            w: 6,
            d: 'globalThroughput',
            t: 'Global Top Throughput',
            h: 350,
            version: '1.0',
            currentService: param.currentService,
            entityType: 'Service',
            independentSelector: true,
            currentMetric: '',
          };
    state.tree[state.group].children[state.current].children.push(comp);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.DELETE_COMP](state: State, index: number) {
    state.tree[state.group].children[state.current].children.splice(index, 1);
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.EDIT_COMP_CONFIG](state: State, params: any) {
    const temp: any = state.tree[state.group].children[state.current].children[params.index];

    temp[params.type] = params.value;
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
  [types.SWICH_COMP](state: State, params: any) {
    const tempStart: any = state.tree[state.group].children[state.current].children[params.start];
    state.tree[state.group].children[state.current].children[params.start] =
      state.tree[state.group].children[state.current].children[params.end];
    state.tree[state.group].children[state.current].children[params.end] = tempStart;
    state.tree = { ...state.tree };
    window.localStorage.setItem('dashboard', JSON.stringify(state.tree));
  },
};

export default {
  state: initState,
  mutations,
};
