import { DashBoardGlobal } from '../fragments/dashboard-global';
import { DashBoardService } from '../fragments/dashboard-service';
import { DashBoardEndpoint } from '../fragments/dashboard-endpoint';
import { DashBoardInstance } from '../fragments/dashboard-instance';

export const queryDashBoardGlobal =
  `query queryDashBoardGlobal(${DashBoardGlobal.variable}) {${DashBoardGlobal.query}}`;

export const queryDashBoardService =
  `query queryDashBoardService(${DashBoardService.variable}) {${DashBoardService.query}}`;

export const queryDashBoardEndpoint =
  `query queryDashBoardEndpoint(${DashBoardEndpoint.variable}) {${DashBoardEndpoint.query}}`;

export const queryDashBoardInstance =
  `query queryDashBoardInstance(${DashBoardInstance.variable}) {${DashBoardInstance.query}}`;
