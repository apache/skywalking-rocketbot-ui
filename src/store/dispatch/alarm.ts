import store from '../index';
import { AlarmParams } from '@/store/modules/alarm.ts';

export const getAlarm = (alarm:AlarmParams): void => {
  store.dispatch('alarm/GET_ALARM', alarm);
};
