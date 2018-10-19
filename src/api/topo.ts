import axios, { AxiosPromise } from 'axios';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';
/* eslint-disable */
const tag = '/api';

// 获取拓扑图
const getTopoGq = (duration: Duration) => (
{
  variables: {
    duration,
  },
  query:`query Topology($duration: Duration!) {
    getClusterTopology(duration: $duration) {
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
  }
`});
export const getTopo = (duration: Duration): AxiosPromise<any> =>
  axios.post(`${tag}/topo`,  getTopoGq(dateCook(duration)));

// 获取应用拓扑图
const getTopoAppGq = (duration: Duration, applicationId:String) => (
{
  variables: {
    duration,
    applicationId,
  },
  query:`query Application($applicationId: ID!, $duration: Duration!) {
    getApplicationTopology(applicationId: $applicationId, duration: $duration) {
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
  }
`});

interface TopoApp {
  duration: Duration;
  applicationId: String;
}
export const getTopoApp = (params: TopoApp): AxiosPromise<any> =>
  axios.post(`${tag}/topo/application`,  getTopoAppGq(dateCook(params.duration), params.applicationId));

// 获取应用下信息
const getClusterBriefGq = (duration: Duration) => (
{
  variables: {
    duration,
  },
  query: `query Dashboard($duration: Duration!) {
    getClusterBrief(duration: $duration) {
      numOfApplication
      numOfService
      numOfDatabase
      numOfCache
      numOfMQ
    }
  }`,
});
export const getClusterBrief = (
  duration: Duration,
): AxiosPromise<any> =>
  axios.post(`${tag}/clusterbrief`, getClusterBriefGq(dateCook(duration)));
