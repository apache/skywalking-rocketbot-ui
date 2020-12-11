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

export const Services = {
  variable: ['$duration: Duration!', '$keyword: String!'],
  query: `
    services: getAllServices(duration: $duration, group: $keyword) {
      key: id
      label: name
      group
    }
  `,
};

export const BrowserServices = {
  variable: ['$duration: Duration!'],
  query: `
    services: getAllBrowserServices(duration: $duration) {
      key: id
      label: name
    }
  `,
};

export const Database = {
  variable: '$duration: Duration!',
  query: `
    services: getAllDatabases(duration: $duration) {
      key: id
      label: name
    }
  `,
};

export const Endpoints = {
  variable: '$serviceId: ID!, $keyword: String!',
  query: `
    getEndpoints: searchEndpoint(serviceId: $serviceId, keyword: $keyword, limit: 100) {
      key: id
      label: name
    }
`,
};

export const Instances = {
  variable: '$serviceId: ID!, $duration: Duration!',
  query: `
    getServiceInstances(duration: $duration, serviceId: $serviceId) {
      key: id
      label: name
      language
      attributes {
        name
        value
      }
    }
  `,
};

export const OAPTimeInfo = {
  query: `
    getTimeInfo {
      timezone
      currentTimestamp
    }
  `,
};
