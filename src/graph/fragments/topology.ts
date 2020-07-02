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
    getPercentile: getMultipleLinearIntValues(metric: {
      name: "service_relation_server_percentile",
      id: $id
    }, numOfLinear: 5, duration: $duration) { values { value } }
`,
};

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
    getPercentile: getMultipleLinearIntValues(metric: {
      name: "service_relation_client_percentile",
      id: $id
    }, numOfLinear: 5, duration: $duration) { values { value } }
`,
};

export const TopoInstanceClientInfo = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_instance_relation_client_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_instance_relation_client_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_instance_relation_client_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getPercentile: getMultipleLinearIntValues(metric: {
      name: "service_instance_relation_client_percentile",
      id: $id
    }, numOfLinear: 5, duration: $duration) { values { value } }
`,
};

export const TopoInstanceServerInfo = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_instance_relation_server_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_instance_relation_server_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_instance_relation_server_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getPercentile: getMultipleLinearIntValues(metric: {
      name: "service_instance_relation_client_percentile",
      id: $id
    }, numOfLinear: 5, duration: $duration) { values { value } }
`,
};

export const TopoInstanceDependency = {
  variable: '$clientServiceId: ID!, $serverServiceId: ID!, $duration: Duration!',
  query: `
  topo: getServiceInstanceTopology(clientServiceId: $clientServiceId,
    serverServiceId: $serverServiceId, duration: $duration) {
    nodes {
      id
      name
      type
      isReal
      serviceName
      serviceId
    }
    calls {
      id
      source
      detectPoints
      target
    }
  }
`,
};

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
  }`,
};
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
  }`,
};
export const ServicesTopo = {
  variable: '$duration: Duration!, $serviceIds: [ID!]!',
  query: `
  topo: getServicesTopology(duration: $duration, serviceIds: $serviceIds) {
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
  }`,
};
export const endpointTopology = {
  variable: ['$endpointId: ID!', '$duration: Duration!'],
  query: `
  endpointTopology: getEndpointDependencies(endpointId: $endpointId, duration: $duration) {
    nodes {
      id
      name
      serviceId
      serviceName
      type
      isReal
    }
    calls {
      id
      source
      target
      detectPoints
    }
  }`,
};
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
  }`,
};

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
  }`,
};

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
  }`,
};

export const DependencyInstanceServerMetric = {
  variable: '$duration: Duration!, $idsC: [ID!]!',
  query: `
  cpmC: getValues(metric: {
    name: "service_instance_relation_server_cpm"
    ids: $idsC
  }, duration: $duration) {
    values {
      id
      value
    }
  }`,
};
export const DependencyInstanceClientMetric = {
  variable: '$duration: Duration!, $idsC: [ID!]!',
  query: `
  cpmC: getValues(metric: {
    name: "service_instance_relation_client_cpm"
    ids: $idsC
  }, duration: $duration) {
    values {
      id
      value
    }
  }`,
};
export const TopoServiceDetail = {
  variable: ['$serviceId: ID!', '$duration: Duration!'],
  query: `
    servicePercentile: getMultipleLinearIntValues(metric: {
      name: "service_percentile"
      id: $serviceId
    }, numOfLinear: 5, duration: $duration) {
      values { value }
    }
    serviceSLA: getLinearIntValues(metric: {
      name: "service_sla"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    serviceThroughput: getLinearIntValues(metric: {
      name: "service_cpm"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    serviceResponseTime: getLinearIntValues(metric: {
      name: "service_resp_time"
      id: $serviceId
    }, duration: $duration) {
      values {value}
    }
    serviceApdexScore: getLinearIntValues(metric: {
      name: "service_apdex"
      id: $serviceId
    }, duration: $duration) {
      values {value}
    }
`,
};
export const TopoEndpointDependencyMetrics = {
  variable: [
    '$serviceName: String',
    '$endpointName: String',
    '$destServiceName: String',
    '$destEndpointName: String',
    '$duration: Duration!',
  ],
  query: `
    endpointRelationPercentile: readLabeledMetricsValues(condition: {
      name: "endpoint_relation_percentile"
      entity: {
        scope: EndpointRelation
        serviceName: $serviceName
        normal: true
        endpointName: $endpointName
        destNormal: true
        destServiceName:  $destServiceName
        destEndpointName: $destEndpointName
      }
    }, labels: ["0", "1", "2", "3", "4"], duration: $duration) {
      label
      values {
        values {value}
      }
    }
    endpointRelationCpm: readMetricsValues(condition: {
      name: "endpoint_relation_cpm"
      entity: {
        scope: EndpointRelation
        serviceName: $serviceName
        normal: true
        endpointName: $endpointName
        destNormal: true
        destServiceName:  $destServiceName
        destEndpointName: $destEndpointName
      }
    }, duration: $duration) {
      label
      values {
        values {value}
      }
    }
    endpointRelationRespTime: readMetricsValues(condition: {
      name: "endpoint_relation_resp_time"
      entity: {
        scope: EndpointRelation
        serviceName: $serviceName
        normal: true
        endpointName: $endpointName
        destNormal: true
        destServiceName:  $destServiceName
        destEndpointName: $destEndpointName
      }
    }, duration: $duration) {
      label
      values {
        values {value}
      }
    }
    endpointRelationSla: readMetricsValues(condition: {
      name: "endpoint_relation_sla"
      entity: {
        scope: EndpointRelation
        serviceName: $serviceName
        normal: true
        endpointName: $endpointName
        destNormal: true
        destServiceName:  $destServiceName
        destEndpointName: $destEndpointName
      }
    }, duration: $duration) {
      label
      values {
        values {value}
      }
    }
`,
};
