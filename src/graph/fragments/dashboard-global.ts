export const DashBoardGlobal = {
  variable: '$duration: Duration!',
  query: `
      getGlobalBrief(duration: $duration) {
        numOfService
        numOfEndpoint
        numOfDatabase
        numOfCache
        numOfMQ
      }
      getTopNSlowEndpoint: getAllEndpointTopN(
        duration: $duration,
        name: "endpoint_avg",
        topN: 10,
        order: DES
      ) {
        key: id
        label: name
        value
      }
      getTopNServiceThroughput: getServiceTopN(
        duration: $duration,
        name: "service_cpm",
        topN: 10,
        order: DES
      ) {
        key: id
        label: name
        value
      }
      getP99: getLinearIntValues(metric: {
        name: "all_p99"
      }, duration: $duration) {
        values {
          value
        }
      }
      getP95: getLinearIntValues(metric: {
        name: "all_p95"
      }, duration: $duration) {
        values {
          value
        }
      }
      getP90: getLinearIntValues(metric: {
        name: "all_p90"
      }, duration: $duration) {
        values {
          value
        }
      }
      getP75: getLinearIntValues(metric: {
        name: "all_p75"
      }, duration: $duration) {
        values {
          value
        }
      }
      getP50: getLinearIntValues(metric: {
        name: "all_p50"
      }, duration: $duration) {
        values {
          value
        }
      }
  `};
