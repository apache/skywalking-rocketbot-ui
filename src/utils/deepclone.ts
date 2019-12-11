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

const deepClone = (target: any): any => {
  let result;

  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = [];
      for (const item of target) {
        result.push(deepClone(item));
      }
    } else if (target === null) {
      result = null;
    } else if (target.constructor === RegExp) {
        result = target;
    } else {
      result = {} as any;
      for (const item of Object.keys(target)) {
        result[item] = deepClone(target[item]);
      }
    }
  } else {
    result = target;
  }
  return result;
};

export default deepClone;
