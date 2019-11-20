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

export const DependencyServerPercentile = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    p50: getLinearIntValues(metric: {
      name: "service_relation_server_p50"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p75: getLinearIntValues(metric: {
      name: "service_relation_server_p75"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p90: getLinearIntValues(metric: {
      name: "service_relation_server_p90"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p95: getLinearIntValues(metric: {
      name: "service_relation_server_p95"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p99: getLinearIntValues(metric: {
      name: "service_relation_server_p99"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const DependencyClientPercentile = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    p50: getLinearIntValues(metric: {
      name: "service_relation_client_p50"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p75: getLinearIntValues(metric: {
      name: "service_relation_client_p75"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p90: getLinearIntValues(metric: {
      name: "service_relation_client_p90"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p95: getLinearIntValues(metric: {
      name: "service_relation_client_p95"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    p99: getLinearIntValues(metric: {
      name: "service_relation_client_p99"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};
