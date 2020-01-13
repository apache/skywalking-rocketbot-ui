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

export const initState: State = {
  databaseResponseTime: { ResponseTime: [] },
  databaseSLA: { SLA: [] },
  databasePercent: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
  },
  databaseTopNRecords: [],
  databaseThroughput: { Throughput: [] },
};

export const SetDatabase = (state: State, params: any) => {
  if (!params) {
    return;
  }
  if (params.databaseResponseTime) {
    state.databaseResponseTime.ResponseTime = params.databaseResponseTime.values.map((i: Value) => i.value);
  }
  if (params.databaseSLA) {
    state.databaseSLA.SLA = params.databaseSLA.values.map((i: Value) => i.value / 100);
  }
  if (params.databasePercentile) {
    const PercentileItem = ['p50', 'p75', 'p90', 'p95', 'p99'] as string[];
    const databasePercent = {} as any;

    params.databasePercentile.forEach((item: any, index: number) => {
      if (item && item.values) {
        const key = PercentileItem[index] as string;
        databasePercent[key] = item.values.map((i: any) => i.value);
      }
    });
    state.databasePercent = databasePercent;
  }
  if (params.databaseTopNRecords) {
    state.databaseTopNRecords = params.databaseTopNRecords.map((i: any) => ({
      key: i.traceId,
      label: i.statement,
      value: i.latency,
    }));
  }
  if (params.databaseThroughput) {
    state.databaseThroughput.Throughput = params.databaseThroughput.values.map((i: Value) => i.value);
  }
};
