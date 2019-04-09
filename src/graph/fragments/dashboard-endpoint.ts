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

export const DashBoardEndpoint = {
  variable: '$endpointId: ID!, $duration: Duration!, $traceCondition: TraceQueryCondition!',
  query: `
    getEndpointResponseTimeTrend: getLinearIntValues(metric: {
      name: "endpoint_avg"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getEndpointTopology(endpointId: $endpointId, duration: $duration) {
      nodes {
        name: id
        value: name
      }
      calls {
        id
        source
        target
      }
    }
    getEndpointThroughputTrend: getLinearIntValues(metric: {
      name: "endpoint_cpm"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getEndpointSLATrend: getLinearIntValues(metric: {
      name: "endpoint_sla"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    queryBasicTraces(condition: $traceCondition) {
      traces {
        key: segmentId
        endpointNames
        duration
        start
        isError
        traceIds
      }
      total
    }
    getP99: getLinearIntValues(metric: {
      name: "endpoint_p99"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "endpoint_p95"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "endpoint_p90"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "endpoint_p75"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "endpoint_p50"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
  `};

export const DashBoardEndpointTopo = {
  variable: '$duration: Duration!, $idsS: [ID!]!',
  query: `
    cpm: getValues(metric: {
      name: "endpoint_relation_cpm"
      ids: $idsS
    }, duration: $duration) {
      values {
        id
        value
      }
    }
`};
