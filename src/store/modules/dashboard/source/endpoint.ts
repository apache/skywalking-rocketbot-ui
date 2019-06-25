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

import { Value } from '@/types/dashboard';
import { SlowItem } from '@/types/global';

export interface State {
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
  endpointTopology: { calls: any; nodes: any; };
}

export const initState: State = {
  endpointPercent: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
  },
  endpointResponseTime: { ResponseTime: [] },
  endpointThroughput: { Throughput: [] },
  endpointSLA: { SLA: [] },
  endpointSlowEndpoint: [],
  endpointTraces: [],
  endpointTopology: { calls: [], nodes: [] },
};


export const SetEndpoint = (state: State, params: any) => {
  if (params &&
    params.endpointP50 && params.endpointP75 && params.endpointP90 && params.endpointP95 && params.endpointP99) {
    state.endpointPercent.p50 = params.endpointP50.values.map((i: Value) => i.value);
    state.endpointPercent.p75 = params.endpointP75.values.map((i: Value) => i.value);
    state.endpointPercent.p90 = params.endpointP90.values.map((i: Value) => i.value);
    state.endpointPercent.p95 = params.endpointP95.values.map((i: Value) => i.value);
    state.endpointPercent.p99 = params.endpointP99.values.map((i: Value) => i.value);
  }
  if (params && params.endpointResponseTime) {
    state.endpointResponseTime.ResponseTime = params.endpointResponseTime.values.map((i: Value) => i.value);
  }
  if (params && params.endpointThroughput) {
    state.endpointThroughput.Throughput = params.endpointThroughput.values.map((i: Value) => i.value);
  }
  if (params && params.endpointSLA) {
    state.endpointSLA.SLA = params.endpointSLA.values.map((i: Value) => i.value / 100);
  }
  if (params && params.endpointSlowEndpoint) {
    state.endpointSlowEndpoint = params.endpointSlowEndpoint;
  }
  if (params && params.endpointTopology) {
    state.endpointTopology.nodes = params.endpointTopology.nodes;
    state.endpointTopology.calls = params.endpointTopology.calls.map((i: Value) => ({...i, value: 1}));
  }
  if (params && params.endpointTraces) {
    state.endpointTraces = params.endpointTraces.traces.map((i: any) => ({
      key: i.key,
      label: i.endpointNames[0],
      value: i.duration,
    }));
  }
};
