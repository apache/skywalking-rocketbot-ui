import RkHeader from './rk-header.vue';
import RkFooter from './rk-footer.vue';
import RkProgress from './rk-progress.vue';
import RkPage from './rk-page.vue';
import RkDate from './rk-date.vue';
import RkPanel from './rk-panel.vue';
import RkSidebox from './rk-sidebox.vue';
import RkEcharts from './rk-echarts.vue';
const components: any = {
  RkHeader, RkFooter, RkProgress, RkDate, RkPanel, RkEcharts, RkPage, RkSidebox,
};
const componentsName: string[] = Object.keys(components);
export default {install: (vue: any) => {
  componentsName.forEach((i) => {
    vue.component(i, components[i]);
  });
}};
