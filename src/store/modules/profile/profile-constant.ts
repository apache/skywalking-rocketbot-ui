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

export const InitTaskField = {
  service: { key: '', label: 'None' },
  endpoint: '',
  monitorTime: { key: '1', label: 'monitor now' },
  monitorDuration: [{ key: '5min', label: '5 min' }],
  minThreshold: 0,
  dumpPeriod: [{ key: '10ms', label: '10ms' }],
};

export const InitTaskFieldSource = {
  serviceSource: [{ key: '', label: 'None' }],
  monitorTime: [
    { key: '0', label: 'monitor now' },
    { key: '1', label: 'set start time' },
  ],
  monitorDuration: [
    { key: '5min', label: '5 min' },
    { key: '10min', label: '10 min' },
    { key: '15min', label: '15 min' },
  ],
  dumpPeriod: [
    { key: '10ms', label: '10 ms' },
    { key: '20ms', label: '20 ms' },
    { key: '50ms', label: '50 ms' },
    { key: '100ms', label: '100 ms' },
  ],
};

export enum ChangeTaskOpt {
  Service = 'service',
  EndpointName = 'endpointName',
  MonitorTime = 'monitorTime',
  MonitorDuration = 'monitorDuration',
  MinThreshold = 'minThreshold',
  DumpPeriod = 'dumpPeriod',
}
