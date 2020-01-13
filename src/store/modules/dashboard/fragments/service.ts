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


export const serviceResponseTime =  {
  variable: ['$serviceId: ID!', '$duration: Duration!'],
  fragment: `
  serviceResponseTime: getLinearIntValues(metric: {
    name: "service_resp_time"
    id: $serviceId
  }, duration: $duration) {
    values {value}
  }`,
};

export const serviceThroughput =  {
  variable: ['$serviceId: ID!', '$duration: Duration!'],
  fragment: `
  serviceThroughput: getLinearIntValues(metric: {
    name: "service_cpm"
    id: $serviceId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};
export const serviceSLA =  {
  variable: ['$serviceId: ID!', '$duration: Duration!'],
  fragment: `
  serviceSLA: getLinearIntValues(metric: {
    name: "service_sla"
    id: $serviceId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};

export const servicePercent = {
  variable: ['$duration: Duration!'],
  fragment: `
  servicePercentile: getMultipleLinearIntValues(metric: {
    name: "service_percentile"
  }, numOfLinear: 5, duration: $duration) { values { value } }`,
};

export const serviceSlowEndpoint =  {
  variable: ['$serviceId: ID!', '$duration: Duration!'],
  fragment: `
  serviceSlowEndpoint: getEndpointTopN(
    serviceId: $serviceId
    duration: $duration
    name: "endpoint_avg",
    topN: 10,
    order: DES
  ) {
    key: id
    label: name
    value
  }`,
};

export const serviceInstanceThroughput =  {
  variable: ['$serviceId: ID!', '$duration: Duration!'],
  fragment: `
  serviceInstanceThroughput: getServiceInstanceTopN(
    serviceId: $serviceId
    duration: $duration
    name: "service_instance_cpm",
    topN: 10,
    order: DES
  ) {
    key: id
    label: name
    value
  }`,
};

export const serviceApdexScore =  {
  variable: ['$serviceId: ID!', '$duration: Duration!'],
  fragment: `
  serviceApdexScore: getLinearIntValues(metric: {
    name: "service_apdex"
    id: $serviceId
  }, duration: $duration) {
    values {value}
  }`,
};
