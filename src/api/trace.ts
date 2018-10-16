import axios, { AxiosPromise } from 'axios';
import dateCook from '@/utils/dateCook';
/* eslint-disable */
const tag = '/api';

export const getTraces = (params): AxiosPromise<any> =>
  axios.post(`${tag}/trace`, {
    query:
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

// 获取链路表
export const getTraceSpans = (params): AxiosPromise<any> =>
    axios.post(`${tag}/spans`, {
      query:
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
