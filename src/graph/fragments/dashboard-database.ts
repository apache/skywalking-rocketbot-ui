export const DashBoardDatabase = {
  variable: '$databaseId: ID!, $duration: Duration!, $condition: TopNRecordsCondition!',
  query: `
  getResponseTimeTrend: getLinearIntValues(metric: {
    name: "database_access_resp_time"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getThroughputTrend: getLinearIntValues(metric: {
    name: "database_access_cpm"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getSLATrend: getLinearIntValues(metric: {
    name: "database_access_sla"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP99: getLinearIntValues(metric: {
    name: "database_access_p99"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP95: getLinearIntValues(metric: {
    name: "database_access_p95"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP90: getLinearIntValues(metric: {
    name: "database_access_p90"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP75: getLinearIntValues(metric: {
    name: "database_access_p75"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getP50: getLinearIntValues(metric: {
    name: "database_access_p50"
    id: $databaseId
  }, duration: $duration) {
    values {
      value
    }
  }
  getTopNRecords(condition: $condition) {
    statement
    latency
    traceId
  }
  `};
