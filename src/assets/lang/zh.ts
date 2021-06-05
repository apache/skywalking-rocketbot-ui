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
const m = {
  hourTip: '选择小时',
  minuteTip: '选择分钟',
  secondTip: '选择秒数',
  second: '秒',
  yearSuffix: '年',
  monthsHead: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月',
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月',
  weeks: '一_二_三_四_五_六_日',
  hello: '你好',
  helloMessage: '欢迎来到, Apache SkyWalking APM 系统 !',
  username: '用户名',
  password: '密码',
  title: '标题',
  width: '宽度',
  height: '高度',
  login: '登录',
  signout: '登出',
  dashboard: '仪表盘',
  topology: '拓扑图',
  trace: '追踪',
  alarm: '告警',
  auto: '自动',
  reload: '刷新',
  usermode: '用户模式',
  editmode: '编辑模式',
  currentService: '当前服务',
  currentEndpoint: '当前端点',
  currentInstance: '当前实例',
  currentVersion: '当前版本',
  currentPage: '当前页面',
  version: '版本',
  page: '页面',
  currentDatabase: '当前数据库',
  templateConfig: '模版配置',
  copy: '拷贝',
  reset: '重制',
  apply: '应用',
  createTemplate: '创建模板',
  templateType: '模板类型',
  templateName: '模板名称',
  template: '模版',
  confirm: '确定',
  cancel: '取消',
  createTab: '创建分页',
  tabName: '分页名',
  nouse: '不使用',
  allServices: '所有服务',
  serviceDetail: '服务详情',
  detectPoint: '侦察端',
  callType: '调用类型',
  server: '服务端',
  client: '客户端',
  name: '名称',
  type: '类型',
  cpm: '每分钟请求量',
  sla: 'SLA',
  latency: '延迟',
  avgResponseTime: '平均响应时间',
  avgThroughput: '平均吞吐量',
  avgSLA: '平均SLA',
  all: '全部',
  success: '成功',
  error: '失败',
  service: '服务',
  instance: '实例',
  endpoint: '端点',
  database: '数据库',
  cache: '存储器',
  global: '全局',
  serviceendpoint: '服务端点',
  serviceinstance: '服务实例',
  databaseaccess: '数据库存取',
  servicerelation: '服务关系',
  serviceinstancerelation: '服务实例关系',
  endpointrelation: '服务端点关系',
  status: '状态',
  endpointName: '端点名称',
  search: '搜索',
  clear: '清空',
  more: '更多',
  traceID: '追踪ID',
  range: '范围',
  timeRange: '时间范围',
  duration: '持续时间',
  startTime: '开始时间',
  start: '起始点',
  spans: '跨度',
  spanInfo: '跨度信息',
  spanType: '跨度类型',
  time: '时间',
  tags: '标记',
  logs: '日志',
  component: '组件',
  table: '表格',
  list: '列表',
  tree: '树结构',
  filterScope: '过滤范围',
  searchKeyword: '关键字搜索',
  quarterHourCutTip: '最近15分钟',
  halfHourCutTip: '最近30分钟',
  hourCutTip: '最近1小时',
  dayCutTip: '最近1天',
  weekCutTip: '最近1周',
  monthCutTip: '最近1月',
  serverZone: '服务器时区',
  percentResponse: '百分比响应',
  exportImage: '导出为图片',
  queryData: '数据查询',
  previousService: '上一个服务',
  nextService: '下一个服务',
  object: '粒度',
  metrics: '指标',
  ShowInstanceDependency: '展示实例依赖',
  InstanceDependencyTitle: '实例依赖',
  profile: '性能剖析',
  newTask: '新建任务',
  monitorTime: '监控时间',
  monitorDuration: '监控持续时间',
  minThreshold: '起始监控时间',
  dumpPeriod: '监控间隔',
  createTask: '新建任务',
  maxSamplingCount: '最大采样数',
  analyze: '分析',
  noData: '数据为空',
  taskInfo: '任务详情',
  task: '任务',
  operationType: '操作类型',
  operationTime: '操作时间',
  taskView: '查看任务详情',
  includeChildren: '包含子部分',
  excludeChildren: '不包含子部分',
  view: '查看',
  timeTips: '时间区间不能超过60天',
  standardAPM: '标准APM',
  entityType: '实体类型',
  maxItemNum: '最多条目数',
  independentSelector: '独立选择器',
  unknownMetrics: '未知指标',
  labels: '标签',
  aggregation: '数据计算',
  unit: '单位',
  labelsIndex: '标签下标',
  parentService: '父级服务',
  isParentService: '设置父服务',
  noneParentService: '不设置父服务',
  serviceGroup: '服务组',
  endpointFilter: '端点过滤器',
  editConfig: '编辑',
  databaseView: '数据库视图',
  browserView: '浏览器视图',
  metricsView: '大屏视图',
  sortOrder: '排序方式',
  descendOrder: '递减顺序',
  increaseOrder: '递增顺序',
  defaultOrder: '默认顺序',
  chartType: '图表类型',
  currentDepth: '当前深度',
  traceTagsTip: '只有core/default/searchableTracesTags中定义的标记才可搜索。查看配置词汇表页面上的更多详细信息。',
  tagsLink: '配置词汇页',
  addTag: '请添加标签',
  log: '日志',
  logCategory: '日志类别',
  errorCatalog: '错误类目',
  logDetail: '日志详情',
  timeReload: '时间间隔必须大于0',
  errorInfo: '错误信息',
  stack: '堆栈',
  serviceVersion: '服务版本',
  errorPage: '错误页面',
  category: '类别',
  grade: '等级',
  relatedTraceLogs: '相关的日志',
  setConditions: '更多条件',
  metricName: '指标名称',
  keywordsOfContent: '内容关键词',
  excludingKeywordsOfContent: '内容不包含的关键词',
  return: '返回',
  isError: '错误',
  contentType: '内容类型',
  content: '内容',
  viewLogs: '查看日志',
  logsTagsTip: '只有core/default/searchableLogsTags中定义的标记才可搜索。查看配置词汇表页面上的更多详细信息。',
  keywordsOfContentLogTips: 'SkyWalking OAP服务器的当前存储不支持此操作',
  setEvent: '设置事件',
  instanceAttributes: '实例属性',
  serviceEvents: '服务事件',
  select: '选择',
  eventID: '事件ID',
  eventName: '事件名称',
  endTime: '结束时间',
  instanceEvents: '实例事件',
  endpointEvents: '端点事件',
  enableEvents: '启动事件',
  disableEvents: '禁用事件',
  eventSeries: '事件系列',
  eventsType: '事件类型',
  eventsMessage: '事件消息',
  eventsParameters: '事件参数',
  eventDetail: '事件详情',
  value: '数值',
  tableHeader: '表头名称',
  tableValues: '表值',
  show: '展示',
  hide: '隐藏',
  statistics: '统计',
  message: '信息',
  tooltipsContent: '提示内容',
  alarmDetail: '警告详情',
  scope: '范围',
  destService: '终点服务',
  destServiceInstance: '终点实例',
  eventSource: '事件资源',
  source: '资源',
};

export default m;
