import { Alarm } from '../fragments/alarm';

export const queryAlarms =
  `query queryAlarms(${Alarm.variable}) {${Alarm.query}}`;
