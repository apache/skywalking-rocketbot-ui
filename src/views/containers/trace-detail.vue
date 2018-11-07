<template>
<div style="height:100%">
  <RkDrawer :show.sync="show">
    <div slot="outer" class="micro-panel-outer">
      <div class="rk-trace-box mb15">
        <Icon class="rk-trace-back" type="ios-arrow-back" @click="back"/>
        <span class="mr15" style="font-weight:600;">TraceId:</span>
        <input type="text" class="rk-trace-input mr15" v-model="copy" v-if="switchType">
        <button class="rk-trace-change mr15" v-if="switchType" @click="handleSearch">Search</button>
        <select v-else class="mr15" v-model="traceId" style="color:#fafafa;background: 0; border: 0; outline: none;">
          <option style="background: #2f333c;" v-for="i in this.$route.query.traces.split('&')" :key="i" :value='i'>{{i}}</option>
        </select>
        <Icon type="md-swap" size="18" class="rk-trace-switch" :class="{'change':switchType}" @click="switchChange"/>
      </div>
      <TraceChart :data='stateTrace.spans' :traceId='traceId' @show="showBoard"/>
    </div>
    <div slot="inner" class="micro-panel-inner">
      <div class="rk-trace-detail">
        <h4 class="mb10">Tags.</h4>
        <div class="mb15"><span class="mr10">Label:</span><span>{{this.currentSpan.label}}</span></div>
        <div class="half mb15"><span class="two-fifth">Span Type:</span><span class="three-fifth">{{this.currentSpan.type}}</span></div>
        <div class="half mb15"><span class="two-fifth">Component:</span><span class="three-fifth">{{this.currentSpan.component}}</span></div>
        <div class="half mb15"><span class="two-fifth">Peer:</span><span class="three-fifth">{{this.currentSpan.peer||'No Peer'}}</span></div>
        <div class="half mb15"><span class="two-fifth">Error:</span><span class="three-fifth">{{this.currentSpan.isError}}</span></div>
        <div class="half mb15" v-for="i in this.currentSpan.tags" :key="i.key"><span class="two-fifth">{{i.key}}:</span><span class="three-fifth">{{i.value}}</span></div>
        <h4 class="mb10" v-if="this.currentSpan.logs" v-show="this.currentSpan.logs.length">Logs.</h4>
        <div v-for="(i, index) in this.currentSpan.logs" :key="index">
          <div class="mb10 sm"><span class="mr10">Time:</span><span class="grey">{{i.time | dateformat}}</span></div>
          <div class="mb15" v-for="(_i, _index) in i.data" :key="_index">
           <span class="one-fifth">{{_i.key}}:</span><pre class="four-fifth mt0 mb0" style="font-size：12px">{{_i.value}}</pre>
          </div>
        </div>
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
  copy = '';
  show = false;
  switchType = false;
  currentSpan = {};
  @Watch('traceId', { deep: true })
  onIdChanged(): void {
    getSpans(this.traceId);
  }
  back() {
    if (window.history.length <= 2) {
      this.$router.push('/');
    } else {
      this.$router.go(-1);
    }
  }
  handleSearch() {
    getSpans(this.copy);
  }
  switchChange() {
    if (this.switchType) getSpans(this.traceId);
    this.switchType = !this.switchType;
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
    .rk-trace-input{
    background: 0;
    border: 0;
    color: #fff;
    outline: none;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(235, 235, 245, 0.3);
    transition: border-color .3s;
    &:focus{
      border-color: #6fa4ff;
    }
  }
}
.rk-trace-change{
  cursor: pointer;
  border-radius: 4px;
  background-color: #4477dd;
  border: 0;
  color: #fff;
  outline: none;
  padding: 2px .7em;
  transition: background-color .3s;
  &:hover{
    background-color: #5286f0;
  }
}
.rk-trace-back{
  padding: 3px;
  background-color: rgba(255, 255, 255, 0.07);
  font-size: 21px;
  border-radius: 6px;
  transition: background-color .3s;
  margin-right: 25px;
  cursor: pointer;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  &:hover{
    background-color: #4477dd;
  }
}
.rk-trace-detail{
  padding: 15px;
}

.rk-trace-switch{
  cursor: pointer;
  padding: 4px;
  color: #7a7a7a;
  transition: color .3s,transform .3s;
  &:hover{
    color: #fff;
  }
  &.change{
    transform: rotate(180deg);
  }
}
</style>
