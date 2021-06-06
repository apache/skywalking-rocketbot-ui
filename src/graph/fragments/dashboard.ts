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

export const TypeOfMetrics = {
  variable: '$name: String!',
  query: `typeOfMetrics(name: $name)`,
};

export const getAllTemplates = {
  query: `
    getAllTemplates(includingDisabled: false) {
      name,
      type
      configuration,
      activated,
      disabled,
    }
  `,
};

export const addTemplate = {
  variable: '$setting: DashboardSetting!',
  query: `
    addTemplate(setting: $setting) {
      status
      message
    }
  `,
};

export const fetchEvents = {
  variable: ['$condition: EventQueryCondition'],
  query: `
  fetchEvents: queryEvents(condition: $condition) {
    events {
      uuid
      source {
        service
        serviceInstance
        endpoint
      }
      name
      type
      message
      parameters {
        key
        value
      }
      startTime
      endTime
    }
    total
  }`,
};

export const changeTemplate = {
  variable: '$setting: DashboardSetting!',
  query: `
    changeTemplate(setting: $setting) {
      status
      message
    }
  `,
};

export const disableTemplate = {
  variable: '$setting: DashboardSetting!',
  query: `
    disableTemplate(setting: $setting) {
      status
      message
    }
  `,
};

export const queryMetricsValues = {
  variable: ['$condition: MetricsCondition!, $duration: Duration!'],
  query: `
  readMetricsValues: readMetricsValues(condition: $condition, duration: $duration) {
    label
    values {
      values {value}
    }
  }`,
};

export const queryMetricsValue = {
  variable: ['$condition: MetricsCondition!, $duration: Duration!'],
  query: `
  readMetricsValue: readMetricsValue(condition: $condition, duration: $duration)`,
};

export const querySortMetrics = {
  variable: ['$condition: TopNCondition!, $duration: Duration!'],
  query: `
  sortMetrics: sortMetrics(condition: $condition, duration: $duration) {
    name
    id
    value
    refId
  }`,
};

export const queryLabeledMetricsValues = {
  variable: ['$condition: MetricsCondition!, $labels: [String!]!, $duration: Duration!'],
  query: `
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

export const queryHeatMap = {
  variable: ['$condition: MetricsCondition!, $duration: Duration!'],
  query: `
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

export const querySampledRecords = {
  variable: ['$condition: TopNCondition!, $duration: Duration!'],
  query: `
  readSampledRecords: readSampledRecords(condition: $condition, duration: $duration) {
    name
    value
    refId
  }`,
};
