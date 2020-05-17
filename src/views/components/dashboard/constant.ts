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

export enum DASHBOARDTYPE {
  SERVICE = 'service',
  METRIC = 'metric',
  DATABASE = 'database',
}

export enum QueryTypes {
  ReadMetricsValue = 'readMetricsValue',
  ReadMetricsValues = 'readMetricsValues',
  SortMetrics = 'sortMetrics',
  ReadLabeledMetricsValues = 'readLabeledMetricsValues',
  HEATMAP = 'HEATMAP',
  ReadSampledRecords = 'readSampledRecords',
}

const globalHeatmap = {
  id: '',
  metricName: 'all_heatmap',
  queryMetricType: 'readHeatMap',
  currentService: '',
  entityType: 'All',
  independentSelector: false,
  metricType: 'HEATMAP',
  version: '',
};

const globalPercent = {
  id: '',
  metricName: 'all_percentile',
  queryMetricType: 'readLabeledMetricsValues',
  currentService: '',
  entityType: 'All',
  independentSelector: false,
  metricType: 'LABELED_VALUE',
  version: '',
};

const globalSlow = {
  id: '',
  metricName: 'endpoint_avg',
  queryMetricType: 'sortMetrics',
  currentService: '',
  entityType: 'All',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const globalThroughput = {
  id: '',
  metricName: 'service_cpm',
  queryMetricType: 'sortMetrics',
  currentService: '',
  entityType: 'All',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const serviceResponseTime = {
  id: '',
  metricName: 'service_resp_time',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'Service',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const serviceThroughput = {
  id: '',
  metricName: 'service_cpm',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'Service',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const serviceSLA = {
  id: '',
  metricName: 'service_sla',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'Service',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const servicePercent = {
  id: '',
  metricName: 'service_percentile',
  queryMetricType: 'readLabeledMetricsValues',
  currentService: '',
  entityType: 'Service',
  independentSelector: false,
  metricType: 'LABELED_VALUE',
  version: '',
};

const serviceSlowEndpoint = {
  id: '',
  metricName: 'endpoint_avg',
  queryMetricType: 'sortMetrics',
  currentService: '',
  entityType: 'Service',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const serviceInstanceThroughput = {
  id: '',
  metricName: 'service_instance_cpm',
  queryMetricType: 'sortMetrics',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const serviceApdexScore = {
  id: '',
  metricName: 'service_apdex',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'Service',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointResponseTime = {
  id: '',
  metricName: 'endpoint_avg',
  queryMetricType: 'readMetricsValue',
  currentService: '',
  entityType: 'ServiceEndpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointThroughput = {
  id: '',
  metricName: 'endpoint_cpm',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceEndpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointSLA = {
  id: '',
  metricName: 'endpoint_sla',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceEndpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointPercent = {
  id: '',
  metricName: 'endpoint_percentile',
  queryMetricType: 'readLabeledMetricsValues',
  currentService: '',
  entityType: 'ServiceEndpoint',
  independentSelector: false,
  metricType: 'LABELED_VALUE',
  version: '',
};

const instanceResponseTime = {
  id: '',
  metricName: 'service_instance_resp_time',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};
const instanceResponseTimeAvg = {
  id: '',
  metricName: 'service_instance_resp_time',
  queryMetricType: 'readMetricsValue',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceThroughputAvg = {
  id: '',
  metricName: 'service_instance_cpm',
  queryMetricType: 'readMetricsValue',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceSLAAvg = {
  id: '',
  metricName: 'service_instance_sla',
  queryMetricType: 'readMetricsValue',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceThroughput = {
  id: '',
  metricName: 'service_instance_cpm',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceSLA = {
  id: '',
  metricName: 'service_instance_sla',
  queryMetricType: 'readMetricsValues',
  currentService: 'ServiceInstance',
  entityType: '',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceCPU = {
  id: '',
  metricName: 'instance_jvm_cpu',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

// export const instanceGC = {
//   id: '',
//   metricName: 'instance_jvm_cpu',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: '',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

export default {
  instanceCPU,
  instanceSLA,
  instanceThroughput,
  instanceResponseTime,
  endpointPercent,
  endpointSLA,
  endpointThroughput,
  endpointResponseTime,
  serviceApdexScore,
  serviceInstanceThroughput,
  serviceSlowEndpoint,
  servicePercent,
  serviceSLA,
  serviceThroughput,
  serviceResponseTime,
  globalThroughput,
  globalSlow,
  globalPercent,
  globalHeatmap,
  instanceResponseTimeAvg,
  instanceThroughputAvg,
  instanceSLAAvg,
};
