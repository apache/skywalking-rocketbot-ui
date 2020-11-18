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

import { Duration } from '@/types/global';
import { TimeType } from '@/constants/constant';

const timeFormat = (time: Date[]): Duration => {
  let step: TimeType;
  const unix = Math.round(time[1].getTime()) - Math.round(time[0].getTime());
  if (unix <= 60 * 60 * 1000) {
    step = TimeType.MINUTE_TIME;
  } else if (unix <= 24 * 60 * 60 * 1000) {
    step = TimeType.HOUR_TIME;
  } else {
    step = TimeType.DAY_TIME;
  }
  return { start: time[0], end: time[1], step };
};

export default timeFormat;
