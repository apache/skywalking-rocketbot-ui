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

export const TopoServiceInfo = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_relation_server_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_relation_server_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_relation_server_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "service_relation_server_p50"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "service_relation_server_p75"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "service_relation_server_p90"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "service_relation_server_p95"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP99: getLinearIntValues(metric: {
      name: "service_relation_server_p99"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const TopoClientInfo = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_relation_client_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_relation_client_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_relation_client_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "service_relation_client_p50"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "service_relation_client_p75"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "service_relation_client_p90"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "service_relation_client_p95"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getP99: getLinearIntValues(metric: {
      name: "service_relation_client_p99"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const Topo = {
  variable: '$duration: Duration!',
  query: `
  topo: getGlobalTopology(duration: $duration) {
    nodes {
      id
      name
      type
      isReal
    }
    calls {
      id
      source
      detectPoints
      target
    }
  }`};
export const ServiceTopo = {
  variable: '$duration: Duration!, $serviceId: ID!',
  query: `
  topo: getServiceTopology(duration: $duration, serviceId: $serviceId) {
    nodes {
      id
      name
      type
      isReal
    }
    calls {
      id
      source
      detectPoints
      target
    }
  }`};
export const TopoMetric = {
  variable: '$ids: [ID!]!',
  query: `
  sla: getValues(metric: {
    name: "service_sla"
    ids: $ids
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  nodeCpm: getValues(metric: {
    name: "service_cpm"
    ids: $ids
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  nodeLatency: getValues(metric: {
    name: "service_resp_time"
    ids: $ids
  }, duration: $duration) {
    values {
      id
      value
    }
  }`};

export const TopoServiceMetric = {
  variable: '$idsS: [ID!]!',
  query: `
  cpmS: getValues(metric: {
    name: "service_relation_server_cpm"
    ids: $idsS
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  latencyS: getValues(metric: {
    name: "service_relation_client_resp_time"
    ids: $idsS
  }, duration: $duration) {
    values {
      id
      value
    }
  }`};

export const TopoClientMetric = {
  variable: '$idsC: [ID!]!',
  query: `
  cpmC: getValues(metric: {
    name: "service_relation_client_cpm"
    ids: $idsC
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  latencyC: getValues(metric: {
    name: "service_relation_client_resp_time"
    ids: $idsC
  }, duration: $duration) {
    values {
      id
      value
    }
  }`};
