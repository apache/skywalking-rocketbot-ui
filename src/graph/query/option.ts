import { Services, Endpoints, Instances } from '../fragments/option';

export const queryServices =
  `query queryServices(${Services.variable}) {${Services.query}}`;

export const queryEndpoints =
  `query queryEndpoints(${Endpoints.variable}) {${Endpoints.query}}`;

export const queryInstances =
  `query queryInstances(${Instances.variable}) {${Instances.query}}`;
