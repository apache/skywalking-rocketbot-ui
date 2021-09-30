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

export enum LogTestConstants {
  Timestamp = 'timestamp',
  Service = 'service',
  ServiceInstance = 'serviceInstance',
  Endpoint = 'endpoint',
  Body = 'body',
  TraceContext = 'traceContext',
  Tags = 'tags',
  DSL = 'dsl',
  Type = 'type',
}

export const TypeList = [
  {
    label: 'Text',
    value: 'text',
  },
  {
    label: 'Json',
    value: 'json',
  },
  {
    label: 'YAML',
    value: 'yaml',
  },
];

export const LogMetricsHeader = [
  {
    label: 'name',
    value: 'name',
  },
  {
    label: 'time',
    value: 'timestamp',
  },
  {
    label: 'value',
    value: 'value',
  },
  {
    label: 'tags',
    value: 'tags',
  },
];

export const DebuggerTools = ['Log Analysis Language Debugger'];
