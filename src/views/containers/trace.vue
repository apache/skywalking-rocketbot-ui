<template>
  <div class="rk-trace">
    <TraceSearch/>
    <div class="rk-trace-inner">
      <TraceList/>
      <TraceDetail :current="stateTrace.currentTrace" :spans="stateTrace.traceSpans"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, Mutation } from 'vuex-class';
import TraceSearch from '@/views/components/trace/trace-search.vue';
import TraceList from '@/views/components/trace/trace-list.vue';
import TraceDetail from '@/views/components/trace/trace-detail.vue';
import trace from '../../store/modules/trace';
import { Trace } from '../../store/interfaces';
@Component({
  components: {
    TraceList, TraceDetail, TraceSearch,
  },
})
export default class Home extends Vue {
  @State('rocketTrace') public stateTrace!: Trace;
  @Action('rocketTrace/GET_TRACELIST') public GET_TRACELIST: any;
  @Action('rocketTrace/GET_TRACESPANS') public GET_TRACESPANS: any;
  private show: boolean = true;
  private beforeCreate() {
    this.$store.registerModule('rocketTrace', trace);
  }
  private beforeDestroy() {
    this.$store.unregisterModule('rocketTrace');
  }
}
</script>
<style lang="scss">
.rk-trace {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  .rk-trace-inner{
    height: 100%;
    display: flex;
  }
}
</style>
