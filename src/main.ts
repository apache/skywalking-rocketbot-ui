// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import moment from 'dayjs';
import clickout from '@/utils/clickout.ts';
import App from './App.vue';
import router from './router';
import store from './store';
import components from './components';
import iview from './components/iview';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';

Vue.filter('dateformat', (
  dataStr,
  pattern = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern));
Vue.config.productionTip = false;
Vue.directive('clickout', clickout);
Vue.use(components);
Vue.use(iview);

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

try {
  if (window.console && window.console.log) {
    console.log('%c Rocketbot v1.0.0 %c Powered By Daocloud Lab %c', 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#3880ff ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
  }
} catch (e) {}
