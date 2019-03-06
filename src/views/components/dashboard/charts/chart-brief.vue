<template>
  <div class="rk-chart-brief">
    <div class="grey mb-10">{{title}}</div>
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#package`"></use>
      </svg>
      <span class="vm">Service</span>
      <span class="r b">{{this.stateDashboard[this.type].getGlobalBrief.numOfService}}</span>
    </div>
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#code`"></use>
      </svg>
      <span class="vm">Endpoint</span>
      <span class="r b">{{this.stateDashboard[this.type].getGlobalBrief.numOfEndpoint}}</span>
    </div>
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#epic`"></use>
      </svg>
      <span class="vm">Database</span>
      <span class="r b">{{this.stateDashboard[this.type].getGlobalBrief.numOfDatabase}}</span>
    </div>
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#token`"></use>
      </svg>
      <span class="vm">Cache</span>
      <span class="r b">{{this.stateDashboard[this.type].getGlobalBrief.numOfCache}}</span>
    </div>
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#soft-unwrap`"></use>
      </svg>
      <span class="vm">MQ</span>
      <span class="r b">{{this.stateDashboard[this.type].getGlobalBrief.numOfMQ}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import moment from 'dayjs';
@Component
export default class Response extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
}
</script>
<style lang="scss">
.rk-chart-brief{
  height: 258px;
  padding: 0 10px 10px;
}
.rk-chart-brief-i{
  padding: 10px 0px;
}
</style>

