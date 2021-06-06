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

import {
  TypeOfMetrics,
  getAllTemplates,
  addTemplate,
  changeTemplate,
  disableTemplate,
  querySampledRecords,
  queryHeatMap,
  queryLabeledMetricsValues,
  querySortMetrics,
  queryMetricsValue,
  queryMetricsValues,
  fetchEvents,
} from '../fragments/dashboard';

export const queryTypeOfMetrics = `query queryTypeOfMetrics(${TypeOfMetrics.variable}) {${TypeOfMetrics.query}}`;

export const mutationAddTemplate = `mutation mutationAddTemplate(${addTemplate.variable}) {${addTemplate.query}}`;

export const mutationChangeTemplate = `mutation mutationChangeTemplate(${changeTemplate.variable}) {
  ${changeTemplate.query}}`;

export const mutationDisableTemplate = `mutation mutationDisableTemplate(${disableTemplate.variable}) {
  ${disableTemplate.query}}`;

export const queryGetAllTemplates = `query queryGetAllTemplates {${getAllTemplates.query}}`;

export const readHeatMap = `query queryData(${queryHeatMap.variable}) {${queryHeatMap.query}}`;

export const readSampledRecords = `query queryData(${querySampledRecords.variable}) {${querySampledRecords.query}}`;

export const readLabeledMetricsValues = `query queryData(${queryLabeledMetricsValues.variable}) {
  ${queryLabeledMetricsValues.query}}`;

export const sortMetrics = `query queryData(${querySortMetrics.variable}) {${querySortMetrics.query}}`;

export const readMetricsValue = `query queryData(${queryMetricsValue.variable}) {${queryMetricsValue.query}}`;

export const readMetricsValues = `query queryData(${queryMetricsValues.variable}) {${queryMetricsValues.query}}`;

export const queryEvents = `query queryData(${fetchEvents.variable}) {${fetchEvents.query}}`;
