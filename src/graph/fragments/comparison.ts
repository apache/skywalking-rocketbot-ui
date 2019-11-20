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

export const dependencyServerPercentile = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  serverSideP50: getLinearIntValues(metric: {
      name: "service_relation_server_p50"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    serverSideP75: getLinearIntValues(metric: {
      name: "service_relation_server_p75"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    serverSideP90: getLinearIntValues(metric: {
      name: "service_relation_server_p90"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    serverSideP95: getLinearIntValues(metric: {
      name: "service_relation_server_p95"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    serverSideP99: getLinearIntValues(metric: {
      name: "service_relation_server_p99"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const dependencyServerResponseTimeTrend = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  serverSideResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_relation_server_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const dependencyServerThroughputTrend = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  serverSideThroughputTrend: getLinearIntValues(metric: {
      name: "service_relation_server_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const dependencyServerSLATrend = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  serverSideSLATrend: getLinearIntValues(metric: {
      name: "service_relation_server_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const dependencyClientResponseTimeTrend = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  clientSideResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_relation_client_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const dependencyClientThroughputTrend = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  clientSideThroughputTrend: getLinearIntValues(metric: {
      name: "service_relation_client_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const dependencyClientSLATrend = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  clientSideSLATrend: getLinearIntValues(metric: {
      name: "service_relation_client_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const dependencyClientPercentile = {
  variable: '$duration: Duration!, $id: ID!',
  fragment: `
  clientSideP50: getLinearIntValues(metric: {
      name: "service_relation_client_p50"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    clientSideP75: getLinearIntValues(metric: {
      name: "service_relation_client_p75"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    clientSideP90: getLinearIntValues(metric: {
      name: "service_relation_client_p90"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    clientSideP95: getLinearIntValues(metric: {
      name: "service_relation_client_p95"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    clientSideP99: getLinearIntValues(metric: {
      name: "service_relation_client_p99"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};
