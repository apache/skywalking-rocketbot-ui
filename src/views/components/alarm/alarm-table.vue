<template>
<div class="rk-alarm-table clear">
  <div v-for="(i,index) in data" :key="index" class="mb-10 clear">
    <div class="g-sm-3 grey sm hide-xs rk-alarm-time-line tc">{{parseInt(i.startTime) | dateformat}}</div>
    <div class="rk-alarm-table-i g-sm-9">
      <div class="message mb-5 b"><span class="mr-10 sm">#{{i.key}}</span>{{i.message}}</div>
      <div class="rk-alarm-table-i-scope mr-10 l sm" :class="{
        'blue': i.scope === 'Service',
        'green':i.scope === 'Endpoint',
        'yellow':i.scope === 'ServiceInstance',
      }">{{i.scope}}</div>
      <div class="grey sm show-xs">{{parseInt(i.startTime) | dateformat}}</div>
    </div>
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
  padding: 30px 20px 20px 40px;

}
.rk-alarm-time-line{
  padding: 20px 0;
  min-height: 63px;
}
.rk-alarm-table-i{
  padding: 10px 15px;
  border-left: 4px solid rgba(46, 47, 51, 0.05);
  position: relative;
  &:after{
    content: '';
    display: inline-block;
    position: absolute;
    width: 8px;
    height: 8px;
    left: -23px;
    top: 25px;
    border-radius: 4px;
    background-color: #458eff;
  }
  &:before{
    content: '';
    display: inline-block;
    position: absolute;
    width: 2px;
    height: calc(100% + 11px);
    top: 0;
    left: -20px;
    border-radius: 5px;
    background-color: #458eff99;
  }
}
.rk-alarm-table-i-scope{
  display: inline-block;
  padding: 0px 8px;
  border: 1px solid;
  margin-top: -1px;
  border-radius: 4px;
}
</style>
