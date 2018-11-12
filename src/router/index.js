import Vue from 'vue';
import Router from 'vue-router';
import App from '@/App.vue';
import Dashboard from '@/views/containers/dashboard.vue';
import Topology from '@/views/containers/topology.vue';
import Trace from '@/views/containers/trace.vue';
import Alarm from '@/views/containers/alarm.vue';
import Login from '@/views/containers/login.vue';
import TraceDetail from '@/views/containers/trace-detail.vue';
import Axios from 'axios';

Vue.use(Router);
window.axiosCancel = [];
const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        login: true,
      },
    },
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'topo',
          name: 'topology',
          component: Topology,
        },
        {
          path: 'trace',
          name: 'trace',
          component: Trace,
        },
        {
          path: 'trace/link',
          name: 'traceDetail',
          component: TraceDetail,
        },
        {
          path: 'alarm',
          name: 'alarm',
          component: Alarm,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('skywalking-authority');
  Axios.defaults.timeout = 20000;
  if (window.axiosCancel.length !== 0) {
    for (let i = 0; i < window.axiosCancel.length; i += 1) setTimeout(window.axiosCancel[i](), 0);
    window.axiosCancel = [];
  }
  if (to.meta.login && (token === null || token === 'guest')) {
    next();
  } else if (token === null || token === 'guest') {
    next('/login');
  } else if (to.meta.login) {
    next(from.path);
  } else {
    next();
  }
});

export default router;
