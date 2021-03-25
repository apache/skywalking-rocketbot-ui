<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->
<template>
  <div class="config-box">
    <div class="title">{{ $t('serviceEvents') }}</div>
    <ul>
      <li class="header">
        <span class="check">{{ $t('select') }}</span>
        <span class="id">{{ $t('eventID') }}</span>
        <span>{{ $t('eventName') }}</span>
        <span class="time">{{ $t('startTime') }}</span>
        <span class="time">{{ $t('endTime') }}</span>
      </li>
      <li v-show="!rocketComps.serviceEvents.length">{{ $t('noData') }}</li>
      <li v-for="event in rocketComps.serviceEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" :checked="!!event.checked" @click="selectEvents(event)"/></span>
        <span class="id">{{ event.uuid }}</span>
        <span>{{ event.name }}</span>
        <span class="time">{{ event.startTime }}</span>
        <span class="time">{{ event.endTime }}</span>
      </li>
    </ul>
    <div class="title">{{ $t('instanceEvents') }}</div>
    <ul>
      <li class="header">
        <span class="check">{{ $t('select') }}</span>
        <span class="id">{{ $t('eventID') }}</span>
        <span>{{ $t('eventName') }}</span>
        <span class="time">{{ $t('startTime') }}</span>
        <span class="time">{{ $t('endTime') }}</span>
      </li>
      <li v-show="!rocketComps.serviceInstanceEvents.length">{{ $t('noData') }}</li>
      <li v-for="event in rocketComps.serviceInstanceEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" :checked="!!event.checked" @click="selectEvents(event)"/></span>
        <span class="id">{{ event.uuid }}</span>
        <span>{{ event.name }}</span>
        <span class="time">{{ event.startTime }}</span>
        <span class="time">{{ event.endTime }}</span>
      </li>
    </ul>
    <div class="title">{{ $t('endpointEvents') }}</div>
    <ul>
      <li class="header">
        <span class="check">{{ $t('select') }}</span>
        <span class="id">{{ $t('eventID') }}</span>
        <span>{{ $t('eventName') }}</span>
        <span class="time">{{ $t('startTime') }}</span>
        <span class="time">{{ $t('endTime') }}</span>
      </li>
      <li v-show="!rocketComps.endpointEvents.length">{{ $t('noData') }}</li>
      <li v-for="event in rocketComps.endpointEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" :checked="!!event.checked" @click="selectEvents(event)"/></span>
        <span class="id">{{ event.uuid }}</span>
        <span>{{ event.name }}</span>
        <span class="time">{{ event.startTime }}</span>
        <span class="time">{{ event.endTime }}</span>
      </li>
    </ul>
    <div class="save-btn bg-blue" @click="updateEvent()">{{ $t('setEvent') }}</div>
  </div>
</template>
<script lang="ts">
  import { Mutation } from 'vuex-class';
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { Event } from '@/types/dashboard';
  import { UpdateDashboardEvents } from '../constant';

  @Component
  export default class DashboardEvent extends Vue {
    @Prop() private rocketComps!: rocketData;
    @Prop() private closeBox: any;
    @Prop() private stateDashboard: any;
    @Mutation('SET_CHECKED_EVENTS') private SET_CHECKED_EVENTS: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;

    private selectedEvents: Event[] = [];

    private selectEvents(data: Event) {
      const index = this.selectedEvents.findIndex(
        (item: Event) => item.uuid === data.uuid && item.entityType === data.entityType,
      );

      data.checked = !data.checked;
      if (index > -1) {
        this.selectedEvents.splice(index, 1);
      }
      this.selectedEvents.push(data);
    }

    private updateEvent() {
      this.SET_CHECKED_EVENTS(this.selectedEvents);
      this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
      this.selectedEvents = [];
      this.closeBox();
    }
  }
</script>
<style lang="scss" scoped>
  .config-box {
    color: #444;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .save-btn {
      width: 120px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
    }
    ul {
      max-height: 240px;
      min-height: 100px;
      overflow: auto;
      margin-bottom: 20px;
      .header {
        font-weight: bold;
      }
      .check {
        width: 60px;
        input {
          cursor: pointer;
        }
      }
      .time {
        width: 150px;
      }
      .id {
        width: 300px;
      }
    }
    li {
      span {
        width: 150px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        display: inline-block;
        border-bottom: 1px solid #ccc;
        overflow: hidden;
      }
    }
  }
</style>
