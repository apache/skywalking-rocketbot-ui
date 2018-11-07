import RkPanel from './rk-panel.vue';
import RkHeader from './rk-header.vue';
import RkNav from './rk-nav.vue';
import RkBoard from './rk-board.vue';
import RkProgress from './rk-progress.vue';
import RkDate from './rk-date.vue';
import RkSidebox from './rk-sidebox.vue';
import RkEcharts from './rk-echarts.vue';
import RkToolbar from './rk-toolbar.vue';
import RkEmpty from './rk-empty.vue';
import RkPage from './rk-page.vue';
import RkDrawer from './rk-drawer.vue';

const components: Object = {
  RkDrawer, RkEmpty, RkPanel, RkHeader, RkNav, RkBoard, RkDate, RkProgress, RkSidebox, RkEcharts, RkToolbar, RkPage,
};
const componentsName: string[] = Object.keys(components);

export default {install: (vue) => {
  componentsName.forEach((i) => {
    vue.component(i, components[i]);
  });
}};
