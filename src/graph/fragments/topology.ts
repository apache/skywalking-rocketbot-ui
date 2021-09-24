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
    name: "service_relation_server_resp_time"
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
