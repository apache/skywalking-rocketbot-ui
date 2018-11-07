import axios, { AxiosPromise } from 'axios';
import { Option } from '@/store/modules/options.ts';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';

const tag = '/api';

// 获取服务器详细信息
const getServerDetailGq = (duration: Duration, serverId:String) => (
{
  variables: {
    duration,
    serverId,
  },
  query:`query Application($serverId: ID!, $duration: Duration!) {
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
    axios.post(`${tag}/serverinfo`, getServerDetailGq(dateCook(duration), serverId));

// 获取服务器信息
const getServerInfoGq = (duration: Duration, serverId:String) => (
{
  variables: {
    duration,
    serverId,
  },
  query:`query Application($serverId: ID!, $duration: Duration!) {
    serverResponseTime:getServerResponseTimeTrend(serverId: $serverId, duration: $duration) {
      trendList
    }
    serverThroughput:getServerThroughputTrend(serverId: $serverId, duration: $duration) {
      trendList
    }
  }`,
});
export const getServerInfo = (
    duration: Duration,
    serverId: String,
  ): AxiosPromise<any> =>
    axios.post(`${tag}/serverinfo`, getServerInfoGq(dateCook(duration), serverId));

// 获取应用下信息
const getApplicationInfoGq = (duration: Duration) => (
{
  variables: {
    duration,
  },
  query: `query Dashboard($duration: Duration!) {
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
  axios.post(`${tag}/applicationinfo`, getApplicationInfoGq(dateCook(duration)));

// 获取服务下信息
const getServiceInfoGq = (duration: Duration, applicationId: String, service: Option) => (
{
  variables: {
    serviceId: service ? service.key : '',
    duration,
    traceCondition: {
      applicationId,
      operationName: service ? service.label : '',
      queryDuration: duration,
      traceState: 'ALL',
      queryOrder: 'BY_DURATION',
      paging: { pageNum:1, pageSize:5, needTotal: false },
    },
  },
  query: `query Service(
    $serviceId: ID!, $duration: Duration!, $traceCondition: TraceQueryCondition!) {
    responseTime:getServiceResponseTimeTrend(serviceId: $serviceId, duration: $duration) {
      trendList
    }
    throughput:getServiceThroughputTrend(serviceId: $serviceId, duration: $duration) {
      trendList
    }
    sla:getServiceSLATrend(serviceId: $serviceId, duration: $duration) {
      trendList
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
    getServiceTopology(serviceId: $serviceId, duration: $duration) {
      nodes {
        id
        name
        type
        ... on ServiceNode {
          sla
          calls
          numOfServiceAlarm
        }
      }
      calls {
        source
        target
        isAlert
        callType
        cpm
        avgResponseTime
      }
    }
  }`,
});
export const getServiceInfo = (
  duration: Duration,
  applicationId: String,
  service: Option,
): AxiosPromise<any> =>
  axios.post(`${tag}/serviceinfo`, getServiceInfoGq(dateCook(duration), applicationId, service));
