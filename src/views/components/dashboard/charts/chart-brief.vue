/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <rk-panel :title="title">
  <div class="rk-chart-brief">
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#package`"></use>
      </svg>
      <span class="vm">{{this.$t('service')}}</span>
      <span class="r b">{{this.stateDashboard[this.type].getGlobalBrief.numOfService}}</span>
    </div>
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#code`"></use>
      </svg>
      <span class="vm">{{this.$t('endpoint')}}</span>
      <span class="r b">{{this.stateDashboard[this.type].getGlobalBrief.numOfEndpoint}}</span>
    </div>
    <div class="rk-chart-brief-i">
      <svg class="icon lg mr-15 vm">
        <use :xlink:href="`#epic`"></use>
      </svg>
      <span class="vm">{{this.$t('database')}}</span>
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
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import moment from 'dayjs';
@Component
export default class Brief extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
}
</script>
<style lang="scss">
.rk-chart-brief{
  height: 215px;
}
.rk-chart-brief-i{
  padding: 10px 0px;
}
</style>

