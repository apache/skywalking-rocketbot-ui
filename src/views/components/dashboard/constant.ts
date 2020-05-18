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
  READHEATMAP = 'readHeatMap',
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
// services
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
  entityType: 'Service',
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
// endpoint
const endpointResponseTimeAvg = {
  id: '',
  metricName: 'endpoint_avg',
  queryMetricType: 'readMetricsValue',
  currentService: '',
  entityType: 'Endpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointThroughputAvg = {
  id: '',
  metricName: 'endpoint_cpm',
  queryMetricType: 'readMetricsValue',
  currentService: '',
  entityType: 'Endpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointThroughput = {
  id: '',
  metricName: 'endpoint_cpm',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'Endpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointSLAAvg = {
  id: '',
  metricName: 'endpoint_sla',
  queryMetricType: 'readMetricsValue',
  currentService: '',
  entityType: 'Endpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointSLA = {
  id: '',
  metricName: 'endpoint_sla',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'Endpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointResponseTime = {
  id: '',
  metricName: 'endpoint_avg',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'Endpoint',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const endpointPercent = {
  id: '',
  metricName: 'endpoint_percentile',
  queryMetricType: 'readLabeledMetricsValues',
  currentService: '',
  entityType: 'Endpoint',
  independentSelector: false,
  metricType: 'LABELED_VALUE',
  version: '',
};
// instance
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
  currentService: '',
  entityType: 'ServiceInstance',
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

const instanceGC = {
  id: '',
  metricName: 'instance_jvm_young_gc_time, instance_jvm_old_gc_time',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceGCCount = {
  id: '',
  metricName: 'instance_jvm_young_gc_count, instance_jvm_old_gc_count',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceHeap = {
  id: '',
  metricName: 'instance_jvm_memory_heap, instance_jvm_memory_heap_max',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceNonheap = {
  id: '',
  metricName: 'instance_jvm_memory_noheap, instance_jvm_memory_noheap_max',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceEnvoyCount = {
  id: '',
  metricName: 'envoy_total_connections_used, envoy_parent_connections_used',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

const instanceClrGC = {
  id: '',
  metricName: 'instance_clr_gen0_collect_count, instance_clr_gen1_collect_count, instance_clr_gen2_collect_count',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};

// export const youngGCTime = {
//   id: '',
//   metricName: 'instance_jvm_young_gc_time',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const oldGCTime = {
//   id: '',
//   metricName: 'instance_jvm_old_gc_time',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const youngGCCount = {
//   id: '',
//   metricName: 'instance_jvm_young_gc_count',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const oldGCCount = {
//   id: '',
//   metricName: 'instance_jvm_young_gc_count',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const heap = {
//   id: '',
//   metricName: 'instance_jvm_memory_heap',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const maxHeap = {
//   id: '',
//   metricName: 'instance_jvm_memory_heap',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const nonheap = {
//   id: '',
//   metricName: 'instance_jvm_memory_noheap',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const maxNonHeap = {
//   id: '',
//   metricName: 'instance_jvm_memory_noheap_max',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const envoyTotal = {
//   id: '',
//   metricName: 'envoy_total_connections_used',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

// export const envoyParent = {
//   id: '',
//   metricName: 'envoy_parent_connections_used',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };

export const instanceEnvoyHeap = {
  id: '',
  metricName: 'envoy_heap_memory_max_used',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};
export const instanceClrHeap = {
  id: '',
  metricName: 'instance_clr_heap_memory',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};
export const instanceClrCPU = {
  id: '',
  metricName: 'instance_clr_cpu',
  queryMetricType: 'readMetricsValues',
  currentService: '',
  entityType: 'ServiceInstance',
  independentSelector: false,
  metricType: 'REGULAR_VALUE',
  version: '',
};
// export const clrGCGen0 = {
//   id: '',
//   metricName: 'instance_clr_gen0_collect_count',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };
// export const clrGCGen1 = {
//   id: '',
//   metricName: 'instance_clr_gen1_collect_count',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
//   independentSelector: false,
//   metricType: 'REGULAR_VALUE',
//   version: '',
// };
// export const clrGCGen2 = {
//   id: '',
//   metricName: 'instance_clr_gen2_collect_count',
//   queryMetricType: 'readMetricsValues',
//   currentService: '',
//   entityType: 'ServiceInstance',
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
  endpointSLAAvg,
  endpointThroughputAvg,
  endpointThroughput,
  endpointSLA,
  endpointResponseTime,
  endpointResponseTimeAvg,
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
  instanceGC,
  instanceGCCount,
  instanceHeap,
  instanceNonheap,
  instanceEnvoyCount,
  instanceClrGC,
  // youngGCTime,
  // oldGCTime,
  // youngGCCount,
  // oldGCCount,
};
