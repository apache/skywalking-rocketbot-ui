<template>
<div style="height:100%">
  <RkDrawer :show.sync="show">
    <div slot="outer" class="micro-panel-outer">
      <div class="rk-trace-box mb15">
        <span class="mr15" style="font-weight:600;">TraceId:</span>
        <select class="mr15" v-model="traceId" style="color:#fafafa;background: 0; border: 0; outline: none;">
          <option style="background: #2f333c;" v-for="i in this.$route.query.traces.split('&')" :key="i" :value='i'>{{i}}</option>
        </select>
      </div>
      <TraceChart :data='stateTrace.spans' :traceId='traceId' @show="showBoard"/>
    </div>
    <div slot="inner" class="micro-panel-inner">
      <div class="rk-trace-detail">
        <div class="half mb15"><span class="two-fifth">Span Type:</span><span class="three-fifth">{{this.currentSpan.type}}</span></div>
        <div class="half mb15"><span class="two-fifth">Component:</span><span class="three-fifth">{{this.currentSpan.component}}</span></div>
        <div class="half mb15"><span class="two-fifth">Peer:</span><span class="three-fifth">{{this.currentSpan.peer||'No Peer'}}</span></div>
        <div class="half mb15"><span class="two-fifth">Error:</span><span class="three-fifth">{{this.currentSpan.isError}}</span></div>
        <div class="half mb15" v-for="i in this.currentSpan.tags" :key="i.key"><span class="two-fifth">{{i.key}}:</span><span class="three-fifth">{{i.value}}</span></div>
      </div>
    </div>
  </RkDrawer>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getSpans } from '@/store/dispatch/trace.ts';
import { Component, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import TraceChart from '../components/trace/trace-charts.vue';

@Component({
  components: { TraceChart },
})
export default class Trace extends Vue {
  @State('trace') stateTrace;
  @Action('trace/CLEAR_TRACE') CLEAR_TRACE;
  traceId = '';
  show = false;
  currentSpan = {};
  @Watch('traceId', { deep: true })
  onIdChanged(): void {
    getSpans(this.traceId);
  }
  showBoard(d) {
    this.show = true;
    this.currentSpan = d.data;
  }
  beforeDestroy() {
    this.CLEAR_TRACE();
  }
  created() {
    this.traceId = this.$route.query.traces.split('&')[0];
  }
}
</script>

<style lang="scss">
.rk-trace-box{
    padding: 15px 30px;
    display: flex;
    align-items: center;
    background-color: #2f333c;
    color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.rk-trace-detail{
  padding: 15px;
}
</style>
