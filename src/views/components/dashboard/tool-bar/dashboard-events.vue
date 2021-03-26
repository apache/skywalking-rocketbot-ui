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
  <div class="flex-h">
    <div class="rk-dashboard-bar-btn" @click="setEnbleEvents" v-show="compType === dashboardType.SERVICE">
      <rk-icon
        class="lg"
        :class="enableEvents ? 'blue' : ''"
        icon="format_indent_increase"
        v-tooltip:bottom="{ content: enableEvents ? $t('disableEvents') : $t('enableEvents') }"
      />
    </div>
    <div class="rk-dashboard-bar-btn" @click="() => (dialogEventVisible = true)" v-show="enableEvents">
      <rk-icon class="lg" icon="settings" v-tooltip:bottom="{ content: $t('setEvent') }" />
    </div>
    <rk-sidebox width="950px" :fixed="true" :show.sync="dialogEventVisible">
      <div class="config-box">
        <div class="title">{{ $t('serviceEvents') }}</div>
        <ul>
          <li class="header">
            <span class="check"
              ><input type="checkbox" v-model="checkAllServiceEvents" @click="checkServiceEvents"
            /></span>
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
            <span class="check"
              ><input type="checkbox" v-model="checkAllInstanceEvents" @click="checkInstanceEvents"
            /></span>
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
            <span class="check"
              ><input type="checkbox" v-model="checkAllEndpointEvents" @click="checkEndpointEvents"
            /></span>
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
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Mutation, Action } from 'vuex-class';
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { Event } from '@/types/dashboard';
  import { DurationTime } from '@/types/global';
  import { UpdateDashboardEvents } from '../constant';
  import { EntityType } from '../charts/constant';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { DASHBOARDTYPE } from '../constant';

  @Component
  export default class DashboardEvent extends Vue {
    @Prop() private rocketComps!: rocketData;
    @Prop() private stateDashboard!: optionState;
    @Prop() private compType!: string;
    @Prop() private durationTime!: DurationTime;
    @Mutation('SET_CHECKED_EVENTS') private SET_CHECKED_EVENTS: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;
    @Mutation('SET_ENABLE_EVENTS') private SET_ENABLE_EVENTS: any;
    @Mutation('SET_DASHBOARD_EVENTS') private SET_DASHBOARD_EVENTS: any;
    @Action('GET_EVENT') private GET_EVENT: any;

    private dialogEventVisible: boolean = false;
    private dashboardType = DASHBOARDTYPE;
    private enableEvents: boolean = false;
    private selectedEvents: Event[] = [];
    private checkAllServiceEvents: boolean = true;
    private checkAllInstanceEvents: boolean = false;
    private checkAllEndpointEvents: boolean = false;

    private setEnbleEvents() {
      this.enableEvents = !this.enableEvents;
      this.SET_ENABLE_EVENTS(this.enableEvents);
      if (!this.enableEvents) {
        this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[0].key });
        this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[2].key });
        this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[3].key });
        this.checkAllServiceEvents = true;
        this.checkAllInstanceEvents = false;
        this.checkAllEndpointEvents = false;
        this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
        return;
      }
      Promise.all([
        this.GET_EVENT({
          condition: {
            time: this.durationTime,
            size: 20,
            source: {
              service: this.stateDashboard.currentService.label,
            },
          },
          type: EntityType[0].key,
        }),
        this.GET_EVENT({
          condition: {
            time: this.durationTime,
            size: 20,
            source: {
              service: this.stateDashboard.currentService.label,
              serviceInstance: this.stateDashboard.currentInstance.label,
            },
          },
          type: EntityType[3].key,
        }),
        this.GET_EVENT({
          condition: {
            time: this.durationTime,
            size: 20,
            source: {
              service: this.stateDashboard.currentService.label,
              endpoint: this.stateDashboard.currentEndpoint.label,
            },
          },
          type: EntityType[2].key,
        }),
      ]).then(() => {
        this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
      });
    }

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
      this.dialogEventVisible = false;
    }

    private checkServiceEvents() {
      for (const event of this.rocketComps.serviceEvents) {
        if (this.checkAllServiceEvents) {
          event.checked = false;
        } else {
          event.checked = true;
        }
        this.selectedEvents = this.selectedEvents.filter(
          (item: Event) => !(item.entityType === EntityType[0].label && item.uuid === event.uuid),
        );
      }
      if (!this.checkAllServiceEvents) {
        this.selectedEvents.push(...this.rocketComps.serviceEvents);
      }
    }

    private checkInstanceEvents() {
      for (const event of this.rocketComps.serviceInstanceEvents) {
        if (this.checkAllInstanceEvents) {
          event.checked = false;
        } else {
          event.checked = true;
        }
        this.selectedEvents = this.selectedEvents.filter(
          (item: Event) => !(item.entityType === EntityType[3].label && item.uuid === event.uuid),
        );
      }
      if (!this.checkAllInstanceEvents) {
        this.selectedEvents.push(...this.rocketComps.serviceInstanceEvents);
      }
    }

    private checkEndpointEvents() {
      for (const event of this.rocketComps.endpointEvents) {
        if (this.checkAllEndpointEvents) {
          event.checked = false;
        } else {
          event.checked = true;
        }
        this.selectedEvents = this.selectedEvents.filter(
          (item: Event) => !(item.entityType === EntityType[2].label && item.uuid === event.uuid),
        );
      }
      if (!this.checkAllEndpointEvents) {
        this.selectedEvents.push(...this.rocketComps.endpointEvents);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rk-dashboard-bar-btn {
    padding: 0 8px;
    border-right: 2px solid #252a2f;
    height: 19px;
    cursor: pointer;
  }
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
