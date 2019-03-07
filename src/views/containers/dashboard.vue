<template>
  <div class="flex-v wrapper" style="flex-grow:1;">
    <ToolGroup :rocketGlobal="rocketGlobal" :rocketComps="rocketComps"/>
    <ToolBar  :compType="compType" :durationTime="durationTime"  :stateDashboard='stateDashboard'/>
    <ToolNav :rocketGlobal="rocketGlobal" :rocketComps="rocketComps"/>
    <DashboardInner  v-if="isRouterAlive" :rocketGlobal="rocketGlobal" :stateDashboard='stateDashboard' :rocketComps="rocketComps"/>
    <DashboardComp v-if="rocketGlobal.edit" :compType="compType" :rocketComps="rocketComps"/>
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
  @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
  @Mutation('SET_CURRENT_COMPS') private SET_CURRENT_COMPS: any;
  @Action('rocketDashboard/GET_GLOBAL') private GET_GLOBAL: any;
  @Action('rocketDashboard/MIXHANDLE_GET_DASHBOARD') private MIXHANDLE_GET_DASHBOARD: any;
  @Getter('durationTime') private durationTime: any;
  private isRouterAlive: boolean = true;
  public reload(): void {
    this.isRouterAlive = false;
    this.$nextTick(() => { this.isRouterAlive = true; });
  }
  private get compType() {
    return this.rocketComps.tree[this.rocketComps.group].type;
  }
  private handleRefresh() {
    this.MIXHANDLE_GET_DASHBOARD({compType: this.compType, duration: this.durationTime});
    this.GET_GLOBAL({duration: this.durationTime});
  }

  private beforeCreate() {
    this.$store.registerModule('rocketDashboard', dashboard);
  }
  private beforeMount() {
    if (window.localStorage.getItem('dashboard')) {
      const data: string = `${window.localStorage.getItem('dashboard')}`;
      this.SET_COMPS_TREE(JSON.parse(data));
    }
    this.SET_EVENTS([this.handleRefresh]);
    this.handleRefresh();
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

