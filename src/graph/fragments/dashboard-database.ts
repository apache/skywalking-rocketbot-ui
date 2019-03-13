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

export const DashBoardDatabase = {
  variable: '$databaseId: ID!, $duration: Duration!, $condition: TopNRecordsCondition!',
  query: `
  getResponseTimeTrend: getLinearIntValues(metric: {
    name: "database_access_resp_time"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getThroughputTrend: getLinearIntValues(metric: {
    name: "database_access_cpm"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getSLATrend: getLinearIntValues(metric: {
    name: "database_access_sla"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP99: getLinearIntValues(metric: {
    name: "database_access_p99"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP95: getLinearIntValues(metric: {
    name: "database_access_p95"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP90: getLinearIntValues(metric: {
    name: "database_access_p90"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP75: getLinearIntValues(metric: {
    name: "database_access_p75"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP50: getLinearIntValues(metric: {
    name: "database_access_p50"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getTopNRecords(condition: $condition) {
    statement
    latency
    traceId
  }
  `};
