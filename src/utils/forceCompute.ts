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

export const computeVelocity = (id: string, ids: any, nodes: any, calls: any) => {
  if (!id && ids.length === 1) {
    id = ids[0];
  }
  if (!id) {
    return;
  }
  for (const call of calls) {
    let vx = 0;
    let callId = '';
    if (call.source === id) {
      vx = 300;
      callId = call.target;
    } else if (call.target === id) {
      vx = -300;
      callId = call.source;
    }
    if (!callId) {
      continue;
    }
    for (const node of nodes) {
      if (node.id === callId) {
        node.velocityX = vx;
        break;
      }
    }
  }
};
