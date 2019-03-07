export const DashBoardEndpoint = {
  variable: '$endpointId: ID!, $duration: Duration!, $traceCondition: TraceQueryCondition!',
  query: `
    getEndpointResponseTimeTrend: getLinearIntValues(metric: {
      name: "endpoint_avg"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getEndpointThroughputTrend: getLinearIntValues(metric: {
      name: "endpoint_cpm"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getEndpointSLATrend: getLinearIntValues(metric: {
      name: "endpoint_sla"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    queryBasicTraces(condition: $traceCondition) {
      traces {
        key: segmentId
        endpointNames
        duration
        start
        isError
        traceIds
      }
      total
    }
    getP99: getLinearIntValues(metric: {
      name: "endpoint_p99"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "endpoint_p95"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "endpoint_p90"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "endpoint_p75"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "endpoint_p50"
      id: $endpointId
    }, duration: $duration) {
      values {
        value
      }
    }
  `};
