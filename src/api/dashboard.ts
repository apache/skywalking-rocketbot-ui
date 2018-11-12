import axios, { AxiosPromise } from 'axios';
import { Option } from '@/store/modules/options.ts';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';
import { cancelToken } from '@/utils/cancelToken';

const tag = '/api';
// 获取服务器信息
const searchAppGq = (endpointId:String) => (
{
  variables: {
    endpointId,
  },
  query: `query Info($endpointId: ID!) {
    endpointInfo: getEndpointInfo(endpointId: $endpointId) {
      key: id
      label: name
      serviceId
      serviceName
    }
  }`,
});
export const searchApp = (
    endpointId: String,
  ): AxiosPromise<any> =>
    axios.post(`${tag}/searchApp`, searchAppGq(endpointId), { cancelToken: cancelToken() });

// 获取服务器详细信息
const getServerDetailGq = (duration: Duration, serverId:String) => (
{
  variables: {
    duration,
    serverId,
  },
  query: window.localStorage.getItem('version') === '6' ?
  `query ServiceInstance($serverId: ID!, $duration: Duration!) {
    cpu: getLinearIntValues(metric: {
      name: "instance_jvm_cpu"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    youngGCCount: getLinearIntValues(metric: {
      name: "instance_jvm_young_gc_count"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    oldGCCount: getLinearIntValues(metric: {
      name: "instance_jvm_old_gc_count"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    youngGCTime: getLinearIntValues(metric: {
      name: "instance_jvm_young_gc_time"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    oldGCTime: getLinearIntValues(metric: {
      name: "instance_jvm_old_gc_time"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    heap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_heap"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    maxHeap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_heap_max"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    noheap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_noheap"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    maxNoheap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_noheap_max"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
  }`
  :
  `query Application($serverId: ID!, $duration: Duration!) {
    cpu:getCPUTrend(serverId: $serverId, duration: $duration) {
      cost
    }
    gc:getGCTrend(serverId: $serverId, duration: $duration) {
      youngGCCount
      oldGCount
      youngGCTime
      oldGCTime
    }
    memory:getMemoryTrend(serverId: $serverId, duration: $duration) {
      heap
      maxHeap
      noheap
      maxNoheap
    }
  }`,
});
export const getServerDetail = (
    duration: Duration,
    serverId: String,
  ): AxiosPromise<any> =>
    axios.post(`${tag}/serverinfo`, getServerDetailGq(dateCook(duration), serverId), { cancelToken: cancelToken() });

// 获取服务器信息
const getServerInfoGq = (duration: Duration, serverId:String) => (
{
  variables: {
    duration,
    serverId,
  },
  query: window.localStorage.getItem('version') === '6' ?
  `query ServiceInstance($serverId: ID!, $duration: Duration!) {
    serverResponseTime: getLinearIntValues(metric: {
      name: "service_instance_resp_time"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
    serverThroughput: getLinearIntValues(metric: {
      name: "service_instance_cpm"
      id: $serverId
    }, duration: $duration) {
      values {
        value
      }
    }
  }`
  :
  `query Application($serverId: ID!, $duration: Duration!) {
    serverResponseTime:getServerResponseTimeTrend(serverId: $serverId, duration: $duration) {
      values: trendList
    }
    serverThroughput:getServerThroughputTrend(serverId: $serverId, duration: $duration) {
      values: trendList
    }
  }`,
});
export const getServerInfo = (
    duration: Duration,
    serverId: String,
  ): AxiosPromise<any> =>
    axios.post(`${tag}/serverinfo`, getServerInfoGq(dateCook(duration), serverId), { cancelToken: cancelToken() });

// 获取应用下信息
const getApplicationInfoGq = (duration: Duration) => (
{
  variables: {
    duration,
  },
  query: window.localStorage.getItem('version') === '6' ?
  `query Dashboard($duration: Duration!) {
    slowService: getAllEndpointTopN(
      duration: $duration,
      name: "endpoint_avg",
      topN: 10,
      order: DES
    ) {
      key: id
      label: name
      value
    }
    applicationThroughput: getServiceTopN(
      duration: $duration,
      name: "service_cpm",
      topN: 10,
      order: DES
    ) {
      key: id
      label: name
      value
    }
    getP99: getLinearIntValues(metric: {
      name: "all_p99"
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "all_p95"
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "all_p90"
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "all_p75"
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "all_p50"
    }, duration: $duration) {
      values {
        value
      }
    }
  }`
  :
  `query Dashboard($duration: Duration!) {
    slowService: getTopNSlowService(duration: $duration, topN: 10) {
      service {
        key: id
        label: name
        applicationId
        applicationName
      }
      value: avgResponseTime
    }
    applicationThroughput: getTopNApplicationThroughput(duration: $duration, topN: 10) {
      key: applicationId
      label: applicationCode
      value: cpm
    }
  }`,
});
export const getApplicationInfo = (
  duration: Duration,
): AxiosPromise<any> =>
  axios.post(`${tag}/applicationinfo`, getApplicationInfoGq(dateCook(duration)), { cancelToken: cancelToken() });

// 获取服务下信息
const getEndpointInfoGq = (duration: Duration, applicationId: String, endpoint: Option) => (
{
  variables: {
    serviceId: endpoint ? endpoint.key : '',
    duration,
    traceCondition: {
      applicationId,
      operationName: endpoint ? endpoint.label : '',
      queryDuration: duration,
      traceState: 'ALL',
      queryOrder: 'BY_DURATION',
      paging: { pageNum:1, pageSize:8, needTotal: false },
    },
    traceConditionNew:  {
      endpointId:  endpoint ? endpoint.key : '',
      endpointName: endpoint ? endpoint.label : '',
      paging: { pageNum: 1, pageSize: 8, needTotal: false },
      queryDuration: duration,
      queryOrder: 'BY_DURATION',
      traceState: 'ALL',
    },
  },
  query: window.localStorage.getItem('version') === '6' ?
  `query Endpoint($serviceId: ID!, $duration: Duration!, $traceConditionNew: TraceQueryCondition!) {
    responseTime: getLinearIntValues(metric: {
      name: "endpoint_avg"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    throughput: getLinearIntValues(metric: {
      name: "endpoint_cpm"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    sla: getLinearIntValues(metric: {
      name: "endpoint_sla"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    slowTrace:queryBasicTraces(condition: $traceConditionNew) {
      traces {
        key: segmentId
        operationNames: endpointNames
        duration
        start
        isError
        traceIds
      }
      total
    }
    getP99: getLinearIntValues(metric: {
      name: "endpoint_p99"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "endpoint_p95"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "endpoint_p90"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "endpoint_p75"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "endpoint_p50"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
  }`
  :
  `query Service(
    $serviceId: ID!, $duration: Duration!, $traceCondition: TraceQueryCondition!) {
    responseTime:getServiceResponseTimeTrend(serviceId: $serviceId, duration: $duration) {
      values: trendList
    }
    throughput:getServiceThroughputTrend(serviceId: $serviceId, duration: $duration) {
      values: trendList
    }
    sla:getServiceSLATrend(serviceId: $serviceId, duration: $duration) {
      values: trendList
    }
    slowTrace:queryBasicTraces(condition: $traceCondition) {
      traces {
        key: segmentId
        operationNames
        duration
        start
        isError
        traceIds
      }
      total
    }
  }`,
});
export const getEndpointInfo = (
  duration: Duration,
  applicationId: String,
  endpoint: Option,
): AxiosPromise<any> =>
  axios.post(`${tag}/endpointinfo`, getEndpointInfoGq(dateCook(duration), applicationId, endpoint), { cancelToken: cancelToken() });
