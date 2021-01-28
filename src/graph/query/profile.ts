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
  ProfileSegment,
  CreateProfileTask,
  GetProfileTaskList,
  GetProfileTaskSegmentList,
  GetProfileAnalyze,
} from '../fragments/profile';

export const queryProfileSegment = `query queryProfileSegment(${ProfileSegment.variable}) {${ProfileSegment.query}}`;

export const saveProfileTask = `mutation createProfileTask(${CreateProfileTask.variable}) {${CreateProfileTask.query}}`;

export const getProfileTaskList = `query getProfileTaskList(${GetProfileTaskList.variable}) {
  ${GetProfileTaskList.query}}`;

export const getProfileTaskSegmentList = `query getProfileTaskSegmentList(${GetProfileTaskSegmentList.variable}) {
  ${GetProfileTaskSegmentList.query}}`;

export const getProfileAnalyze = `query getProfileAnalyze(${GetProfileAnalyze.variable}) {${GetProfileAnalyze.query}}`;
