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

import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
// import Login from './views/containers/login.vue';
import Index from './views/containers/index.vue';

Vue.use(Router);
window.axiosCancel = [];

export const routes: RouteConfig[] = [
  // {
  //   path: '/login',
  //   component: Login,
  //   meta: { login: true },
  // },
  {
    path: '',
    component: Index,
    children: [
      {
        path: '/',
        component: () => import('./views/containers/dashboard.vue'),
        meta: { icon: 'chart', title: 'dashboard', exact: true },
      },
      {
        path: 'topology',
        component: () => import('./views/containers/topology/topology.vue'),
        meta: { icon: 'issues', title: 'topology', exact: false },
      },
      {
        name: 'trace',
        path: 'trace',
        component: () => import('./views/containers/trace.vue'),
        props: true,
        meta: { icon: 'merge', title: 'trace', exact: false },
      },
      {
        path: 'profile',
        component: () => import('./views/containers/profile.vue'),
        meta: { icon: 'timeline', title: 'profile', exact: false },
      },
      {
        path: 'log',
        component: () => import('./views/containers/log.vue'),
        meta: { icon: 'assignment', title: 'log', exact: false },
      },
      {
        path: 'alarm',
        component: () => import('./views/containers/alarm.vue'),
        meta: { icon: 'spam', title: 'alarm', exact: false },
      },
    ],
  },
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes,
});

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('skywalking-authority');
  if (window.axiosCancel.length !== 0) {
    for (const func of window.axiosCancel) {
      setTimeout(func(), 0);
    }
    window.axiosCancel = [];
  }
  // if (to.meta.login && (token === null || token === 'guest')) {
  //   next();
  // } else if (token === null || token === 'guest') {
  //   next('/login');
  // } else if (to.meta.login) {
  //   next(from.path);
  // } else {
  //   next();
  // }
  next();
});

export default router;
