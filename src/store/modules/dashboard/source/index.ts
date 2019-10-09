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
import {initState as global, SetGlobal} from './global';
import {initState as service, SetService} from './service';
import {initState as endpoint, SetEndpoint} from './endpoint';
import {initState as instance, SetInstance} from './instance';
import {initState as database, SetDatabase} from './database';
import { SlowItem } from '@/types/global';
export interface State {
  globalBrief: {
    numOfCache: number;
    numOfDatabase: number;
    numOfEndpoint: number;
    numOfMQ: number;
    numOfService: number;
  };
  globalPercent: {
    p50: number[],
    p75: number[],
    p90: number[],
    p95: number[],
    p99: number[],
  };
  globalHeatmap: number[][];
  globalSlow: SlowItem[];
  globalThroughput: SlowItem[];
  serviceResponseTime: { ResponseTime: number[]; };
  serviceInstanceThroughput: SlowItem[];
  serviceSLA: { SLA: number[]; };
  servicePercent: {
    p50: number[],
    p75: number[],
    p90: number[],
    p95: number[],
    p99: number[],
  };
  serviceSlowEndpoint: SlowItem[];
  serviceThroughput: { Throughput: number[]; };

  endpointPercent: {
    p50: number[],
    p75: number[],
    p90: number[],
    p95: number[],
    p99: number[],
  };
  endpointResponseTime: { ResponseTime: number[]; };
  endpointThroughput: { Throughput: number[]; };
  endpointSLA: { SLA: number[]; };
  endpointSlowEndpoint: SlowItem[];
  endpointTraces: SlowItem[];
  instanceResponseTime: { ResponseTime: number[]; };
  instanceSLA: { SLA: number[]; };
  instanceThroughput: { Throughput: number[]; };
  instanceCPU: { cpu: number[]; };
  instanceGC: { oldGC: number[], youngGC: number[] };
  instanceGCCount: { oldGC: number[], youngGC: number[] };
  instanceHeap: { Value: number[], Free: number[], Hint: string };
  instanceNonheap: { Value: number[], Free: number[], Hint: string };
  instanceClrHeap: { Value: number[] };
  instanceClrCPU: { cpu: number[]; };
  instanceClrGC: { clrGCGen0: number[], clrGCGen1: number[], clrGCGen2: number[]};
  endpointTopology: { calls: any; nodes: any; };
  databaseResponseTime: { ResponseTime: number[]; };
  databaseSLA: { SLA: number[]; };
  databasePercent: {
    p50: number[],
    p75: number[],
    p90: number[],
    p95: number[],
    p99: number[],
  };
  databaseTopNRecords: SlowItem[];
  databaseThroughput: { Throughput: number[]; };
}

const initState: State = {
  ...global,
  ...service,
  ...endpoint,
  ...instance,
  ...database,
};

// getters
const getters = {
};

// mutations
const mutations: MutationTree<State> = {
  COOK_SOURCE(state: State, params: any) {
    SetGlobal(state, params);
    SetService(state, params);
    SetEndpoint(state, params);
    SetInstance(state, params);
    SetDatabase(state, params);
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
