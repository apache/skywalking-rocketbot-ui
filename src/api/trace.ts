import axios, { AxiosPromise } from 'axios';
import dateCook from '@/utils/dateCook';
import { cancelToken } from '@/utils/cancelToken';
/* eslint-disable */
const tag = '/api';

export const getTraces = (params): AxiosPromise<any> => {
  if (window.localStorage.getItem('version') === '6' && params.data.applicationId) {
    params.data.serviceId = params.data.applicationId;
    delete params.data.applicationId;
  } else if (window.localStorage.getItem('version') === '6' && params.data.operationName) {
    params.data.endpointNames = params.data.operationName;
    delete params.data.operationName;
  }
  return axios.post(`${tag}/trace`, {
    query: window.localStorage.getItem('version') === '6' ?
    `query BasicTraces($condition: TraceQueryCondition) {
      queryBasicTraces(condition: $condition) {
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
    }`
    :
    `query BasicTraces($condition: TraceQueryCondition) {
      queryBasicTraces(condition: $condition) {
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
    variables:{
      condition: {
        traceState: params.traceState,
        queryOrder: params.queryOrder,
        queryDuration: dateCook(params.date),
        ...params.data,
        paging:{
          pageNum:params.page,
          pageSize:15,
          needTotal:true,
        },
      },
    },
  });
};

// 获取链路表
export const getTraceSpans = (params): AxiosPromise<any> =>
    axios.post(`${tag}/spans`, {
      query: window.localStorage.getItem('version') === '6' ?
      `query Spans($traceId: ID!) {
        queryTrace(traceId: $traceId) {
          spans {
            traceId
            segmentId
            spanId
            parentSpanId
            refs {
              traceId
              parentSegmentId
              parentSpanId
              type
            }
            applicationCode: serviceCode
            startTime
            endTime
            operationName: endpointName
            type
            peer
            component
            isError
            layer
            tags {
              key
              value
            }
            logs {
              time
              data {
                key
                value
              }
            }
          }
        }
      }`
      :
      `query Spans($traceId: ID!) {
        queryTrace(traceId: $traceId) {
          spans {
            traceId
            segmentId
            spanId
            parentSpanId
            refs {
              traceId
              parentSegmentId
              parentSpanId
              type
            }
            applicationCode
            startTime
            endTime
            operationName
            type
            peer
            component
            isError
            layer
            tags {
              key
              value
            }
            logs {
              time
              data {
                key
                value
              }
            }
          }
        }
      }`,
      variables:{
        traceId:params,
      },
    });
