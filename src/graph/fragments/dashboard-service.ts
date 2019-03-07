export const DashBoardService = {
  variable: '$serviceId: ID!, $duration: Duration!, $keyword: String!',
  query: `
    getSlowEndpoint: getEndpointTopN(
      serviceId: $serviceId
      duration: $duration
      name: "endpoint_avg",
      topN: 10,
      order: DES
    ) {
      key: id
      label: name
      value
    }
    getServiceInstanceThroughput: getServiceInstanceTopN(
      serviceId: $serviceId
      duration: $duration
      name: "service_instance_cpm",
      topN: 10,
      order: DES
    ) {
      key: id
      label: name
      value
    }
    getEndpoints: searchEndpoint(serviceId: $serviceId, keyword: $keyword, limit: 10) {
      key: id
      label: name
    }
    getServiceInstances(duration: $duration, serviceId: $serviceId) {
      key: id
      label: name
      attributes {
        name
        value
      }
      language
    }
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_resp_time"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_cpm"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_sla"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP99: getLinearIntValues(metric: {
      name: "service_p99"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP95: getLinearIntValues(metric: {
      name: "service_p95"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP90: getLinearIntValues(metric: {
      name: "service_p90"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP75: getLinearIntValues(metric: {
      name: "service_p75"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
    getP50: getLinearIntValues(metric: {
      name: "service_p50"
      id: $serviceId
    }, duration: $duration) {
      values {
        value
      }
    }
  `};
