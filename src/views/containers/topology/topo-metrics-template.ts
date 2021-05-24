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
export const TopoServiceMetricsConfig: any = {
  name: 'Topology Service',
  type: 'TOPOLOGY_SERVICE',
  configuration: {
    SpringMVC: [
      {
        width: 12,
        title: 'Service Apdex',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_apdex',
        queryMetricType: 'readMetricsValue',
        chartType: 'ChartNum',
        aggregation: '/',
        aggregationNum: '10000',
      },
      {
        width: 12,
        title: 'Service Avg Response Time',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_resp_time',
        queryMetricType: 'readMetricsValues',
        chartType: 'ChartLine',
        unit: 'ms',
      },
      {
        width: 12,
        title: 'Successful Rate',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_sla',
        queryMetricType: 'readMetricsValue',
        chartType: 'ChartNum',
        unit: '%',
        aggregation: '/',
        aggregationNum: '100',
      },
      {
        width: 12,
        title: 'Service Load',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_cpm',
        queryMetricType: 'readMetricsValue',
        chartType: 'ChartNum',
        unit: 'CPM - calls per minute',
      },
      {
        width: 12,
        title: 'Service Apdex',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_apdex',
        queryMetricType: 'readMetricsValues',
        chartType: 'ChartLine',
        aggregation: '/',
        aggregationNum: '10000',
      },
      {
        width: 12,
        title: 'Service Response Time Percentile',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'LABELED_VALUE',
        metricName: 'service_percentile',
        queryMetricType: 'readLabeledMetricsValues',
        chartType: 'ChartLine',
        unit: 'ms',
        metricLabels: 'P50, P75, P90, P95, P99',
        labelsIndex: '0, 1, 2, 3, 4',
      },
      {
        width: 12,
        title: 'Successful Rate',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_sla',
        queryMetricType: 'readMetricsValues',
        chartType: 'ChartLine',
        unit: '%',
        aggregation: '/',
        aggregationNum: '100',
      },
      {
        width: 12,
        title: 'Service Load',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_cpm',
        queryMetricType: 'readMetricsValues',
        chartType: 'ChartLine',
        unit: 'CPM - calls per minute',
      },
    ],
    Nginx: [
      {
        width: 12,
        title: 'Service Load',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_cpm',
        queryMetricType: 'readMetricsValue',
        chartType: 'ChartNum',
        unit: 'CPM - calls per minute',
      },
      {
        width: 12,
        title: 'Service Apdex',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_apdex',
        queryMetricType: 'readMetricsValues',
        chartType: 'ChartLine',
        aggregation: '/',
        aggregationNum: '10000',
      },
      {
        width: 12,
        title: 'Service Response Time Percentile',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'LABELED_VALUE',
        metricName: 'service_percentile',
        queryMetricType: 'readLabeledMetricsValues',
        chartType: 'ChartLine',
        unit: 'ms',
        metricLabels: 'P50, P75, P90, P95, P99',
        labelsIndex: '0, 1, 2, 3, 4',
      },
      {
        width: 12,
        title: 'Successful Rate',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_sla',
        queryMetricType: 'readMetricsValues',
        chartType: 'ChartLine',
        unit: '%',
        aggregation: '/',
        aggregationNum: '100',
      },
      {
        width: 12,
        title: 'Service Load',
        height: '200',
        entityType: 'Service',
        independentSelector: false,
        metricType: 'REGULAR_VALUE',
        metricName: 'service_cpm',
        queryMetricType: 'readMetricsValues',
        chartType: 'ChartLine',
        unit: 'CPM - calls per minute',
      },
    ],
  },
};

export const TopoServiceDependencyMetricsConfig: any = {
  name: 'Topology Service Dependency',
  type: 'TOPOLOGY_SERVICE_DEPENDENCY',
  configuration: {
    SpringMVC: {
      server: [
        {
          width: 12,
          title: 'Service Response Time Percentile',
          height: 200,
          entityType: 'ServiceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_relation_server_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Load',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
      ],
      client: [
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Load',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Response Time Percentile',
          height: 200,
          entityType: 'ServiceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_relation_client_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
      ],
    },
    Nginx: {
      server: [
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceRelation',
          independentSelector: false,
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Response Time Percentile',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_relation_server_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
        {
          width: 12,
          title: 'Service Load',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Successful Rate',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_call_sla',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: '%',
          aggregation: '/',
          aggregationNum: '100',
        },
      ],
      client: [
        {
          width: 12,
          title: 'Service Response Time Percentile',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_relation_client_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Successful Rate',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_call_sla',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: '%',
          aggregation: '/',
          aggregationNum: '100',
        },
        {
          width: 12,
          title: 'Service Load',
          height: '200',
          entityType: 'ServiceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
      ],
    },
  },
};

export const TopoServiceInstanceDependencyMetricsConfig: any = {
  name: 'Topology Service Dependency',
  type: 'TOPOLOGY_SERVICE_DEPENDENCY',
  configuration: {
    SpringMVC: {
      server: [
        {
          width: 12,
          title: 'Successful Rate',
          height: 200,
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_instance_relation_server_call_sla',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: '',
        },
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_instance_relation_server_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: '',
        },
        {
          width: 12,
          title: 'Service Load',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_instance_relation_server_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Instance Response Time Percentile',
          height: 200,
          entityType: 'ServiceInstanceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_instance_relation_server_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
      ],
      client: [
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_instance_relation_client_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Instance Load',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_instance_relation_client_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Instance Response Time Percentile',
          height: 200,
          entityType: 'ServiceInstanceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_instance_relation_client_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
      ],
    },
    Nginx: {
      server: [
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          independentSelector: false,
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Service Response Time Percentile',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_relation_server_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
        {
          width: 12,
          title: 'Service Load',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Successful Rate',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_server_call_sla',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: '%',
          aggregation: '/',
          aggregationNum: '100',
        },
      ],
      client: [
        {
          width: 12,
          title: 'Service Response Time Percentile',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'LABELED_VALUE',
          metricName: 'service_relation_client_percentile',
          queryMetricType: 'readLabeledMetricsValues',
          chartType: 'ChartLine',
          unit: 'ms',
          metricLabels: 'P50, P75, P90, P95, P99',
          labelsIndex: '0, 1, 2, 3, 4',
        },
        {
          width: 12,
          title: 'Response Time',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_resp_time',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
        {
          width: 12,
          title: 'Successful Rate',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_call_sla',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: '%',
          aggregation: '/',
          aggregationNum: '100',
        },
        {
          width: 12,
          title: 'Service Load',
          height: '200',
          entityType: 'ServiceInstanceRelation',
          metricType: 'REGULAR_VALUE',
          metricName: 'service_relation_client_cpm',
          queryMetricType: 'readMetricsValues',
          chartType: 'ChartLine',
          unit: 'CPM - calls per minute',
        },
      ],
    },
  },
};
