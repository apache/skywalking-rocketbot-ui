import { Traces, Trace, ServiceInstanceOption } from '../fragments/trace';

export const queryTraces =
  `query queryTraces(${Traces.variable}) {${Traces.query}}`;

export const queryTrace =
  `query queryTrace(${Trace.variable}) {${Trace.query}}`;

export const queryServiceInstance =
  `query queryServiceInstance(${ServiceInstanceOption.variable}) {${ServiceInstanceOption.query}}`;
