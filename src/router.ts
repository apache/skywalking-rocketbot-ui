import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/containers/dashboard.vue';
import DashboardInner from './views/containers/dashboard-inner.vue';
import Trace from './views/containers/trace.vue';
import Topology from './views/containers/topology.vue';
import Alarm from './views/containers/alarm.vue';

Vue.use(Router);
const w: any = window;
w.axiosCancel = [];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: Dashboard,
      children: [{
        path: '',
        component: DashboardInner,
      }],
    },
    {
      path: '/trace',
      component: Trace,
    },
    {
      path: '/topology',
      component: Topology,
    },
    {
      path: '/alarm',
      component: Alarm,
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const token = window.localStorage.getItem('skywalking-authority');
//   if (w.axiosCancel.length !== 0) {
//     for (const func of  w.axiosCancel) {
//       setTimeout(func(), 0);
//     }
//     w.axiosCancel = [];
//   }
//   if (to.meta.login && (token === null || token === 'guest')) {
//     next();
//   } else if (token === null || token === 'guest') {
//     next('/login');
//   } else if (to.meta.login) {
//     next(from.path);
//   } else {
//     next();
//   }
// });

export default router;
