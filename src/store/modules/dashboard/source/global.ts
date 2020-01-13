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
import { Value } from '@/types/dashboard';
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
}

export const initState: State = {
  globalBrief: {
    numOfCache: 0,
    numOfDatabase: 0,
    numOfEndpoint: 0,
    numOfMQ: 0,
    numOfService: 0,
  },
  globalPercent: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
  },
  globalHeatmap: [],
  globalSlow: [],
  globalThroughput: [],
};


export const SetGlobal = (state: State, params: any) => {
  if (!params) {
    return;
  }
  if (params.globalBrief) {
    state.globalBrief.numOfCache = params.globalBrief.numOfCache || 0;
    state.globalBrief.numOfDatabase = params.globalBrief.numOfDatabase || 0;
    state.globalBrief.numOfEndpoint = params.globalBrief.numOfEndpoint || 0;
    state.globalBrief.numOfMQ = params.globalBrief.numOfMQ || 0;
    state.globalBrief.numOfService = params.globalBrief.numOfService || 0;

  }
  if (params.globalPercentile) {
    const PercentileItem = ['p50', 'p75', 'p90', 'p95', 'p99'];
    const globalPercent = {} as any;

    params.globalPercentile.forEach((item: any, index: number) => {
      if (item && item.values) {
        const key = PercentileItem[index] as string;
        globalPercent[key] = item.values.map((i: any) => i.value);
      }
    });
    state.globalPercent = globalPercent;
  }
  if (params.globalHeatmap) {
    state.globalHeatmap = params.globalHeatmap.nodes;
  }
  if (params.globalSlow) {
    state.globalSlow = params.globalSlow;
  }
  if (params.globalThroughput) {
    state.globalThroughput = params.globalThroughput;
  }
};
