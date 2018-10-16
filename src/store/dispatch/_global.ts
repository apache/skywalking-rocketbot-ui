import store from '@/store';
import { Duration } from '@/store/interfaces/options';

const globalTimeFormate = (time: Date[]):Duration => {
  let step = 'MINUTE';
  const unix = Math.round(time[1].getTime()) - Math.round(time[0].getTime());
  if (unix <= 60 * 60 * 1000) {
    step = 'MINUTE';
  } else if (unix <= 24 * 60 * 60 * 1000) {
    step = 'HOUR';
  } else if (unix <= 30 * 24 * 60 * 60 * 1000) {
    step = 'DAY';
  } else {
    step = 'MONTH';
  }
  return { start: time[0], end: time[1], step };
};

export const setDuration = (time: Date[]): void => {
  store.dispatch('SET_DURATION', globalTimeFormate(time));
};
