<template>
  <div>
    <div class="rk-dashboard-bar flex-h" v-if="compType === 'Service'">
      <ToolBarSelect @onChoose="selectService" title="Current Service" :current="stateDashboard.currentService" :data="stateDashboard.services" icon="package"/>
      <ToolBarSelect @onChoose="selectEndpoint" title="Current Endpoint" :current="stateDashboard.currentEndpoint" :data="stateDashboard.endpoints" icon="code"/>
      <ToolBarSelect @onChoose="selectInstance" title="Current Instance" :current="stateDashboard.currentInstance" :data="stateDashboard.instances" icon="disk"/>
    </div>
    <div class="rk-dashboard-bar flex-h" v-else-if="compType === 'Database'">
      <ToolBarSelect @onChoose="selectService" title="Current Database" :current="stateDashboard.currentService" :data="stateDashboard.services" icon="package"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ToolBarSelect from './tool-bar-select.vue';
import { State, Action, Mutation } from 'vuex-class';
@Component({components: {ToolBarSelect}})
export default class ToolBar extends Vue {
  @State('rocketDashboard') public stateDashboard!: any;
  @State('rocketComps') public rocketComps: any;
  @Mutation('rocketDashboard/SET_CURRENTSERVICE') public SET_SERVICE: any;
  @Mutation('rocketDashboard/SET_CURRENTENDPOINT') public SET_CURRENTENDPOINT: any;
  @Mutation('rocketDashboard/SET_CURRENTINSTANCE') public SET_CURRENTINSTANCE: any;
  @Mutation('RUN_EVENTS') public RUN_EVENTS: any;
  private get compType() {
    return this.rocketComps.tree[this.rocketComps.current].type;
  }
  private selectService(i: any) {
    this.SET_SERVICE(i);
    this.RUN_EVENTS();
  }
  private selectEndpoint(i: any) {
    this.SET_CURRENTENDPOINT(i);
    this.RUN_EVENTS();
  }
  private selectInstance(i: any) {
    this.SET_CURRENTINSTANCE(i);
    this.RUN_EVENTS();
  }
}
</script>

<style lang="scss" scoped>
.rk-dashboard-bar {
  flex-shrink: 0;
  height: 52px;
  color: #efefef;
  background-color: #333840;
}
</style>
