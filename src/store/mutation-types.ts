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

// comp
export const SET_CURRENT_GROUP = 'SET_CURRENT_GROUP';
export const SET_CURRENT_COMPS = 'SET_CURRENT_COMPS';
export const ADD_COMPS_GROUP = 'ADD_COMPS_GROUP';
export const ADD_COMPS_TREE = 'ADD_COMPS_TREE';
export const DELETE_COMPS_GROUP = 'DELETE_COMPS_GROUP';
export const DELETE_COMPS_TREE = 'DELETE_COMPS_TREE';
export const ADD_COMP = 'ADD_COMP';
export const DELETE_COMP = 'DELETE_COMP';
export const SET_COMPS_TREE = 'SET_COMPS_TREE';
export const SWICH_CURRENTCOMP = 'SWICH_CURRENTCOMP';
export const EDIT_COMP = 'EDIT_COMP';
export const SET_GROUP_QUERY = 'SET_GROUP_QUERY';

// global
export const SET_DURATION = 'SET_DURATION';
export const RESET_DURATION = 'RESET_DURATION';
export const SET_EVENTS = 'SET_EVENTS';
export const RUN_EVENTS = 'RUN_EVENTS';
export const SET_CHARTS = 'SET_CHARTS';
export const CLEAR_CHARTS = 'CLEAR_CHARTS';
export const SET_LOCK = 'SET_LOCK';
export const SET_EDIT = 'SET_EDIT';
export const SET_UTC = 'SET_UTC';

// dashboard
export const SET_GLOBAL = 'SET_GLOBAL';
export const CLEAR_GLOBAL = 'CLEAR_GLOBAL';
export const SET_SERVICES = 'SET_SERVICES';
export const SET_DATABASES = 'SET_DATABASES';
export const SET_DATABASE_INFO = 'SET_DATABASE_INFO';
export const SET_CURRENT_DATABASE = 'SET_CURRENT_DATABASE';
export const SET_CURRENT_SERVICE = 'SET_CURRENT_SERVICE';
export const SET_SERVICE_INFO = 'SET_SERVICE_INFO';
export const SET_ENDPOINTS = 'SET_ENDPOINTS';
export const SET_CURRENT_ENDPOINT = 'SET_CURRENT_ENDPOINT';
export const SET_ENDPOINT_INFO = 'SET_ENDPOINT_INFO';
export const SET_INSTANCES = 'SET_INSTANCES';
export const SET_CURRENT_INSTANCE = 'SET_CURRENT_INSTANCE';
export const SET_INSTANCE_INFO = 'SET_INSTANCE_INFO';

// alarm
export const SET_ALARM = 'SET_ALARM';
export const CLEAR_ALARM = 'CLEAR_ALARM';

// trace
export const SET_TRACELIST = 'SET_TRACELIST';
export const SET_TRACELIST_TOTAL = 'SET_TRACELIST_TOTAL';
export const SET_TRACE_SPANS = 'SET_TRACE_SPANS';
export const SET_CURRENT_TRACE = 'SET_CURRENT_TRACE';
export const SET_TRACE_FORM = 'SET_TRACE_FORM';
export const SET_TRACE_FORM_ITEM = 'SET_TRACE_FORM_ITEM';
export const SET_DEFAULT_EMPTY_TRACE = 'SET_DEFAULT_EMPTY_TRACE';
export const SET_TRACE_LOGS = 'SET_TRACE_LOGS';
export const SET_TRACE_LOGS_TOTAL = 'SET_TRACE_LOGS_TOTAL';
export const SET_TRACE_SPAN_LOGS_TOTAL = 'SET_TRACE_SPAN_LOGS_TOTAL';
export const SET_TRACE_SPAN_LOGS = 'SET_TRACE_SPAN_LOGS';

// topo
export const SET_TOPO = 'SET_TOPO';
export const SET_NODE = 'SET_NODE';
export const SET_MODE = 'SET_MODE';
export const SET_TOPO_RELATION = 'SET_TOPO_RELATION';
export const SET_CALLBACK = 'SET_CALLBACK';
export const SET_MODE_STATUS = 'SET_MODE_STATUS';
export const SET_HONEYCOMB_NODE = 'SET_HONEYCOMB_NODE';
export const SET_SHOW_DIALOG = 'SET_SHOW_DIALOG';
export const SET_INSTANCE_DEPENDENCY = 'SET_INSTANCE_DEPENDENCY';
export const SET_LINK = 'SET_LINK';
export const SET_SERVICE_DETAIL = 'SET_SERVICE_DETAIL';
export const SET_SERVICE_TOPOLOGY = 'GET_SERVICE_TOPOLOGY';
export const SET_SELECTED_INSTANCE_CALL = 'SET_SELECTED_INSTANCE_CALL';
export const SET_INSTANCE_DEPEDENCE_METRICS = 'SET_INSTANCE_DEPEDENCE_METRICS';
export const SET_INSTANCE_DEPEDENCE_TYPE = 'SET_INSTANCE_DEPEDENCE_TYPE';
export const SET_SELECTED_CALL = 'SET_SELECTED_CALL';
export const SET_TOPO_ENDPOINT = 'SET_TOPO_ENDPOINT';
export const SET_TOPO_INSTANCE = 'SET_TOPO_INSTANCE';
export const EDIT_TOPO_INSTANCE_CONFIG = 'EDIT_TOPO_INSTANCE_CONFIG';
export const EDIT_TOPO_ENDPOINT_CONFIG = 'EDIT_TOPO_ENDPOINT_CONFIG';
export const DELETE_TOPO_INSTANCE = 'DELETE_TOPO_INSTANCE';
export const DELETE_TOPO_ENDPOINT = 'DELETE_TOPO_ENDPOINT';
export const ADD_TOPO_INSTANCE_COMP = 'ADD_TOPO_INSTANCE_COMP';
export const ADD_TOPO_ENDPOINT_COMP = 'ADD_TOPO_ENDPOINT_COMP';
export const SET_ENDPOINT_DEPENDENCY = 'SET_ENDPOINT_DEPENDENCY';
export const SET_ENDPOINT_DEPENDENCY_METRICS = 'SET_ENDPOINT_DEPENDENCY_METRICS';
export const SET_ENDPOINT_DEPTH = 'SET_ENDPOINT_DEPTH';

// profile
export const SET_TASK_OPTIONS = 'SET_TASK_OPTIONS';
export const SET_TASK_LIST = 'SET_TASK_LIST';
export const SET_TRACE_LIST = 'SET_TRACE_LIST';
export const SET_HEADER_SOURCE = 'SET_HEADER_SOURCE';
export const SET_SEGMENT_SPANS = 'SET_SEGMENT_SPANS';
export const SET_SEGMENT_LIST = 'SET_SEGMENT_LIST';
export const SET_CURRENT_SEGMENT = 'SET_CURRENT_SEGMENT';
export const SET_PROFILE_ANALYZATION = 'SET_PROFILE_ANALYZATION';
export const SET_HIGHLIGHT_TOP = 'SET_HIGHLIGHT_TOP';
export const SET_CURRENT_SPAN = 'SET_CURRENT_SPAN';

// Log
export const SELECT_LOG_TYPE = 'SELECT_LOG_TYPE';
export const SELECT_ERROR_CATALOG = 'SELECT_ERROR_CATALOG';
export const SET_LOGS = 'SET_LOGS';
export const SET_LOGS_TOTAL = 'SET_LOGS_TOTAL';
export const SET_LOADING = 'SET_LOADING';
export const SET_LOG_SERVICES = 'SET_LOG_SERVICES';
export const SET_LOG_ENDPOINTS = 'SET_LOG_ENDPOINTS';
export const SET_LOG_INSTANCES = 'SET_LOG_INSTANCES';
export const SET_CURRENT_LOG_SERVICE = 'SET_CURRENT_LOG_SERVICE';
export const SET_CURRENT_LOG_ENDPOINT = 'SET_CURRENT_LOG_ENDPOINT';
export const SET_CURRENT_LOG_INSTANCE = 'SET_CURRENT_LOG_INSTANCE';
export const SET_LOG_CONDITIONS = 'SET_LOG_CONDITIONS';
export const SET_SUPPORT_QUERY_LOGS_KEYWORDS = 'SET_SUPPORT_QUERY_LOGS_KEYWORDS';
export const CLEAR_LOG_CONDITIONS = 'CLEAR_LOG_CONDITIONS';
