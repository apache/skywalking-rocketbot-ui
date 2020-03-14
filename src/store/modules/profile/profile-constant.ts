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
  monitorTime: { key: '0', label: 'monitor now' },
  monitorDuration: { key: 5, label: '5 min' },
  minThreshold: 0,
  dumpPeriod: { key: 10, label: '10ms' },
  endpointName: '',
  maxSamplingCount: { key: 5, label: '5' },
};

export const InitTaskFieldSource = {
  serviceSource: [{ key: '', label: 'None' }],
  monitorTimeEn: [
    { key: '0', label: 'monitor now' },
    { key: '1', label: 'set start time' },
  ],
  monitorTimeCn: [
    { key: '0', label: '此刻' },
    { key: '1', label: '设置时间' },
  ],
  monitorDuration: [
    { key: 5, label: '5 min' },
    { key: 10, label: '10 min' },
    { key: 15, label: '15 min' },
  ],
  dumpPeriod: [
    { key: 10, label: '10 ms' },
    { key: 20, label: '20 ms' },
    { key: 50, label: '50 ms' },
    { key: 100, label: '100 ms' },
  ],
  maxSamplingCount: [
    { key: 1, label: '1' },
    { key: 2, label: '2' },
    { key: 3, label: '3' },
    { key: 4, label: '4' },
    { key: 5, label: '5' },
    { key: 6, label: '6' },
    { key: 7, label: '7' },
    { key: 8, label: '8' },
    { key: 9, label: '9' },
  ],
};

export enum ChangeTaskOpt {
  Service = 'service',
  EndpointName = 'endpointName',
  MonitorTime = 'monitorTime',
  MonitorDuration = 'monitorDuration',
  MinThreshold = 'minThreshold',
  DumpPeriod = 'dumpPeriod',
  MaxSamplingCount = 'maxSamplingCount',
}
