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

export default function dateFormatStep(date: Date, step: string, monthDayDiff?: boolean): string {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) {
    month = `0${monthTemp}`;
  }
  if (step === 'MONTH' && monthDayDiff) {
    return `${year}-${month}`;
  }
  const dayTemp = date.getDate();
  let day: string = `${dayTemp}`;
  if (dayTemp < 10) {
    day = `0${dayTemp}`;
  }
  if (step === 'DAY' || step === 'MONTH') {
    return `${year}-${month}-${day}`;
  }
  const hourTemp = date.getHours();
  let hour: string = `${hourTemp}`;
  if (hourTemp < 10) {
    hour = `0${hourTemp}`;
  }
  if (step === 'HOUR') {
    return `${year}-${month}-${day} ${hour}`;
  }
  const minuteTemp = date.getMinutes();
  let minute: string = `${minuteTemp}`;
  if (minuteTemp < 10) {
    minute = `0${minuteTemp}`;
  }
  if (step === 'MINUTE') {
    return `${year}-${month}-${day} ${hour}${minute}`;
  }
  return '';
}

export const dateFormatTime = (date: Date, step: string): string => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) {
    month = `0${monthTemp}`;
  }
  if (step === 'MONTH') {
    return `${year}-${month}`;
  }
  const dayTemp = date.getDate();
  let day: string = `${dayTemp}`;
  if (dayTemp < 10) {
    day = `0${dayTemp}`;
  }
  if (step === 'DAY') {
    return `${month}-${day}`;
  }
  const hourTemp = date.getHours();
  let hour: string = `${hourTemp}`;
  if (hourTemp < 10) {
    hour = `0${hourTemp}`;
  }
  if (step === 'HOUR') {
    return `${month}-${day} ${hour}`;
  }
  const minuteTemp = date.getMinutes();
  let minute: string = `${minuteTemp}`;
  if (minuteTemp < 10) {
    minute = `0${minuteTemp}`;
  }
  if (step === 'MINUTE') {
    return `${hour}:${minute}\n${month}-${day}`;
  }
  return '';
};
