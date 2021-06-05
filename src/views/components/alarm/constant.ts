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

export const EventsDetailHeaders = [
  { text: 'eventID', class: 'uuid' },
  { text: 'eventName', class: 'name' },
  { text: 'eventsType', class: 'type' },
  { text: 'startTime', class: 'startTime' },
  { text: 'endTime', class: 'endTime' },
  // { text: 'currentService', class: 'service' },
  // { text: 'currentInstance', class: 'serviceInstance' },
  // { text: 'currentEndpoint', class: 'endpoint' },
  // { text: 'eventsMessage', class: 'message' },
];

export const AlarmEventsDetailKeys = [
  { text: 'eventID', class: 'uuid' },
  { text: 'eventName', class: 'name' },
  { text: 'eventsType', class: 'type' },
  { text: 'startTime', class: 'startTime' },
  { text: 'endTime', class: 'endTime' },
  // { text: 'currentService', class: 'service' },
  // { text: 'currentInstance', class: 'serviceInstance' },
  // { text: 'currentEndpoint', class: 'endpoint' },
  { text: 'eventsMessage', class: 'message' },
  { text: 'source', class: 'source' },
];

export const AlarmDetailCol = [
  {
    label: 'scope',
    value: 'scope',
  },
  {
    label: 'startTime',
    value: 'startTime',
  },
  {
    label: 'tags',
    value: 'tags',
  },
  {
    label: 'message',
    value: 'message',
  },
  {
    label: 'events',
    value: 'eventDetail',
  },
];
