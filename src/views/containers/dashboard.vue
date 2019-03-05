<template>
  <div class="flex-v wrapper" style="flex-grow:1;">
    <ToolGroup/>
    <ToolBar/>
    <ToolNav/>
    <DashboardInner/>
    <DashboardComp v-if="rocketGlobal.edit"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';
import ToolBar from '@/views/components/dashboard/tool-bar.vue';
import ToolGroup from '@/views/components/dashboard/tool-group.vue';
import ToolNav from '@/views/components/dashboard/tool-nav.vue';
import DashboardInner from '@/views/components/dashboard/dashboard-inner.vue';
import DashboardComp from '@/views/components/dashboard/dashboard-comp.vue';
import dashboard from '../../store/modules/dashboard';

@Component({
  components: {
    ToolBar,
    ToolGroup,
    ToolNav,
    DashboardInner,
    DashboardComp,
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
  private get compType() {
    return this.rocketComps.tree[this.rocketComps.group].type;
  }
  private changeService() {
    this.GET_SERVICES({duration: this.durationTime})
    .then(() => this.GET_SERVICE(
      {duration: this.durationTime, serviceId: this.stateDashboard.currentService.key, keyword: ''})
    .then(() => {
      if ( this.compType === 'database') { return; }
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
  private changeInstance() {
    this.GET_INSTANCES(
      {keyword: '', serviceId: this.stateDashboard.currentService.key})
    .then(() => {
      this.GET_INSTANCE(
        {duration: this.durationTime, serviceInstanceId: this.stateDashboard.currentInstance.key});
    });
  }
  private beforeCreate() {
    this.$store.registerModule('rocketDashboard', dashboard);
  }
  private beforeMount() {
    if (window.localStorage.getItem('dashboard')) {
      const data: string = `${window.localStorage.getItem('dashboard')}`;
      this.SET_COMPTREE(JSON.parse(data));
    }
    this.SET_EVENTS([this.changeService, this.changeGloabl]);
    this.changeService();
    this.changeGloabl();
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketDashboard');
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

