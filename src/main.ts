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
import 'echarts/lib/chart/pictorialBar';
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
