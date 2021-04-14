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

export enum TopologyType {
  TOPOLOGY_ENDPOINT = 'TOPOLOGY_ENDPOINT',
  TOPOLOGY_INSTANCE = 'TOPOLOGY_INSTANCE',
}

export enum ObjectsType {
  UPDATE_INSTANCES = 'UPDATE_INSTANCES',
  UPDATE_ENDPOINTS = 'UPDATE_ENDPOINTS',
  UPDATE_DASHBOARD = 'UPDATE_DASHBOARD',
}

export enum TimeType {
  MINUTE_TIME = 'MINUTE',
  HOUR_TIME = 'HOUR',
  DAY_TIME = 'DAY',
}

export enum PageEventsType {
  DASHBOARD_EVENTS = 'dashboardEvents',
  TOPO_ENDPOINT_EVENTS = 'topoEndpointEvents',
  TOPO_INSTANCE_EVENTS = 'topoInstanceEvents',
}
export enum PageTypes {
  DASHBOARD = 'Dashboard',
  LOG = 'Log',
}
