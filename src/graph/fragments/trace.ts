/**
 * "condition": {
 *   "traceState": "ALL",
 *   "queryOrder": "BY_START_TIME",
 *   "queryDuration": {
 *       "start": "2018-12-20 2131",
 *       "end": "2018-12-20 2146",
 *       "step": "MINUTE"
 *   },
 *   "paging": {
 *       "pageNum": 1,
 *       "pageSize": 20,
 *       "needTotal": true
 *   }
 */
export const Traces = {
  variable: '$condition: TraceQueryCondition',
  query: `
  traces: queryBasicTraces(condition: $condition) {
    data: traces {
      key: segmentId
      endpointNames
      duration
      start
      isError
      traceIds
    }
    total
  }`};

export const ServiceInstanceOption = {
  variable: '$duration: Duration!, $serviceId: ID!',
  query: `
    instanceId: getServiceInstances(duration: $duration, serviceId: $serviceId) {
      key: id
      label: name
    }`};



/**
 * @param { traceId } { string }
 */
export const Trace = {
  variable: '$traceId: ID!',
  query: `
  trace: queryTrace(traceId: $traceId) {
    spans {
      traceId
      segmentId
      spanId
      parentSpanId
      refs {
        traceId
        parentSegmentId
        parentSpanId
        type
      }
      serviceCode
      startTime
      endTime
      endpointName
      type
      peer
      component
      isError
      layer
      tags {
        key
        value
      }
      logs {
        time
        data {
          key
          value
        }
      }
    }
  }
  `};
