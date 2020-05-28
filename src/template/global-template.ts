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
export default [
  {
    chartType: 'ChartHeatmap',
    title: 'Global Heatmap',
    width: 6,
    height: 250,
    metricName: 'all_heatmap',
    queryMetricType: 'readHeatMap',
    entityType: 'All',
    independentSelector: false,
    metricType: 'HEATMAP',
    aggregation: '',
    aggregationNum: null,
    unit: '',
    normal: true,
  },
  {
    chartType: 'ChartLine',
    title: 'Global Response Time Percentile',
    width: 6,
    height: 250,
    metricName: 'all_percentile',
    queryMetricType: 'readLabeledMetricsValues',
    entityType: 'All',
    independentSelector: false,
    metricType: 'LABELED_VALUE',
    metricLabels: 'p50, p75, p90, p95, p99',
    labelsIndex: '0, 1, 2, 3, 4',
    aggregation: '',
    aggregationNum: null,
    unit: '',
    normal: true,
  },
  {
    chartType: 'ChartTrace',
    title: 'Global Top Throughput',
    width: 3,
    height: 250,
    metricName: 'service_cpm',
    queryMetricType: 'sortMetrics',
    entityType: 'Service',
    independentSelector: false,
    metricType: 'REGULAR_VALUE',
    aggregation: '',
    aggregationNum: null,
    unit: 'cpm',
    parentService: false,
    normal: true,
  },
  {
    chartType: 'ChartSlow',
    title: 'Global Top Slow Endpoint',
    width: 6,
    height: 250,
    metricName: 'endpoint_avg',
    queryMetricType: 'sortMetrics',
    entityType: 'Endpoint',
    independentSelector: false,
    metricType: 'REGULAR_VALUE',
    aggregation: '',
    aggregationNum: null,
    unit: 'ms',
    parentService: false,
    normal: true,
  },
];
