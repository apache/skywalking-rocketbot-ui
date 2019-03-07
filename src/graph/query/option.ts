import { Services, Endpoints, Instances, Database } from '../fragments/option';

export const queryServices =
  `query queryServices(${Services.variable}) {${Services.query}}`;

export const queryDatabases =
  `query queryDatabases(${Database.variable}) {${Database.query}}`;

export const queryEndpoints =
  `query queryEndpoints(${Endpoints.variable}) {${Endpoints.query}}`;

export const queryInstances =
  `query queryInstances(${Instances.variable}) {${Instances.query}}`;
