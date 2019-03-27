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
import moment from 'dayjs';
import clickout from '@/utils/clickout';
import tooltip from '@/utils/tooltip';
import App from './App.vue';
import router from './router';
import store from './store';
import components from './components';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';

import './assets';

Vue.use(components);
Vue.directive('clickout', clickout);
Vue.directive('tooltip', tooltip);

Vue.filter('dateformat', (dataStr: any, pattern = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern));

const w = window as any;
if (!w.Promise) { w.Promise = Promise; }

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
