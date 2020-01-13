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


export const globalBrief = {
  variable: ['$duration: Duration!'],
  fragment: `
  globalBrief: getGlobalBrief(duration: $duration) {
    numOfService numOfEndpoint numOfDatabase numOfCache numOfMQ
  }`,
};

export const globalHeatmap = {
  variable: ['$duration: Duration!'],
  fragment: `
  globalHeatmap: getThermodynamic(duration: $duration, metric: {
    name: "all_heatmap"
  }) {
    nodes responseTimeStep: axisYStep
  }`,
};
export const globalPercent = {
  variable: ['$duration: Duration!'],
  fragment: `
  globalPercentile: getMultipleLinearIntValues(metric: {
    name: "all_percentile"
  }, numOfLinear: 5, duration: $duration) { values { value } }`,
};
export const globalSlow = {
  variable: ['$duration: Duration!'],
  fragment: `
  globalSlow: getAllEndpointTopN(
    duration: $duration,
    name: "endpoint_avg",
    topN: 10,
    order: DES
  ) {
    key: id label: name value
  }`,
};
export const globalThroughput = {
  variable: ['$duration: Duration!'],
  fragment: `
  globalThroughput: getServiceTopN(
    duration: $duration,
    name: "service_cpm",
    topN: 10,
    order: DES
  ) {
    key: id label: name value
  }`,
};
