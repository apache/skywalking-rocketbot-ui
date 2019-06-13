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

export interface State {
  globalPercent: {
    p50: number[],
    p75: number[],
    p90: number[],
    p95: number[],
    p99: number[],
  };
}

export const initState: State = {
  globalPercent: {
    p50: [],
    p75: [],
    p90: [],
    p95: [],
    p99: [],
  },
};


// mutations
export const SetGlobalPercent = (state: State, params: any) => {
  if (params.globalP50 && params.globalP75 && params.globalP90 && params.globalP95 && params.globalP99) {
    state.globalPercent.p50 = params.globalP50.values.map((i: Value) => i.value);
    state.globalPercent.p75 = params.globalP75.values.map((i: Value) => i.value);
    state.globalPercent.p90 = params.globalP90.values.map((i: Value) => i.value);
    state.globalPercent.p95 = params.globalP95.values.map((i: Value) => i.value);
    state.globalPercent.p99 = params.globalP99.values.map((i: Value) => i.value);
  }
};
