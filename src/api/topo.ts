import axios, { AxiosPromise } from 'axios';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';
import { cancelToken } from '@/utils/cancelToken';
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
const getTopo5 = (duration: Duration): AxiosPromise<any> =>
  axios.post(`${tag}/topo`,  getTopoGq(dateCook(duration)), { cancelToken: cancelToken() });

// 6.x topology
const getTopo6Gq = (duration: Duration) => (
{
  variables: {
    duration,
  },
  query:`query Topology($duration: Duration!) {
    getClusterTopology:getGlobalTopology(duration: $duration) {
      nodes {
        id
        name
        type
        isReal
      }
      calls {
        id
        source
        target
        callType
        detectPoint
      }
    }
  }`});
  // 6.x topology metric
const getTopo6MetricGq = (duration: Duration, ids:String[]) => (
{
  variables: {
    duration,
    ids,
  },
  query:`query TopologyMetric($duration: Duration!, $ids: [ID!]!) {
    sla: getValues(metric: {
      name: "service_sla"
      ids: $ids
    }, duration: $duration) {
      values {
        id
        sla:value
      }
    }
    cpm: getValues(metric: {
      name: "service_cpm"
      ids: $ids
    }, duration: $duration) {
      values {
        cpm: value
      }
    }
    latency: getValues(metric: {
      name: "service_resp_time"
      ids: $ids
    }, duration: $duration) {
      values {
        latency:value
      }
    }
  }`});
 // 6.x topology server metric
const getTopo6ServerMetricGq = (duration: Duration, idsS:String[]) => (
{
  variables: {
    duration,
    idsS,
  },
  query:`query TopologyServerMetric($duration: Duration!, $idsS: [ID!]!) {
    cpm: getValues(metric: {
      name: "service_relation_server_cpm"
      ids: $idsS
    }, duration: $duration) {
      values {
        id
        cpm:value
      }
    }
    latency: getValues(metric: {
      name: "service_relation_client_resp_time"
      ids: $idsS
    }, duration: $duration) {
      values {
        latency: value
      }
    }
  }`});
// 6.x topology client metric
const getTopo6ClientMetricGq = (duration: Duration, idsC:String[]) => (
{
  variables: {
    duration,
    idsC,
  },
  query:`query TopologyClientMetric($duration: Duration!, $idsC: [ID!]!) {
    cpm: getValues(metric: {
      name: "service_relation_client_cpm"
      ids: $idsC
    }, duration: $duration) {
      values {
        id
        cpm: value
      }
    }
    latency: getValues(metric: {
      name: "service_relation_client_resp_time"
      ids: $idsC
    }, duration: $duration) {
      values {
        latency: value
      }
    }
  }`});
const getTopo6 = (duration: Duration): any => {
  return new Promise((resolve) => {
    axios.post(`${tag}/topo`,  getTopo6Gq(dateCook(duration)), { cancelToken: cancelToken() }).then((res) => {
      const result = res;
      const data = result.data.data.getClusterTopology;
      axios.all([
        axios.post(`${tag}/topoMetric`,  getTopo6MetricGq(dateCook(duration), data.nodes.map(i => i.id))),
        axios.post(`${tag}/topoServerMetric`,  getTopo6ServerMetricGq(dateCook(duration), data.calls.filter(i => i.detectPoint === 'SERVER').map(i => i.id))),
        axios.post(`${tag}/topoClientMetric`,  getTopo6ClientMetricGq(dateCook(duration), data.calls.filter(i => i.detectPoint !== 'SERVER').map(i => i.id))),
      ]).then(axios.spread((metric, serverMetric, clientMetric) => {
        for (let i = 0; i < metric.data.data['sla'].values.length; i += 1) {
          for (let j = 0; j < data.nodes.length; j += 1) {
            if (data.nodes[j].id === metric.data.data.sla.values[i].id) {
              data.nodes[j] = {
                ...data.nodes[j],
                ...metric.data.data.sla.values[i],
                ...metric.data.data.cpm.values[i],
                ...metric.data.data.latency.values[i],
              };
            }
          }
        }
        for (let i = 0; i < serverMetric.data.data['cpm'].values.length; i += 1) {
          for (let j = 0; j < data.calls.length; j += 1) {
            if (data.calls[j].id === serverMetric.data.data.cpm.values[i].id) {
              data.calls[j] = {
                ...data.calls[j],
                ...serverMetric.data.data.cpm.values[i],
                ...serverMetric.data.data.latency.values[i],
              };
            }
          }
        }
        for (let i = 0; i < clientMetric.data.data['cpm'].values.length; i += 1) {
          for (let j = 0; j < data.calls.length; j += 1) {
            if (data.calls[j].id === clientMetric.data.data.cpm.values[i].id) {
              data.calls[j] = {
                ...data.calls[j],
                ...clientMetric.data.data.cpm.values[i],
                ...clientMetric.data.data.latency.values[i],
              };
            }
          }
        }
        resolve(result);
      }));
    });
  });
};

export const getTopo = (duration: Duration) => {
  return window.localStorage.getItem('version') === '6' ? getTopo6(duration) : getTopo5(duration);
};

// 获取应用拓扑图
const getTopoAppGq = (duration: Duration, applicationId:String) => (
{
  variables: {
    duration,
    applicationId,
  },
  query:`query Application($applicationId: ID!, $duration: Duration!) {
    getClusterTopology: getApplicationTopology(applicationId: $applicationId, duration: $duration) {
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
const getTopoApp5 = (params: TopoApp): AxiosPromise<any> =>
  axios.post(`${tag}/topo/application`,  getTopoAppGq(dateCook(params.duration), params.applicationId));

const getTopoApp6Gq = (duration: Duration, applicationId:String) => (
{
  variables: {
    duration,
    applicationId,
  },
  query:`query Service($applicationId: ID!, $duration: Duration!) {
    getClusterTopology: getServiceTopology(serviceId: $applicationId, duration: $duration) {
      nodes {
        id
        name
        type
        isReal
      }
      calls {
        id
        source
        target
        callType
        detectPoint
      }
    }
  }`});
const getTopoApp6 = (params: TopoApp): any => {
  return new Promise((resolve) => {
    axios.post(`${tag}/topo`,  getTopoApp6Gq(dateCook(params.duration), params.applicationId), { cancelToken: cancelToken() }).then((res) => {
      const result = res;
      const data = result.data.data.getClusterTopology;
      axios.all([
        axios.post(`${tag}/topoMetric`,  getTopo6MetricGq(dateCook(params.duration), data.nodes.map(i => i.id))),
        axios.post(`${tag}/topoServerMetric`,  getTopo6ServerMetricGq(dateCook(params.duration), data.calls.filter(i => i.detectPoint === 'SERVER').map(i => i.id))),
        axios.post(`${tag}/topoClientMetric`,  getTopo6ClientMetricGq(dateCook(params.duration), data.calls.filter(i => i.detectPoint !== 'SERVER').map(i => i.id))),
      ]).then(axios.spread((metric, serverMetric, clientMetric) => {
        for (let i = 0; i < metric.data.data['sla'].values.length; i += 1) {
          for (let j = 0; j < data.nodes.length; j += 1) {
            if (data.nodes[j].id === metric.data.data.sla.values[i].id) {
              data.nodes[j] = {
                ...data.nodes[j],
                ...metric.data.data.sla.values[i],
                ...metric.data.data.cpm.values[i],
                ...metric.data.data.latency.values[i],
              };
            }
          }
        }
        if (serverMetric.data.data.cpm) {
          for (let i = 0; i < serverMetric.data.data['cpm'].values.length; i += 1) {
            for (let j = 0; j < data.calls.length; j += 1) {
              if (data.calls[j].id === serverMetric.data.data.cpm.values[i].id) {
                data.calls[j] = {
                  ...data.calls[j],
                  ...serverMetric.data.data.cpm.values[i],
                  ...serverMetric.data.data.latency.values[i],
                };
              }
            }
          }
        }
        if (clientMetric.data.data.cpm) {
          for (let i = 0; i < clientMetric.data.data['cpm'].values.length; i += 1) {
            for (let j = 0; j < data.calls.length; j += 1) {
              if (data.calls[j].id === clientMetric.data.data.cpm.values[i].id) {
                data.calls[j] = {
                  ...data.calls[j],
                  ...clientMetric.data.data.cpm.values[i],
                  ...clientMetric.data.data.latency.values[i],
                };
              }
            }
          }
        }
        resolve(result);
      }));
    });
  });
};
export const getTopoApp = (params: TopoApp) => {
  return window.localStorage.getItem('version') === '6' ? getTopoApp6(params) : getTopoApp5(params);
};
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
  axios.post(`${tag}/clusterbrief`, getClusterBriefGq(dateCook(duration)), { cancelToken: cancelToken() });
