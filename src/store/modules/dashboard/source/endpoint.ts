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

import {Value} from '@/types/dashboard';
import {SlowItem} from '@/types/global';

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
  endpointTopology: { calls: any; nodes: any; visualMap: any; };
}

export const initState: State = {
  endpointPercent: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
  },
  endpointResponseTime: {ResponseTime: []},
  endpointThroughput: {Throughput: []},
  endpointSLA: {SLA: []},
  endpointSlowEndpoint: [],
  endpointTraces: [],
  endpointTopology: {calls: [], nodes: [], visualMap: []},
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
    const serviceIdxMap = params.endpointTopology.endpoints.map((e: any) => (e.serviceName)).filter(
      function onlyUnique(value: any, index: number, self: any) {
        return self.indexOf(value) === index;
      }
    ).map((serviceName: string, index: number) => ({serviceName: serviceName, serviceIdx: index}));
    state.endpointTopology.nodes = params.endpointTopology.nodes.map(
      (n: any) => {
        const serviceName = params.endpointTopology.endpoints.find((v: any) => v.id === n.name).serviceName;
        return {
          name: n.name,
          content: n.value,
          tip: serviceName,
          value: serviceIdxMap.find((value: any) => (
            value.serviceName === serviceName
          )).serviceIdx,
        }
      });
    state.endpointTopology.calls = params.endpointTopology.calls.map((i: any) => {
      let sourceServiceName = params.endpointTopology.endpoints.find((v: any) => v.id === i.source).serviceName;
      let targetServiceName = params.endpointTopology.endpoints.find((v: any) => v.id === i.target).serviceName;
      return {...i, value: 1, tip: sourceServiceName + "->" + targetServiceName}
    });
    state.endpointTopology.visualMap = [{
      type: 'piecewise',
      dimension: 0,
      pieces: serviceIdxMap.map((val: any) => ({value: val.serviceIdx, label: val.serviceName})),
      categories: serviceIdxMap.map((val: any) => (val.serviceName)),
      orient: 'horizontal',
    }]
  }
  if (params && params.endpointTraces) {
    state.endpointTraces = params.endpointTraces.traces.map((i: any) => ({
      key: i.key,
      label: i.endpointNames[0],
      value: i.duration,
      traceIds: i.traceIds,
    }));
  }
};
