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

export interface Trace {
  duration: number;
  isError: boolean;
  key: string;
  operationNames: string[];
  start: string;
  traceIds: string[];
}

export interface Span {
  endpointName: string;
  serviceCode: string;
  parentSpanId: number;
  segmentId: string;
  label?: string;
  layer: string;
  spanId: number;
  traceId: string;
  type: string;
  peer: string;
  component: string;
  isError: boolean;
  isBroken?: boolean;
  refs: Array<Ref>;
  startTime: number;
  endTime: number;
  dur?: number;
  children?: Span[];
  tags?: Array<Map<string,string>>;
  logs?: log[];
}

export interface log{
  time :number;
  data :Map<string,string>;
}

export interface Ref{
  traceId: string;
  parentSegmentId: string;
  parentSpanId: number;
  type: string;
}

export interface StatisticsSpan{
  groupRef: StatisticsGroupRef;
  maxTime: number;
  minTime: number;
  sumTime: number;
  avgTime: number;
  count: number;
}

export interface StatisticsGroupRef{
  endpointName: string;
  type: string;
}

export class TraceTreeRef {
  segmentMap: Map<string, Span>;
  segmentIdGroup: string[];
}