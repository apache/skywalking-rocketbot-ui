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

import { SlowItem } from '@/types/global';
import { Value } from '@/types/dashboard';

export interface State {
  serviceApdexScore: {ApdexScore: number[]};
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
}

export const initState: State = {
  serviceApdexScore: { ApdexScore: [] },
  serviceResponseTime: { ResponseTime: [] },
  serviceInstanceThroughput: [],
  serviceSLA: { SLA: [] },
  servicePercent: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
  },
  serviceSlowEndpoint: [],
  serviceThroughput: { Throughput: [] },
};

export const SetService = (state: State, params: any) => {
  if (!params) {
    return;
  }
  if (params.serviceResponseTime) {
    state.serviceResponseTime.ResponseTime = params.serviceResponseTime.values.map((i: Value) => i.value);
  }
  if (params.serviceInstanceThroughput) {
    state.serviceInstanceThroughput = params.serviceInstanceThroughput;
  }
  if (params.serviceSLA) {
    state.serviceSLA.SLA = params.serviceSLA.values.map((i: Value) => i.value / 100);
  }
  if (params.servicePercentile) {
    state.servicePercent.p50 = params.servicePercentile[0].values.map((i: Value) => i.value);
    state.servicePercent.p75 = params.servicePercentile[1].values.map((i: Value) => i.value);
    state.servicePercent.p90 = params.servicePercentile[2].values.map((i: Value) => i.value);
    state.servicePercent.p95 = params.servicePercentile[3].values.map((i: Value) => i.value);
    state.servicePercent.p99 = params.servicePercentile[4].values.map((i: Value) => i.value);
  }
  if (params.serviceSlowEndpoint) {
    state.serviceSlowEndpoint = params.serviceSlowEndpoint;
  }
  if (params.serviceThroughput) {
    state.serviceThroughput.Throughput = params.serviceThroughput.values.map((i: Value) => i.value);
  }
  if (params.serviceApdexScore) {
    state.serviceApdexScore.ApdexScore =
      params.serviceApdexScore.values.map((i: any) => Number((i.value / 10000).toFixed(2)));
  }
};
