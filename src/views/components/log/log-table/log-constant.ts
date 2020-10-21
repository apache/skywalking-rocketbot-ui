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

export const ServiceLogConstants = [
  {
    label: '',
    value: '',
  },
];
// The order of columns should be time, service, error, stack, version, url, catalog, and grade.
export const BrowserLogConstants = [
  {
    label: 'time',
    value: 'Time',
  },
  {
    label: 'service',
    value: 'Service',
  },
  {
    label: 'message',
    value: 'Error Info',
    drag: true,
    method: 350,
  },
  {
    label: 'stack',
    value: 'Stack',
    drag: true,
    method: 350,
  },
  {
    label: 'serviceVersion',
    value: 'Service Version',
  },
  {
    label: 'errorUrl',
    value: 'Error Page',
  },
  // {
  //   label: 'pagePath',
  //   value: 'Page Path',
  // },
  {
    label: 'category',
    value: 'Catalog',
  },

  {
    label: 'grade',
    value: 'Grade',
  },
];
