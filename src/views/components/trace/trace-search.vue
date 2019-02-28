<template>
  <div class="rk-trace-list-search">
    <div>
      <a class="rk-trace-list-search-btn r" @click="status = !status">
        <span class="mr-5 vm">More</span>
        <svg class="icon trans vm" :style="`transform: rotate(${status?180:0}deg);`">
          <use xlink:href="#arrow-down"></use>
        </svg>
      </a>
      <a class="rk-trace-list-search-btn bgblue r mr-10" @click="getTraceList">
        <svg class="icon mr-5 vm">
          <use xlink:href="#search"></use>
        </svg>
        <span class="vm">Search</span>
      </a>
      <div class="flex-h">
        <TraceSelect :hasSearch="true" title="Service" :value="service" @input="chooseService" :data="rocketTrace.services"/>
        <TraceSelect :hasSearch="true" title="Instance" v-model="instance" :data="rocketTrace.instances"/>
        <TraceSelect  title="Status" :value="traceState" @input="chooseStatus"
        :data="[{label:'All', key: 'ALL'}, {label:'Success', key: 'SUCCESS'}, {label:'Error', key: 'ERROR'}]"/>
        <div class="mr-10" style="padding: 3px 15px 0">
          <div class="sm grey">Endpoint Name</div>
          <input type="text"  v-model="endpointName" class="rk-trace-list-search-input">
        </div>
      </div>
    </div>
    <div class="rk-trace-list-search-more flex-h" v-show="status">
      <div class="mr-15">
        <span class="sm b grey mr-10">TraceID:</span>
        <div class="dib">
          <input type="text" v-model="traceId" class="rk-trace-list-search-input">
        </div>
      </div>
      <div class="mr-15">
        <span class="sm b grey mr-10">Range:</span>
        <div class="rk-trace-list-search-range">
          <input class="vm" v-model="minTraceDuration">
          <span class="grey vm">-</span>
          <input class="vm" v-model="maxTraceDuration">
        </div>
      </div>
      <div>
        <span class="sm b grey mr-5">Time Range:</span>
        <RkDate class="sm" v-model="time" position="bottom" format="YYYY-MM-DD HH:mm:ss"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, Getter, State } from 'vuex-class';
import { Trace, DurationTime, Option } from '../../../store/interfaces';
import TraceSelect from './trace-select.vue';

@Component({components: {TraceSelect}})
export default class TraceTool extends Vue {
  @State('rocketTrace') private rocketTrace: any;
  @Getter('durationTime') private durationTime: any;
  @Action('rocketTrace/GET_SERVICES') private GET_SERVICES: any;
  @Action('rocketTrace/GET_INSTANCES') private GET_INSTANCES: any;
  @Action('rocketTrace/GET_TRACELIST') private GET_TRACELIST: any;
  @Action('rocketTrace/SET_TRACEFORM') private SET_TRACEFORM: any;

  private time: Date[] = [new Date(new Date().getTime() - 900000) , new Date()];
  private status: boolean = true;
  private maxTraceDuration: string = '';
  private minTraceDuration: string = '';
  private service: Option  = {label: 'All', key: ''};
  private instance: Option  = {label: 'All', key: ''};
  private endpointName: string = '';
  private traceId: string = '';
  private traceState: Option  = {label: 'All', key: 'ALL'};
  private dateFormate = (date: Date, step: string) => {
    const year = date.getFullYear();
    const monthTemp = date.getMonth() + 1;
    let month: string = `${monthTemp}`;
    if (monthTemp < 10) {
      month = `0${monthTemp}`;
    }
    if (step === 'MONTH') {
      return `${year}-${month}`;
    }
    const dayTemp = date.getDate();
    let day: string = `${dayTemp}`;
    if (dayTemp < 10) { day = `0${dayTemp}`; }
    if (step === 'DAY') { return `${year}-${month}-${day}`; }
    const hourTemp = date.getHours();
    let hour: string = `${hourTemp}`;
    if (hourTemp < 10) { hour = `0${hourTemp}`; }
    if (step === 'HOUR') { return `${year}-${month}-${day} ${hour}`; }
    const minuteTemp = date.getMinutes();
    let minute: string = `${minuteTemp}`;
    if (minuteTemp < 10) { minute = `0${minuteTemp}`; }
    if (step === 'MINUTE') { return `${year}-${month}-${day} ${hour}${minute}`; }
  }
  private globalTimeFormate = (time: Date[]): any => {
    let step = 'MINUTE';
    const unix = Math.round(time[1].getTime()) - Math.round(time[0].getTime());
    if (unix <= 60 * 60 * 1000) {
      step = 'MINUTE';
    } else if (unix <= 24 * 60 * 60 * 1000) {
      step = 'HOUR';
    } else if (unix <= 30 * 24 * 60 * 60 * 1000) {
      step = 'DAY';
    } else {
      step = 'MONTH';
    }
    return { start: this.dateFormate(time[0], step), end: this.dateFormate(time[1], step), step };
  }
  private chooseService(i: any) {
    if (this.service.key === i.key) {
      return;
    }
    this.instance = {label: 'All', key: ''};
    this.service = i;
    if (i.key === '') {
      return;
    }
    this.GET_INSTANCES({duration: this.durationTime, serviceId: i.key});
  }
  private chooseStatus(i: any) {
    this.traceState = i;
  }
  private getTraceList() {
    this.GET_SERVICES({duration: this.durationTime});
    const temp: any = {
        queryDuration: this.globalTimeFormate(this.time),
        traceState:  this.traceState.key,
        paging: {pageNum: 1, pageSize: 15, needTotal: true},
        queryOrder: this.rocketTrace.traceForm.queryOrder,
    };
    if (this.service.key) { temp.serviceId = this.service.key; }
    if (this.instance.key) { temp.serviceInstanceId = this.instance.key; }
    if (this.maxTraceDuration) { temp.maxTraceDuration = this.maxTraceDuration; }
    if (this.minTraceDuration) { temp.minTraceDuration = this.minTraceDuration; }
    if (this.endpointName) { temp.endpointName = this.endpointName; }
    if (this.traceId) { temp.traceId = this.traceId; }
    this.SET_TRACEFORM(temp);
    this.GET_TRACELIST();
  }
  private mounted() {
    this.getTraceList();
  }
}
</script>

<style lang="scss">
.rk-trace-list-search {
  flex-shrink: 0;
  background-color: #333840;
  color: #efefef;
  width: 100%;
  padding: 3px 15px 8px;
}
.rk-trace-list-search-input, {
  border-style: unset;
  background-color: #fff;
  outline: 0;
  padding: 2px 5px;
  border-radius: 3px;
}
.rk-trace-list-search-range{
  border-radius: 3px;
  display: inline-block;
  background-color: #fff;
  padding: 1px;
  color: #3d444f;
  border-radius: 3px;
  input{
    text-align: center;
    border-radius: 0px;
    width: 38px;
    border-style: unset;
    background-color: rgba(0, 0,0, 0);
    outline: 0;
  }
}
.rk-trace-list-search-btn{
  padding: 4px 10px;
  background-color: #484b55;
  border-radius: 3px;
  margin-top: 12px;
  &.bgblue{
    background-color: #428cfd;
  }
}
.rk-trace-list-search-more{
  background-color: #484b55;
  padding: 4px 10px;
  border-radius: 3px;
  margin-top: 8px;
  position: relative;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
  &:after {
    bottom: 100%;
    right: 30px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(0, 0,0, 0);
    border-bottom-color: #484b55;
    border-width: 8px;
    margin-right: 0px;
  }
}
</style>
