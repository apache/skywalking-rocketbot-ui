<template>
  <div class="rk-topo">
    <TopoAside/>
    <Topo :datas="{nodes:stateTopo.nodes,calls:stateTopo.calls}"/>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';
import { AxiosResponse } from 'axios';
import Topo from '../components/topology/topo.vue';
import TopoDate from '../components/topology/topo-date.vue';
import TopoAside from '../components/topology/topo-aside.vue';
import topo, { State as topoState} from '@/store/modules/topo';

@Component({components: {Topo, TopoAside, TopoDate}})
export default class Topology extends Vue {
  @State('rocketTopo') private stateTopo!: topoState;
  @Mutation('SET_EVENTS') private SET_EVENTS: any;
  @Action('rocketTopo/GET_TOPO') private GET_TOPO: any;
  @Getter('durationTime') private durationTime: any;
  private beforeMount(): void {
    this.SET_EVENTS([this.getTopo]);
  }
  private mounted() {
    this.getTopo();
  }
  private getTopo() {
    this.GET_TOPO({duration: this.durationTime});
  }
  private beforeCreate() {
    this.$store.registerModule('rocketTopo', topo);
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketTopo');
  }
}

</script>
<style lang="scss">
.rk-topo{
  position: relative;
  height: 100%;
  display: flex;
  background: #333840;
}
</style>
