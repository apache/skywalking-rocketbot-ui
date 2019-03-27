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

export const DashBoardService = {
  variable: '$serviceId: ID!, $duration: Duration!',
  query: `
    getSlowEndpoint: getEndpointTopN(
      serviceId: $serviceId
      duration: $duration
      name: "endpoint_avg",
      topN: 10,
      order: DES
    ) {
      key: id
      label: name
      value
    }
    getServiceInstanceThroughput: getServiceInstanceTopN(
      serviceId: $serviceId
      duration: $duration
      name: "service_instance_cpm",
      topN: 10,
      order: DES
    ) {
      key: id
      label: name
      value
    }
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_resp_time"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_cpm"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_sla"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP99: getLinearIntValues(metric: {
      name: "service_p99"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "service_p95"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "service_p90"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "service_p75"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "service_p50"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
  `};
