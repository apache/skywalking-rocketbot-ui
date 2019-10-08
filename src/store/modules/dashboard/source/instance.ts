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

export interface State {
  instanceResponseTime: { ResponseTime: number[]; };
  instanceSLA: { SLA: number[]; };
  instanceThroughput: { Throughput: number[]; };
  instanceCPU: { cpu: number[]; };
  instanceGC: { oldGC: number[], youngGC: number[] };
  instanceGCCount: { oldGC: number[], youngGC: number[] };
  instanceHeap: { Value: number[], Free: number[], Hint?: string };
  instanceNonheap: { Value: number[], Free: number[], Hint?: string };
  instanceClrHeap: { Value: number[] };
  instanceClrCPU: { cpu: number[]; };
  instanceClrGC: { clrGCGen0: number[], clrGCGen1: number[], clrGCGen2: number[]};
}

export const initState: State = {
  instanceResponseTime: { ResponseTime: [] },
  instanceSLA: { SLA: [] },
  instanceThroughput: { Throughput: [] },
  instanceCPU: { cpu: [] },
  instanceGC: { oldGC: [], youngGC: [] },
  instanceGCCount: { oldGC: [], youngGC: [] },
  instanceHeap: { Value: [], Free: [] },
  instanceNonheap: { Value: [], Free: [] },
  instanceClrHeap: { Value: [] },
  instanceClrCPU: { cpu: [] },
  instanceClrGC: { clrGCGen0: [], clrGCGen1: [], clrGCGen2: [] },
};
export const SetInstance = (state: State, params: any) => {
  if (params && params.instanceResponseTime) {
    state.instanceResponseTime.ResponseTime = params.instanceResponseTime.values.map((i: Value) => i.value);
  }
  if (params && params.instanceThroughput) {
    state.instanceThroughput.Throughput = params.instanceThroughput.values.map((i: Value) => i.value);
  }
  if (params && params.instanceSLA) {
    state.instanceSLA.SLA = params.instanceSLA.values.map((i: Value) => i.value / 100);
  }
  if (params && params.instanceCPU) {
    state.instanceCPU.cpu = params.instanceCPU.values.map((i: Value) => i.value);
  }
  if (params && params.oldGCTime && params.youngGCTime) {
    state.instanceGC.oldGC = params.oldGCTime.values.map((i: Value) => i.value);
    state.instanceGC.youngGC = params.youngGCTime.values.map((i: Value) => i.value);
  }
  if (params && params.oldGCCount && params.youngGCCount) {
    state.instanceGCCount.oldGC = params.oldGCCount.values.map((i: Value) => i.value);
    state.instanceGCCount.youngGC = params.youngGCCount.values.map((i: Value) => i.value);
  }
  if (params && params.heap && params.maxHeap) {
    state.instanceHeap.Value = params.heap.values.map((i: Value) => (i.value / 1048576).toFixed(2));
    state.instanceHeap.Free = params.maxHeap.values
      .map((i: Value, index: number) =>
        i.value > -1 ? ((i.value / 1048576) - state.instanceHeap.Value[index]).toFixed(2) : 0);
    if (Math.max.apply(Math, params.maxHeap.values) === -1) {
      state.instanceHeap.Hint = 'Max Heap Unlimited';
    }
  }
  if (params && params.nonheap && params.maxNonHeap) {
    state.instanceNonheap.Value = params.nonheap.values.map((i: Value) => (i.value / 1048576).toFixed(2));
    state.instanceNonheap.Free = params.maxNonHeap.values
      .map((i: Value, index: number) =>
        i.value > -1 ? ((i.value / 1048576) - state.instanceNonheap.Value[index]).toFixed(2) : 0);
    if (Math.max.apply(Math, params.maxNonHeap.values) === -1) {
      state.instanceNonheap.Hint = 'Max NonHeap Unlimited';
    }
  }
  if (params && params.clrHeap) {
    state.instanceClrHeap.Value = params.clrHeap.values.map((i: Value) => (i.value / 1048576 ).toFixed(2));
  }
  if (params && params.clrCPU) {
    state.instanceClrCPU.cpu = params.clrCPU.values.map((i: Value) => i.value);
  }
  if (params && params.clrGCGen0 && params.clrGCGen1 && params.clrGCGen2) {
    state.instanceClrGC.clrGCGen0 = params.clrGCGen0.values.map((i: Value) => i.value);
    state.instanceClrGC.clrGCGen1 = params.clrGCGen1.values.map((i: Value) => i.value);
    state.instanceClrGC.clrGCGen2 = params.clrGCGen2.values.map((i: Value) => i.value);
  }
};
