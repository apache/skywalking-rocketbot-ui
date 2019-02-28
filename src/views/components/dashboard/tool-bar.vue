<template>
  <div class="rk-dashboard-bar flex-h">
    <ToolBarSelect @onChoose="selectService" title="Current Service" :current="stateDashboard.currentService" :data="stateDashboard.services" />
    <ToolBarSelect @onChoose="selectEndpoint" title="Current Endpoint" :current="stateDashboard.currentEndpoint" :data="stateDashboard.endpoints" />
    <ToolBarSelect @onChoose="selectInstance" title="Current Instance" :current="stateDashboard.currentInstance" :data="stateDashboard.instances" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ToolBarSelect from './tool-bar-select.vue';
import { State, Action, Mutation } from 'vuex-class';
@Component({components: {ToolBarSelect}})
export default class ToolBar extends Vue {
  @State('rocketDashboard') public stateDashboard!: any;
  @Mutation('rocketDashboard/SET_CURRENTSERVICE') public SET_SERVICE: any;
  @Mutation('rocketDashboard/SET_CURRENTENDPOINT') public SET_CURRENTENDPOINT: any;
  @Mutation('rocketDashboard/SET_CURRENTINSTANCE') public SET_CURRENTINSTANCE: any;
  @Mutation('RUN_EVENTS') public RUN_EVENTS: any;
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
  height: 50px;
  color: #efefef;
  background-color: #333840;
}
</style>
