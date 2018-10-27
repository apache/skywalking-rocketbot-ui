import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/views/containers/dashboard.vue';
import Topology from '@/views/containers/topology.vue';
import Trace from '@/views/containers/trace.vue';
import Alarm from '@/views/containers/alarm.vue';
import TraceDetail from '@/views/containers/trace-detail.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/topo',
      name: 'topology',
      component: Topology,
    },
    {
      path: '/trace',
      name: 'trace',
      component: Trace,
    },
    {
      path: '/trace/link',
      name: 'traceDetail',
      component: TraceDetail,
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: Alarm,
    },
  ],
});
