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

import graph from '@/graph';
import { AxiosResponse } from 'axios';

const getLocalTime = (i: number, t: Date | number) => {
  const d = new Date(t);
  const len = d.getTime();
  const offset = d.getTimezoneOffset() * 60000;
  const utcTime = len + offset;
  return new Date(utcTime + 3600000 * i);
};

const setTimezoneOffset = () => {
  window.localStorage.setItem(
    'utc',
    -(new Date().getTimezoneOffset() / 60) + '',
  );
};

export const queryOAPTimeInfo = async () => {
  let utc = window.localStorage.getItem('utc');
  if (!utc) {
    const res: AxiosResponse = await graph.query('queryOAPTimeInfo').params({});
    if (!res.data || !res.data.data || !res.data.data.getTimeInfo || !res.data.data.getTimeInfo.timezone) {
      setTimezoneOffset();
      return;
    }
    utc = res.data.data.getTimeInfo.timezone / 100 + '';
    window.localStorage.setItem('utc', utc);
  }
};

export default getLocalTime;
