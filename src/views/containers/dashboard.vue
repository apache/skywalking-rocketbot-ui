<template>
  <div class="flex-v wrapper" style="flex-grow:1;">
    <ToolBar/>
    <ToolNav/>
    <Inner/>
    <Comp v-if="rocketGlobal.edit"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';
import ToolBar from '@/views/components/dashboard/tool-bar.vue';
import ToolNav from '@/views/components/dashboard/tool-nav.vue';
import Inner from './dashboard-inner.vue';
import Comp from './dashboard-comp.vue';
import dashboard from '../../store/modules/dashboard';

@Component({
  components: {
    ToolBar,
    ToolNav,
    Comp,
    Inner,
  },
})
export default class Dashboard extends Vue {
  @State('rocketbot') private rocketGlobal: any;
  @State('rocketDashboard') private stateDashboard!: any;
  @State('rocketComps') private rocketComps: any;
  @Mutation('SET_EVENTS') private SET_EVENTS: any;
  @Mutation('SET_COMPTREE') private SET_COMPTREE: any;
  @Mutation('SET_CURRENTCOMP') private SET_CURRENTCOMP: any;
  @Action('rocketDashboard/GET_GLOBAL') private GET_GLOBAL: any;
  @Action('rocketDashboard/GET_SERVICES') private GET_SERVICES: any;
  @Action('rocketDashboard/GET_SERVICE') private GET_SERVICE: any;
  @Action('rocketDashboard/GET_ENDPOINTS') private GET_ENDPOINTS: any;
  @Action('rocketDashboard/GET_ENDPOINT') private GET_ENDPOINT: any;
  @Action('rocketDashboard/GET_INSTANCES') private GET_INSTANCES: any;
  @Action('rocketDashboard/GET_INSTANCE') private GET_INSTANCE: any;
  @Getter('durationTime') private durationTime: any;
  private changeGloabl() {
    this.GET_GLOBAL({duration: this.durationTime});
  }
  private changeService() {
    this.GET_SERVICES({duration: this.durationTime})
    .then(() => this.GET_SERVICE(
      {duration: this.durationTime, serviceId: this.stateDashboard.currentService.key, keyword: ''})
    .then(() => {
      this.GET_ENDPOINT(
        { duration: this.durationTime,
          endpointId: this.stateDashboard.currentEndpoint.key,
          endpointName: this.stateDashboard.currentEndpoint.label,
        });
      this.GET_INSTANCE(
        {duration: this.durationTime, serviceInstanceId: this.stateDashboard.currentService.key});
      }),
    );
  }
  private changeEndpoint() {
    this.GET_ENDPOINTS(
      {keyword: '', serviceId: this.stateDashboard.currentService.key})
    .then(() => {
      this.GET_ENDPOINT(
        { duration: this.durationTime,
          endpointId: this.stateDashboard.currentEndpoint.key,
          endpointName: this.stateDashboard.currentEndpoint.label,
        });
    });
  }
  private beforeunloadHandler() {
    window.localStorage.setItem('dashboard', JSON.stringify([...this.rocketComps.tree]));
  }
  private changeInstance() {
    this.GET_INSTANCES(
      {keyword: '', serviceId: this.stateDashboard.currentService.key})
    .then(() => {
      this.GET_INSTANCE(
        {duration: this.durationTime, serviceInstanceId: this.stateDashboard.currentInstance.key});
    });
  }
  private beforeMount() {
    this.$store.registerModule('rocketDashboard', dashboard);
    if (window.localStorage.getItem('dashboard')) {
      const data: string = `${window.localStorage.getItem('dashboard')}`;
      this.SET_COMPTREE(JSON.parse(data));
    }
    window.addEventListener('beforeunload', (e: any) => this.beforeunloadHandler());
    this.SET_EVENTS([this.changeService, this.changeGloabl]);
    this.changeService();
    this.changeGloabl();
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketDashboard');
    this.beforeunloadHandler();
    window.removeEventListener('beforeunload', (e: any) => this.beforeunloadHandler());
  }
}
</script>
<style lang="scss">
.dashboard-container{
  overflow: auto;
  padding:20px 15px;
  flex-grow: 1;
}
</style>

