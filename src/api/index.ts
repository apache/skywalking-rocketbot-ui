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
  query:
  `
  query applications($duration: Duration!) {
    applications: getAllApplication(duration: $duration) {
      key: id
      label: name
    }
  }
  `,
});
export const getApps = (params: Duration): AxiosPromise<any> => {
  return axios.post(`${tag}/applications`, getAppsGq(dateCook(params)));
};

// 获取服务
const getServicesGq = (applicationId: String) => (
{
  variables:{
    applicationId,
    keyword: '',
  },
  query:`query SearchService($applicationId: ID!, $keyword: String!) {
    services: searchService(applicationId: $applicationId, keyword: $keyword, topN: 10) {
      key: id
      label: name
    }
  }`,
});
export const getServices = params => axios.post(`${tag}/services`, getServicesGq(params));

// 获取应用下信息
const getServersGq = (duration: Duration, applicationId: String) => (
{
  variables: {
    duration,
    applicationId,
  },
  query:`query Application($applicationId: ID!, $duration: Duration!) {
    slowService: getSlowService(
      applicationId: $applicationId,
      duration: $duration,
      topN: 10) {
      service {
        key: id
        label: name
        applicationId
        applicationName
      }
      value: avgResponseTime
    }
    server: getServerThroughput(
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
    applicationTopology: getApplicationTopology(
      applicationId: $applicationId,
      duration: $duration) {
      nodes {
        id
        name
        type
        ... on ApplicationNode {
          sla
          cpm
          avgResponseTime
          apdex
          isAlarm
          numOfServer
          numOfServerAlarm
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
export const getServers = (
  duration: Duration,
  applicationId: String,
): AxiosPromise<any> =>
  axios.post(`${tag}/infos`, getServersGq(dateCook(duration), applicationId));
