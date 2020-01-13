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


export const endpointResponseTime =  {
  variable: ['$endpointId: ID!', '$duration: Duration!'],
  fragment: `
  endpointResponseTime: getLinearIntValues(metric: {
    name: "endpoint_avg"
    id: $endpointId
  }, duration: $duration) {
    values {value}
  }`,
};

export const endpointThroughput =  {
  variable: ['$endpointId: ID!', '$duration: Duration!'],
  fragment: `
  endpointThroughput: getLinearIntValues(metric: {
    name: "endpoint_cpm"
    id: $endpointId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};
export const endpointSLA =  {
  variable: ['$endpointId: ID!', '$duration: Duration!'],
  fragment: `
  endpointSLA: getLinearIntValues(metric: {
    name: "endpoint_sla"
    id: $endpointId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};
export const endpointPercent = {
  variable: ['$duration: Duration!'],
  fragment: `
  endpointPercentile: getMultipleLinearIntValues(metric: {
    name: "endpoint_percentile"
  }, numOfLinear: 5, duration: $duration) { values { value } }`,
};

export const endpointTopology =  {
  variable: ['$endpointId: ID!', '$duration: Duration!'],
  fragment: `
  endpointTopology: getEndpointTopology(endpointId: $endpointId, duration: $duration) {
    nodes {
      name: id
      value: name
    }
    calls {
      id
      source
      target
    }
  }`,
};

export const endpointTraces =  {
  variable: ['$endpointId: ID!', '$endpointName: String!', '$duration: Duration!'],
  fragment: `
  endpointTraces: queryBasicTraces(condition: {
		endpointId: $endpointId,
		endpointName: $endpointName,
		queryOrder: BY_DURATION,
    traceState: ALL,
    paging: {
          pageNum: 1,
          pageSize: 20,
          needTotal: false
      },
      queryDuration: $duration,
	}) {
      traces {
        key: segmentId
        endpointNames
        duration
        start
        isError
        traceIds
      }
      total
    }`,
};
