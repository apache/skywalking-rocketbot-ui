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

const readMetricsValues = {
  variable: ['$condition: MetricsCondition!, $duration: Duration!'],
  fragment: `
  readMetricsValues: readMetricsValues(condition: $condition, duration: $duration) {
    label
    values {
      values {value}
    }
  }`,
};

const readMetricsValue = {
  variable: ['$condition: MetricsCondition!, $duration: Duration!'],
  fragment: `
  readMetricsValue: readMetricsValue(condition: $condition, duration: $duration)`,
};

const sortMetrics = {
  variable: ['$condition: TopNCondition!, $duration: Duration!'],
  fragment: `
  sortMetrics: sortMetrics(condition: $condition, duration: $duration) {
    name
    id
    value
    refId
  }`,
};

const readLabeledMetricsValues = {
  variable: ['$condition: MetricsCondition!, $labels: [String!]!, $duration: Duration!'],
  fragment: `
  readLabeledMetricsValues: readLabeledMetricsValues(
    condition: $condition,
    labels: $labels,
    duration: $duration) {
    label
    values {
      values {value}
    }
  }`,
};

const readHeatMap = {
  variable: ['$condition: MetricsCondition!, $duration: Duration!'],
  fragment: `
  readHeatMap: readHeatMap(condition: $condition, duration: $duration) {
    values {
      id
      values
    }
    buckets {
      min
      max
    }
  }`,
};

const readSampledRecords = {
  variable: ['$condition: TopNCondition!, $duration: Duration!'],
  fragment: `
  readSampledRecords: readSampledRecords(condition: $condition, duration: $duration) {
    name
    value
    refId
  }`,
};

export default {
  readSampledRecords,
  readHeatMap,
  readLabeledMetricsValues,
  sortMetrics,
  readMetricsValue,
  readMetricsValues,
};
