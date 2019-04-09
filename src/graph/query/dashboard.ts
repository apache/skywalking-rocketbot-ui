/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DashBoardGlobal } from '../fragments/dashboard-global';
import { DashBoardService } from '../fragments/dashboard-service';
import { DashBoardEndpoint, DashBoardEndpointTopo } from '../fragments/dashboard-endpoint';
import { DashBoardInstance } from '../fragments/dashboard-instance';
import { DashBoardDatabase } from '../fragments/dashboard-database';

export const queryDashBoardGlobal =
  `query queryDashBoardGlobal(${DashBoardGlobal.variable}) {${DashBoardGlobal.query}}`;

export const queryDashBoardService =
  `query queryDashBoardService(${DashBoardService.variable}) {${DashBoardService.query}}`;

export const queryDashBoardEndpoint =
  `query queryDashBoardEndpoint(${DashBoardEndpoint.variable}) {${DashBoardEndpoint.query}}`;

export const queryDashBoardEndpointTopo =
  `query DashBoardEndpointTopo(${DashBoardEndpointTopo.variable}) {${DashBoardEndpointTopo.query}}`;

export const queryDashBoardInstance =
  `query queryDashBoardInstance(${DashBoardInstance.variable}) {${DashBoardInstance.query}}`;

export const queryDashBoardDatabase =
  `query queryDashBoardDatabase(${DashBoardDatabase.variable}) {${DashBoardDatabase.query}}`;
