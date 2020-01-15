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

/**
 * Shallow comparison of two objects.
 * @param objA Object A to be compared
 * @param objB Object B to be compared
 * @return The same object return false, otherwise return true.
 */
const compareObj = (objA: object, objB: object): boolean => {
  return (
    JSON.stringify(Object.entries(objA).sort(), null, 0) !==
    JSON.stringify(Object.entries(objB).sort(), null, 0)
  );
};

export default compareObj;
