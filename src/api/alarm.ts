import axios, { AxiosPromise } from 'axios';
import { Duration } from '@/store/interfaces/options';
import dateCook from '@/utils/dateCook';

/* eslint-disable */
const tag = '/api';

// 获取告警
const getAlarmGq = (duration: Duration, paging:Number, type:String) => (
{
  variables: {
    duration,
    alarmType:type,
    paging:{
      pageNum:paging,
      pageSize: 10,
      needTotal: true,
    },
  },
  query:`
    query Alarm( $keyword: String, $alarmType: AlarmType, $duration:Duration!, $paging: Pagination!){
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
`});
export const getAlarm = (
    duration: Duration,
    type: String,
    paging: Number,
  ): AxiosPromise<any> =>
    axios.post(`${tag}/alarm`, getAlarmGq(dateCook(duration), paging, type));
