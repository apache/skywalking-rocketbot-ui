import store from '../index';
import dateCook from '@/utils/dateCook';
import { registerMap } from 'echarts';

export const getTraces = (params: any): void => {
  let step = 'MINUTE';
  const unix = Math.round(params.time[1].getTime()) - Math.round(params.time[0].getTime());
  if (unix <= 60 * 60 * 1000) {
    step = 'MINUTE';
  } else if (unix <= 24 * 60 * 60 * 1000) {
    step = 'HOUR';
  } else if (unix <= 30 * 24 * 60 * 60 * 1000) {
    step = 'DAY';
  } else {
    step = 'MONTH';
  }
  const temp = JSON.parse(JSON.stringify(params));
  temp.date = { start: params.time[0], end: params.time[1], step };
  if (temp.data.applicationId === 'ALL') delete temp.data.applicationId;
  if (temp.maxTraceDuration !== '') temp.data.maxTraceDuration = temp.maxTraceDuration;
  if (temp.minTraceDuration !== '') temp.data.minTraceDuration = temp.minTraceDuration;
  if (temp.operationName !== '') temp.data.operationName = temp.operationName;
  if (temp.traceId !== '') temp.data.traceId = temp.traceId;
  store.dispatch('trace/GET_TRACES', temp);
};

export const getSpans = (params: any): void => {
  store.dispatch('trace/GET_SPANS', params);
};
