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


export const instanceResponseTime =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  instanceResponseTime: getLinearIntValues(metric: {
    name: "service_instance_resp_time"
    id: $serviceInstanceId
  }, duration: $duration) {
    values {
      value
    }`,
};

export const instanceThroughput =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  instanceThroughput: getLinearIntValues(metric: {
    name: "service_instance_cpm"
    id: $serviceInstanceId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};
export const instanceSLA =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  instanceSLA: getLinearIntValues(metric: {
    name: "service_instance_sla"
    id: $serviceInstanceId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};

export const instanceCPU =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  instanceCPU: getLinearIntValues(metric: {
    name: "instance_jvm_cpu"
    id: $serviceInstanceId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};

export const instanceGC =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  youngGCCount: getLinearIntValues(metric: {
    name: "instance_jvm_young_gc_count"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }
  oldGCCount: getLinearIntValues(metric: {
    name: "instance_jvm_old_gc_count"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }
  youngGCTime: getLinearIntValues(metric: {
    name: "instance_jvm_young_gc_time"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }
  oldGCTime: getLinearIntValues(metric: {
    name: "instance_jvm_old_gc_time"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }`,
};

export const instanceHeap =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  heap: getLinearIntValues(metric: {
    name: "instance_jvm_memory_heap"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }
  maxHeap: getLinearIntValues(metric: {
    name: "instance_jvm_memory_heap_max"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }`,
};

export const instanceNonheap =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  nonheap: getLinearIntValues(metric: {
    name: "instance_jvm_memory_noheap"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }
  maxNonHeap: getLinearIntValues(metric: {
    name: "instance_jvm_memory_noheap_max"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }`,
};

export const instanceEnvoyCount =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  envoyTotal: getLinearIntValues(metric: {
    name: "envoy_total_connections_used"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }
  envoyParent: getLinearIntValues(metric: {
    name: "envoy_parent_connections_used"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }`,
};

export const instanceEnvoyHeap =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  envoyHeap: getLinearIntValues(metric: {
    name: "envoy_heap_memory_max_used"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }`,
};

export const instanceClrHeap =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  clrHeap: getLinearIntValues(metric: {
    name: "instance_clr_heap_memory"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }`,
};

export const instanceClrCPU =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  clrCPU: getLinearIntValues(metric: {
    name: "instance_clr_cpu"
    id: $serviceInstanceId
  }, duration: $duration) {
    values { value }
  }`,
};


export const instanceClrGC =  {
  variable: ['$serviceInstanceId: ID!, $duration: Duration!'],
  fragment: `
  clrGCGen0: getLinearIntValues(metric: {
    name: "instance_clr_gen0_collect_count"
    id: $serviceInstanceId
  }, duration: $duration) {
    values {
      value
    }
  }
  clrGCGen1: getLinearIntValues(metric: {
    name: "instance_clr_gen1_collect_count"
    id: $serviceInstanceId
  }, duration: $duration) {
    values {
      value
    }
  }
  clrGCGen2: getLinearIntValues(metric: {
    name: "instance_clr_gen2_collect_count"
    id: $serviceInstanceId
  }, duration: $duration) {
    values {
      value
    }
  }`,
};

