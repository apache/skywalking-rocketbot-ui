export const Alarm = {
  variable: '$keyword: String, $scope: Scope, $duration:Duration!, $paging: Pagination!',
  query: `
    getAlarm(keyword: $keyword, scope: $scope, duration: $duration, paging: $paging) {
      items: msgs {
        key: id
        message
        startTime
        scope
      }
      total
    }`};
