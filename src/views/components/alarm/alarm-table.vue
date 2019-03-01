<template>
<div class="rk-alarm-table clear">
  <div class="rk-alarm-table-i g-md-6" v-for="i in data">
    <div class="message mb-5 ell" v-tooltip:top.ellipsis="i.message || ''"><span class="b mr-10 sm">#{{i.key}}</span>{{i.message}}</div>
    <div class="rk-alarm-table-i-scope mr-10 l sm" :class="{
      'blue': i.scope === 'Service',
      'green':i.scope === 'Endpoint',
      'yellow':i.scope === 'ServiceInstance',
    }">{{i.scope}}</div>
    <div class="grey sm">{{parseInt(i.startTime) | dateformat}}</div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';


@Component
export default class AlarmTable extends Vue {
  @Prop({default: () => []}) private data: any;
}
</script>

<style lang="scss" scoped>
.rk-alarm-table{
  padding: 20px 15px;
}
.rk-alarm-table-i{
  padding: 10px 15px;
  background-color: rgba(196, 200, 225, 0.1);
  margin-top: 15px;
  border-left: 4px solid rgba(46, 47, 51, 0.05);
  border-right: 15px solid #fff;
}
.rk-alarm-table-i-scope{
  display: inline-block;
  padding: 0px 8px;
  border: 1px solid;
  margin-top: -1px;
  border-radius: 4px;
}
</style>
