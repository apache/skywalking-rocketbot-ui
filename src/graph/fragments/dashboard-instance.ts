export const DashBoardInstance = {
  variable: '$serviceInstanceId: ID!, $duration: Duration!',
  query: `
    getServiceInstanceResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_instance_resp_time"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getServiceInstanceThroughputTrend: getLinearIntValues(metric: {
      name: "service_instance_cpm"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getServiceInstanceSLA: getLinearIntValues(metric: {
      name: "service_instance_sla"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getCPUTrend: getLinearIntValues(metric: {
      name: "instance_jvm_cpu"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    youngGCCount: getLinearIntValues(metric: {
      name: "instance_jvm_young_gc_count"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    oldGCCount: getLinearIntValues(metric: {
      name: "instance_jvm_old_gc_count"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    youngGCTime: getLinearIntValues(metric: {
      name: "instance_jvm_young_gc_time"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    oldGCTime: getLinearIntValues(metric: {
      name: "instance_jvm_old_gc_time"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    heap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_heap"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    maxHeap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_heap_max"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    noheap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_noheap"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    maxNoheap: getLinearIntValues(metric: {
      name: "instance_jvm_memory_noheap_max"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    envoyHeap: getLinearIntValues(metric: {
      name: "envoy_heap_memory_max_used"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    envoyTotal: getLinearIntValues(metric: {
      name: "envoy_total_connections_used"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
    envoyParent: getLinearIntValues(metric: {
      name: "envoy_parent_connections_used"
      id: $serviceInstanceId
    }, duration: $duration) {
      values {
        value
      }
    }
  `};
