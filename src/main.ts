// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import moment from 'dayjs';
import clickout from '@/utils/clickout.ts';
import App from './App.vue';
import router from './router';
import store from './store';
import components from './components';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';

Vue.filter('dateformat', (
  dataStr,
  pattern = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern));
Vue.config.productionTip = false;
Vue.directive('clickout', clickout);
Vue.use(components);
/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
