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

export const EntityType = [
  { key: 'Service', label: 'Service' },
  { key: 'All', label: 'All' },
  { key: 'Endpoint', label: 'Service Endpoint' },
  { key: 'ServiceInstance', label: 'Service Instance' },
];

export const IndependentType = [
  { key: 'true', label: 'Self selectors' },
  { key: 'false', label: 'Common selectors' },
];

export enum MetricsType {
  UNKNOWN = 'UNKNOWN',
  REGULAR_VALUE = 'REGULAR_VALUE',
  LABELED_VALUE = 'LABELED_VALUE',
  HEATMAP = 'HEATMAP',
  SAMPLED_RECORD = 'SAMPLED_RECORD',
}

export const QueryMetricTypes: { [key: string]: Array<{ label: string; value: string }> } = {
  REGULAR_VALUE: [
    { label: 'read avg value in the duration', value: 'readMetricsValue' },
    { label: 'read all values in the duration', value: 'readMetricsValues' },
    { label: 'get sorted top N values', value: 'sortMetrics' },
  ],
  LABELED_VALUE: [{ label: 'read all values of labels in the duration', value: 'readLabeledMetricsValues' }],
  HEATMAP: [{ label: 'read heatmap values in the duration', value: 'readHeatMap' }],
  SAMPLED_RECORD: [{ label: 'get sorted topN values', value: 'readSampledRecords' }],
};

export const MetricChartType: { [key: string]: string } = {
  readMetricsValue: 'ChartNum',
  readMetricsValues: 'ChartLine',
  sortMetrics: 'ChartSlow',
  readLabeledMetricsValues: 'ChartLine',
  HEATMAP: 'ChartHeatmap',
  readSampledRecords: 'ChartSlow',
};

export const CalculationType = [
  { label: 'Plus', value: '+' },
  { label: 'Minus', value: '-' },
  { label: 'Multiplication', value: '*' },
  { label: 'Division', value: '/' },
];
