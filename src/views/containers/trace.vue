<template>
<div>
  <SearchBox/>
  <div class="rk-trace">
  <!-- <ChartTrace/> -->
    <table class="rk-table">
      <thead>
        <tr>
          <th>Operate</th>
          <th>Start</th>
          <th>TraceId</th>
          <th>Duration</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in stateTrace.traces" :key="i.key">
          <td style="width:300px">
            <Tooltip max-width="300" :content="i.operationNames[0]" placement="top" style="max-width:300px" class="ell">
              <span :class="i.isError? 'error' : 'success'">{{i.operationNames[0]}}</span>
            </Tooltip>
          </td>
          <td class="grey" style="min-width:250px">{{parseInt(i.start) | dateformat}}</td>
          <td><a v-if="i.traceIds" class="rk-trace-btn" @click="$router.push({ path:'/trace/link', query:{traces:i.traceIds.join('&')}})">link</a></td>
          <td>{{i.duration}} ms</td>
          <td style="min-width:180px"><rk-progress :precent="i.duration/stateTraceMax*100" class="mr15"/></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Action } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import SearchBox from '../components/trace/search-box.vue';
import ChartTrace from '../components/trace/chart-scatter.vue';

@Component({
  components: { SearchBox, ChartTrace },
})
export default class Trace extends Vue {
  @State('global') stateGlobal;
  @State('trace') stateTrace;
  @Action('options/GET_APPLICATIONS') GET_APPLICATIONS;
  @Action('trace/CLEAR_TRACE') CLEAR_TRACE;
  get stateTraceMax() {
    return this.stateTrace.traces.map(i => i.duration).reduce((pre, cur) => Math.max(pre, cur));
  }
  created() {
    this.GET_APPLICATIONS();
  }
  beforeDestroy() {
    this.CLEAR_TRACE();
  }
}
</script>

<style lang="scss">
.rk-trace-btn{
  cursor: pointer;
  border-radius: 4px;
  background-color: #5487ed;
  border: 0;
  color: #fff;
  outline: none;
  padding: 3px .7em;
  transition: background-color .3s;
  &:hover{
    color: #fff;
    background-color: #6296ff;
  }
}
.rk-trace{
  padding: 15px 20px;
  overflow: auto;
  .error{
    &:before{
      display: inline-block;
      content: '';
      background-color:#f1483f;
      width:10px;
      height:10px;
      margin-right: 15px;
      border-radius: 5px;
    }
  }
  .success{
    &:before{
      display: inline-block;
      content: '';
      background-color:#22c36a;
      width:10px;
      height:10px;
      margin-right: 15px;
      border-radius: 5px;
    }
  }
}
</style>
