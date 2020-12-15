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

import { Services, BrowserServices, Endpoints, Instances, Database, OAPTimeInfo } from '../fragments/option';

export const queryServices = `query queryServices(${Services.variable}) {${Services.query}}`;

export const queryBrowserServices = `query queryBrowserServices(
  ${BrowserServices.variable}) {${BrowserServices.query}}`;

export const queryDatabases = `query queryDatabases(${Database.variable}) {${Database.query}}`;

export const queryEndpoints = `query queryEndpoints(${Endpoints.variable}) {${Endpoints.query}}`;

export const queryInstances = `query queryInstances(${Instances.variable}) {${Instances.query}}`;

export const queryOAPTimeInfo = `query queryOAPTimeInfo {${OAPTimeInfo.query}}`;
