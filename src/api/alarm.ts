import axios, { AxiosPromise } from 'axios';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';
import { cancelToken } from '@/utils/cancelToken';
/* eslint-disable */
const tag = '/api';
// 获取告警
const getAlarmGq = (duration: Duration, paging:Number, type:String) => {
  const rule = {
    APPLICATION : 'Service',
    SERVER : 'ServiceInstance',
    SERVICE : 'Endpoint',
  };
  const scope = rule[type.toString()];
  return {
    variables: {
      duration,
      alarmType:type,
      paging:{
        pageNum:paging,
        pageSize: 10,
        needTotal: true,
      },
      scope,
    },
    query: window.localStorage.getItem('version') === '6' ?
    `query Alarm($keyword: String, $scope: Scope, $duration:Duration!, $paging: Pagination!){
      alarmList: getAlarm(keyword: $keyword, scope: $scope, duration: $duration, paging: $paging) {
        items: msgs {
          key: id
          message
          startTime
        }
        total
      }
    }`
    :
    `query Alarm( $keyword: String, $alarmType: AlarmType, $duration:Duration!, $paging: Pagination!){
        alarmList:loadAlarmList(keyword: $keyword,alarmType: $alarmType,duration: $duration,paging: $paging) {
          items {
            key: id
            title
            content
            startTime
            causeType
          }
          total
        }
      }
  `};
};
export const getAlarm = (
    duration: Duration,
    type: String,
    paging: Number,
  ): AxiosPromise<any> =>
    axios.post(`${tag}/alarm`, getAlarmGq(dateCook(duration), paging, type), { cancelToken: cancelToken() });
