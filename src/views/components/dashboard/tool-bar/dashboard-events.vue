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
      <li v-show="!rocketData.serviceEvents.length">{{ $t('noData') }}</li>
      <li v-for="event in rocketData.serviceEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" @click="selectEvents(event, entityType[0].key)"/></span>
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
      <li v-show="!rocketData.serviceInstanceEvents.length">{{ $t('noData') }}</li>
      <li v-for="event in rocketData.serviceInstanceEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" @click="selectEvents(event, entityType[3].key)"/></span>
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
      <li v-show="!rocketData.endpointEvents.length">{{ $t('noData') }}</li>
      <li v-for="event in rocketData.endpointEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" @click="selectEvents(event, entityType[2].key)"/></span>
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
  import { State, Mutation } from 'vuex-class';
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { Event } from '@/types/dashboard';
  import { EntityType } from '../charts/constant';

  @Component
  export default class DashboardEvent extends Vue {
    @State('rocketData') private rocketData!: rocketData;
    @Mutation('SET_CURRENT_EVENTS') private SET_CURRENT_EVENTS: any;
    @Prop() private closeBox: any;
    private entityType = EntityType;
    private selectedEvents: Event[] = [];

    private selectEvents(data: Event, type: string) {
      const index = this.selectedEvents.findIndex((item: Event) => item.uuid === data.uuid);
      if (EntityType[2].key === type) {
        data.entityType = type;
      }
      if (type === EntityType[3].key) {
        data.entityType = type;
      }
      if (type === EntityType[0].key) {
        data.entityType = type;
      }
      if (index < 0) {
        this.selectedEvents.push(data);
      } else {
        this.selectedEvents.splice(index, 1);
      }
    }

    private updateEvent() {
      this.SET_CURRENT_EVENTS(this.selectedEvents);
      this.closeBox();
    }

    private beforeDestroy() {
      this.SET_CURRENT_EVENTS([]);
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
