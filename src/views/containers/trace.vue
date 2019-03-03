<template>
  <div class="rk-trace flex-v">
    <TraceSearch/>
    <div class="rk-trace-inner">
      <TraceTable/>
      <TraceDetail :current="stateTrace.currentTrace" :spans="stateTrace.traceSpans"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import TraceSearch from '@/views/components/trace/trace-search.vue';
import TraceTable from '@/views/components/trace/trace-table.vue';
import TraceDetail from '@/views/components/trace/trace-detail.vue';
import trace from '../../store/modules/trace';
@Component({
  components: {
    TraceTable, TraceDetail, TraceSearch,
  },
})
export default class Trace extends Vue {
  @State('rocketTrace') private stateTrace!: any;
  @Mutation('SET_EVENTS') private SET_EVENTS: any;
  @Action('rocketTrace/GET_TRACELIST') private GET_TRACELIST: any;
  @Action('rocketTrace/GET_TRACESPANS') private GET_TRACESPANS: any;
  private show: boolean = true;
  private beforeCreate() {
    this.$store.registerModule('rocketTrace', trace);
  }
  private beforeMount() {
     this.SET_EVENTS([]);
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketTrace');
  }
}
</script>
<style lang="scss">
.rk-trace {
  flex-grow: 1;
  height: 100%;
}
.rk-trace-inner{
  height: 100%;
  display: flex;
}
</style>
