import axios, { AxiosPromise } from 'axios';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';
/* eslint-disable */
const tag = '/api';

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
