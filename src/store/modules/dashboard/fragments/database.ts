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


export const databaseResponseTime =  {
  variable: ['$duration: Duration!'],
  fragment: `
  databaseResponseTime: getLinearIntValues(metric: {
    name: "database_avg"
    id: $databaseId
  }, duration: $duration) {
    values {value}
  }`,
};

export const databaseThroughput =  {
  variable: ['$databaseId: ID!', '$duration: Duration!'],
  fragment: `
  databaseThroughput: getLinearIntValues(metric: {
    name: "database_cpm"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};
export const databaseSLA =  {
  variable: ['$databaseId: ID!', '$duration: Duration!'],
  fragment: `
  databaseSLA: getLinearIntValues(metric: {
    name: "database_sla"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};
export const databasePercent =  {
  variable: ['$databaseId: ID!', '$duration: Duration!'],
  fragment: `
  databaseP99: getLinearIntValues(metric: {
    name: "database_p99"
  }, duration: $duration) { values { value } }
  databaseP95: getLinearIntValues(metric: {
    name: "database_p95"
  }, duration: $duration) { values { value } }
  databaseP90: getLinearIntValues(metric: {
    name: "database_p90"
  }, duration: $duration) { values { value } }
  databaseP75: getLinearIntValues(metric: {
    name: "database_p75"
  }, duration: $duration) { values { value } }
  databaseP50: getLinearIntValues(metric: {
    name: "database_p50"
  }, duration: $duration) { values { value } }`,
};

export const databaseTopNRecords =  {
  variable: ['$databaseId: ID!', '$duration: Duration!'],
  fragment: `
  databaseTopNRecords(condition: $condition) {
    statement
    latency
    traceId
  }`,
};
