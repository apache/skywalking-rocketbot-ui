import axios, { AxiosPromise } from 'axios';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';
const tag = '/api';
// 获取应用
const getAppsGq = (duration: Duration) => (
{
  variables: {
    duration,
  },
  query: window.localStorage.getItem('version') === '6' ?
  `query ServiceOption($duration: Duration!) {
    applications: getAllServices(duration: $duration) {
      key: id
      label: name
    }
  }`
  :
  `query applications($duration: Duration!) {
    applications: getAllApplication(duration: $duration) {
      key: id
      label: name
    }
  }`,
});

export const getApps = (params: Duration): AxiosPromise<any> => {
  return axios.post(`${tag}/applications`, getAppsGq(dateCook(params)));
};
// 获取端点
const getEndpointsGq = (applicationId: String) => (
{
  variables:{
    applicationId,
    keyword: '',
  },
  query: window.localStorage.getItem('version') === '6' ?
  `query SearchEndpoint($applicationId: ID!, $keyword: String!) {
    endpoints: searchEndpoint(serviceId: $applicationId, keyword: $keyword, limit: 10) {
      key: id
      label: name
    }
  }`
  :
  `query SearchService($applicationId: ID!, $keyword: String!) {
    endpoints: searchService(applicationId: $applicationId, keyword: $keyword, topN: 10) {
      key: id
      label: name
    }
  }`,
});
export const getEndpoints = params => axios.post(`${tag}/endpoints`, getEndpointsGq(params));

// 获取服务器
const getServersGq = (duration: Duration, applicationId: String) => (
{
  variables: {
    duration,
    applicationId,
  },
  query: window.localStorage.getItem('version') === '6' ?
  `query Service($applicationId: ID!, $duration: Duration!) {
    serviceSlowEndpoint: getEndpointTopN(
      serviceId: $applicationId
      duration: $duration
      name: "endpoint_avg",
      topN: 10,
      order: DES
    ) {
      key: id
      label: name
      value
    }
    getServiceInstanceThroughput: getServiceInstanceTopN(
      serviceId: $applicationId
      duration: $duration
      name: "service_instance_cpm",
      topN: 10,
      order: DES
    ) {
      key: id
      name
      value
    }
    getP99: getLinearIntValues(metric: {
      name: "service_p99"
      id: $applicationId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "service_p95"
      id: $applicationId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "service_p90"
      id: $applicationId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "service_p75"
      id: $applicationId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "service_p50"
      id: $applicationId
    }, duration: $duration) {
      values {
        value
      }
    }
    servers:  getServiceInstances(duration: $duration, serviceId: $applicationId) {
      key: id
      name
      attributes {
        name
        value
      }
    }
  }`
  :
  `query Application($applicationId: ID!, $duration: Duration!) {
    serviceSlowEndpoint: getSlowService(applicationId: $applicationId, duration: $duration, topN: 10) {
      service {
        key: id
        label: name
        applicationId
        applicationName
      }
      value: avgResponseTime
    }
    servers: getServerThroughput(
      applicationId: $applicationId,
      duration: $duration,
      topN: 999999) {
      key: id
      osName
      host
      pid
      ipv4
      value: cpm
    }
  }`,
});
export const getServers = (
  duration: Duration,
  applicationId: String,
): AxiosPromise<any> =>
  axios.post(`${tag}/infos`, getServersGq(dateCook(duration), applicationId));
