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

export const Traces = {
  variable: '$condition: TraceQueryCondition',
  query: `
  data: queryBasicTraces(condition: $condition) {
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

export const ServiceInstanceOption = {
  variable: '$duration: Duration!, $serviceId: ID!',
  query: `
    instanceId: getServiceInstances(duration: $duration, serviceId: $serviceId) {
      key: id
      label: name
    }`,
};

/**
 * @param { traceId } { string }
 */
export const Trace = {
  variable: '$traceId: ID!',
  query: `
  trace: queryTrace(traceId: $traceId) {
    spans {
      traceId
      segmentId
      spanId
      parentSpanId
      refs {
        traceId
        parentSegmentId
        parentSpanId
        type
      }
      serviceCode
      serviceInstanceName
      startTime
      endTime
      endpointName
      type
      peer
      component
      isError
      layer
      tags {
        key
        value
      }
      logs {
        time
        data {
          key
          value
        }
      }
    }
  }
  `,
};
