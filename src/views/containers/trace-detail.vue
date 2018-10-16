<template>
<div>
  <div class="rk-trace-box mb15">
    <span class="mr15" style="font-weight:600;">TraceId:</span>
    <select class="mr15" v-model="traceId" style="color:#fafafa;background: 0; border: 0; outline: none;">
      <option v-for="i in this.$route.query.traces.split('&')" :key="i" :value='i'>{{i}}</option>
    </select>
  </div>
  <div style="width:100%">
    <TraceChart :data='stateTrace.spans' :traceId='traceId'/>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getSpans } from '@/store/dispatch/trace.ts';
import { Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import TraceChart from '../components/trace/trace-charts.vue';

@Component({
  components: { TraceChart },
})
export default class Trace extends Vue {
  @State('trace') stateTrace;
  traceId = '';
  @Watch('traceId', { deep: true })
  onIdChanged(): void {
    getSpans(this.traceId);
  }
  created() {
    this.traceId = this.$route.query.traces.split('&')[0];
    // getSpans(this.traceId);
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
</style>
