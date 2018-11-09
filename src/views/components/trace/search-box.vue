<template>
<div>
  <div class="rk-trace-search-box container">
    <div class="item">
      <div class="mb5 label">Service</div>
      <select class="app" style="color:#fff;background: 0; border: 0; outline: none;" v-model="option.data.applicationId">
        <option style="background-color: #25292f;" value="ALL">All</option>
        <option style="background-color: #25292f;" :value="i.key" v-for="i in stateOptions.applications" :key="i.key">{{i.label}}</option>
      </select>
    </div>
    <div class="item">
      <div class="mb5 label">Endpoint</div>
      <input class="rk-trace-input" type="text" v-model="option.operationName">
    </div>
    <div class="item">
      <div class="mb5 label">TraceID</div>
      <input class="rk-trace-input" type="text" v-model="option.traceId">
    </div>
    <RkDate position="bottom" v-model="option.time" format="YYYY-MM-DD HH:mm:ss"/>
  </div>
  <div class="rk-trace-search-subbox container mb10">
    <div class="label">Max:</div>
    <input style="width:50px;" class="rk-trace-input mr15" type="number" v-model="option.maxTraceDuration">
    <div class="label">Min:</div>
    <input style="width:50px;" class="rk-trace-input mr15" type="number" v-model="option.minTraceDuration">
    <div class="label">Status:</div>
    <select class="app mr10" style="background: 0; border: 0; outline: none;" v-model="option.traceState">
      <option value="ALL">All</option>
      <option value="SUCCESS">Success</option>
      <option value="ERROR">Error</option>
    </select>
    <div class="label">Sort:</div>
    <select class="app" style="background: 0; border: 0; outline: none;" v-model="option.queryOrder">
      <option  value="BY_START_TIME">Start Time</option>
      <option  value="BY_DURATION">Duration</option>
    </select>
  </div>
  <div class="container clear">
    <RkPage class="r" :total="stateTrace.tracesTotal" :currentSize="15" :currentPage="option.page" @changePage="changePage"/>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import { Component, Watch } from 'vue-property-decorator';
import { getTraces } from '@/store/dispatch/trace.ts';

@Component({
  components: {},
})
export default class SearchBox extends Vue {
  @State('global') stateGlobal;
  @State('options') stateOptions;
  @State('trace') stateTrace;
  option = {
    time: [],
    data: {
      applicationId: 'ALL',
    },
    maxTraceDuration: '',
    minTraceDuration: '',
    operationName: '',
    traceId: '',
    traceState: 'ALL',
    queryOrder: 'BY_START_TIME',
    page: 1,
  };
  mounted() {
    if (window.sessionStorage.getItem('traceOption')) {
      const temp = JSON.parse(window.sessionStorage.getItem('traceOption'));
      temp.time = [this.stateGlobal.duration.start, this.stateGlobal.duration.end];
      this.option = temp;
    } else {
      this.option.time = [this.stateGlobal.duration.start, this.stateGlobal.duration.end];
    }
  }
  @Watch('option', { deep: true })
  onOptionChanged(): void {
    getTraces(this.option);
    window.sessionStorage.setItem('traceOption', JSON.stringify(this.option));
  }
  changePage(page) {
    this.option.page = page;
  }
}
</script>
<style lang="scss">
.rk-trace-search-subbox{
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #f6f7fb;
  border-bottom:1px solid rgba(0,0,0,.03);
  .item{
    margin-right: 30px;
  }
  .label{
    font-weight: 600;
    margin-right: 5px;
  }
  .rk-trace-input{
    background: 0;
    border: 0;
    outline: none;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(34, 34, 34, 0.2);
    transition: border-color .3s;
    &:focus{
      border-color: #6fa4ff;
    }
  }
}
.rk-trace-search-box{
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-top: 15px;
  padding-bottom:  15px;
  background-color: #333840;
  color: #fff;
  border-bottom:1px solid rgba(0,0,0,.05);
  .item{
    margin-right: 30px;
  }
  .label{
    font-weight: 600;
  }
  .rk-trace-input{
    color: #e8e8e8;
    background: 0;
    border: 0;
    outline: none;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(235,235,245,.3);
    transition: border-color .3s;
    &:focus{
      border-color: #5487ed;
    }
  }
}
</style>
