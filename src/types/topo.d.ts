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

export interface CompsContainer {
  service: CompsItem[];
  database: CompsItem[];
  proxy: CompsItem[];
}

export interface CompsItem {
  o: string;
  comp: string;
  n: string;
  t: string;
  type?: string;
  w: number;
}

export interface CompsGroup {
  name: string;
  children: CompsItem[];
}

export interface CompQuery {
  service: Option;
  database: Option;
  endpoint: Option;
  instance: Option;
}

export interface CompsTree {
  name?: string;
  type: string;
  query: CompQuery;
  children: CompsGroup[];
}

export interface Option {
  key: string;
  label: string;
}

export interface Duration {
  start: Date;
  end: Date;
  step: string;
}

export interface DurationTime {
  start: string;
  end: string;
  step: string;
}

export interface Trace {
  duration: number;
  isError: boolean;
  key: string;
  operationNames: string[];
  start: string;
  traceIds: string[];
}

export interface Span {
  duration: number;
  isError: boolean;
  key: string;
  operationNames: string[];
  start: string;
  traceIds: string[];
}
