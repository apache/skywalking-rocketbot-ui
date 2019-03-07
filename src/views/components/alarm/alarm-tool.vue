<template>
  <nav class="rk-alarm-tool flex-h">
    <AlarmSelect title="Filter Scope" :value="alarmScope" @input="handleFilter" :data="alarmOptions"/>
    <div class="mr-10" style="padding: 3px 15px 0">
      <div class="sm grey">Search Keyword</div>
      <input type="text"  :value="keyword" class="rk-alarm-tool-input" @input="handleRefresh">
    </div>
    <RkPage class="mt-15" :currentSize="20" :currentPage="pageNum" @changePage="handlePage" :total="total"/>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import AlarmSelect from './alarm-select.vue';
import { Action, Mutation } from 'vuex-class';

@Component({components: {AlarmSelect}})
export default class AlarmTool extends Vue {
  @Mutation('SET_EVENTS') private SET_EVENTS: any;
  @Action('rocketAlarm/GET_ALARM') private GET_ALARM: any;
  @Prop() private durationTime: any;
  @Prop() private total!: number;
  private pageNum: number = 1;
  private alarmScope: any = {label: 'Global', key: ''};
  private alarmOptions: any = [
    {label: 'Global', key: ''},
    {label: 'Service', key: 'Service'},
    {label: 'ServiceInstance', key: 'ServiceInstance'},
    {label: 'Endpoint', key: 'Endpoint'},
  ];
  private keyword: string = '';

  private handlePage(pageNum: number) {
    this.handleRefresh(pageNum);
  }
  private handleFilter(i: any) {
    this.alarmScope = i;
    this.handleRefresh(1);
  }
  private handleRefresh(pageNum: number) {
    this.pageNum = pageNum;
    const params: any = {
      duration: this.durationTime,
      paging: {
        pageNum,
        pageSize: 20,
        needTotal: true,
      },
    };
    if (this.alarmScope.key) { params.scope = this.alarmScope.key; }
    if (this.keyword) { params.keyword = this.keyword; }
    this.GET_ALARM(params);
  }
  private beforeMount() {
    this.SET_EVENTS([() => { this.handleRefresh(1); } ]);
    this.handleRefresh(1);
  }
}
</script>

<style lang="scss">
.rk-alarm-tool{
  border-bottom:1px solid #c1c5ca41;
  height: 52px;
  background-color: #333840;
  padding: 0 15px;
  color: #efefef;
  flex-shrink: 0;
}
.rk-alarm-tool-input {
  border-style: unset;
  outline: 0;
  padding: 2px 5px;
  border-radius: 3px;
}
</style>
