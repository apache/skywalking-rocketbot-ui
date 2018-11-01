import { Commit, ActionTree } from 'vuex';
import { getTraces, getTraceSpans } from '@/api/trace.ts';
import * as types from '../mutation-types';

export interface Trace {
  duration: Number;
  isError: Boolean;
  key: String;
  operationNames: String[];
  start: String;
  traceIds: String[];
}
export interface Span {
  duration: Number;
  isError: Boolean;
  key: String;
  operationNames: String[];
  start: String;
  traceIds: String[];
}

export interface State {
  traces: Trace[];
  spans: Span[];
  tracesTotal: Number;
}

const initState: State = {
  traces: [],
  spans: [],
  tracesTotal: 0,
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_TRACE](state: State, data: Trace[]) {
    state.traces = data;
  },
  [types.SET_TRACE_TOTAL](state: State, total: Number) {
    state.tracesTotal = total;
  },
  [types.SET_SPAN](state: State, data: Span[]) {
    state.spans = data;
  },
  [types.CLEAR_TRACE](state: State) {
    state.traces = [];
    state.spans = [];
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_TRACES(
    context: { commit: Commit; state: State; rootState: any },
    params: String,
  ) {
    return getTraces(params).then((res) => {
      context.commit(types.SET_TRACE, res.data.data.queryBasicTraces.traces);
      context.commit(
        types.SET_TRACE_TOTAL,
        res.data.data.queryBasicTraces.total,
      );
    });
  },
  GET_SPANS(
    context: { commit: Commit; state: State; rootState: any },
    params: String,
  ) {
    context.commit(types.SET_SPAN, []);
    return getTraceSpans(params).then((res) => {
      const span = {"data":{"queryTrace":{"spans":[{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":0,"parentSpanId":-1,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947856,"endTime":1540969947872,"operationName":"/login","type":"Entry","peer":"","component":"Tomcat","isError":true,"layer":"Http","tags":[{"key":"url","value":"http://ziguan.lianjia.com/login"},{"key":"http.method","value":"POST"}],"logs":[{"time":1540969947860,"data":[{"key":"event","value":"error"},{"key":"error.kind","value":"javax.servlet.ServletException"},{"key":"message","value":"Filtered request failed."},{"key":"stack","value":"javax.servlet.ServletException: Filtered request failed.\nat org.apache.shiro.web.servlet.AbstractShiroFilter.doFilterInternal(AbstractShiroFilter.java:384)\nat com.lianjia.commons.shiro.web.ShiroFilterFactoryBean$SpringShiroFilter.doFilterInternal(ShiroFilterFactoryBean.java:171)\nat org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\nat org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:346)\nat org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:262)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)\nat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:121)\nat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)\nat com.lianjia.goldflow.controller.filter.SslFilter.doFilter(SslFilter.java:27)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)\nat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:218)\nat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:122)\nat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:505)\nat org.apache.catalina.core.StandardHostValve.invoke$original$o3syj6Cw(StandardHostValve.java:169)\nat org.apache.catalina.core.StandardHostValve.invoke$original$o3syj6Cw$accessor$SexZhbkY(StandardHostValve.java)\nat org.apache.catalina.core.StandardHostValve$auxiliary$udQU7OGa.call(Unknown Source)\nat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:93)\nat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java)\nat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:103)\nat org.apache.catalina.valves.AccessLogValve.invoke(AccessLogValve.java:956)\nat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:116)\nat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:442)\nat org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1082)\nat org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:623)\nat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1756)\nat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.run(NioEndpoint.java:1715)\nat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)\nat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)\nat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\nat java.lang.Thread.run(Thread.java:745)\njava.lang.NullPointerException\nat org.apache.shiro.web.servlet.AbstractShiroFilter.doFilterInternal(AbstractShiroFilter.java:384)\nat com.lianjia.commons.shiro.web.ShiroFilterFactoryBean$SpringShiroFilter.doFilterInternal(ShiroFilterFactoryBean.java:171)\nat org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)\nat org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:346)\nat org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:262)\nat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)\nat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)\nat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:121)\n"}]},{"time":1540969947860,"data":[{"key":"forward-url","value":"/error/500"}]}]},{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":1,"parentSpanId":0,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947857,"endTime":1540969947859,"operationName":"Jedis/get","type":"Exit","peer":"m11179.zeus.redis.ljnode.com:11179","component":"Jedis","isError":false,"layer":"Cache","tags":[{"key":"db.type","value":"Redis"}],"logs":[]},{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":2,"parentSpanId":0,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947861,"endTime":1540969947862,"operationName":"Jedis/set","type":"Exit","peer":"m11179.zeus.redis.ljnode.com:11179","component":"Jedis","isError":false,"layer":"Cache","tags":[{"key":"db.type","value":"Redis"}],"logs":[]},{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":3,"parentSpanId":0,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947862,"endTime":1540969947864,"operationName":"Jedis/expire","type":"Exit","peer":"m11179.zeus.redis.ljnode.com:11179","component":"Jedis","isError":false,"layer":"Cache","tags":[{"key":"db.type","value":"Redis"}],"logs":[]},{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":4,"parentSpanId":0,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947864,"endTime":1540969947866,"operationName":"Jedis/set","type":"Exit","peer":"m11179.zeus.redis.ljnode.com:11179","component":"Jedis","isError":false,"layer":"Cache","tags":[{"key":"db.type","value":"Redis"}],"logs":[]},{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":5,"parentSpanId":0,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947866,"endTime":1540969947868,"operationName":"Jedis/expire","type":"Exit","peer":"m11179.zeus.redis.ljnode.com:11179","component":"Jedis","isError":false,"layer":"Cache","tags":[{"key":"db.type","value":"Redis"}],"logs":[]},{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":6,"parentSpanId":0,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947868,"endTime":1540969947870,"operationName":"Jedis/set","type":"Exit","peer":"m11179.zeus.redis.ljnode.com:11179","component":"Jedis","isError":false,"layer":"Cache","tags":[{"key":"db.type","value":"Redis"}],"logs":[]},{"traceId":"1070.817.15409699478560259","segmentId":"1070.817.15409699478560258","spanId":7,"parentSpanId":0,"refs":[],"applicationCode":"ziguan.lianjia.com","startTime":1540969947870,"endTime":1540969947872,"operationName":"Jedis/expire","type":"Exit","peer":"m11179.zeus.redis.ljnode.com:11179","component":"Jedis","isError":false,"layer":"Cache","tags":[{"key":"db.type","value":"Redis"}],"logs":[]}]}}};
      context.commit(types.SET_SPAN, span.data.queryTrace.spans);
      // context.commit(types.SET_SPAN, res.data.data.queryTrace.spans);
    });
  },
  CLEAR_TRACE(context: { commit: Commit; state: State; rootState: any }) {
    context.commit(types.CLEAR_TRACE);
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
