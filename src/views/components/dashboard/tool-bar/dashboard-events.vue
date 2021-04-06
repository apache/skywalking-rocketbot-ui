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
  <div class="event-list flex-h">
    <div class="rk-dashboard-tool-btn" @click="viewEventsList" v-show="enableEvents">
      <rk-icon class="lg" icon="settings" v-tooltip:left="{ content: $t('setEvent') }" />
    </div>
    <div class="rk-dashboard-tool-btn" @click="setEnbleEvents">
      <rk-icon
        class="lg"
        :class="enableEvents ? 'blue' : ''"
        icon="format_indent_increase"
        v-tooltip:left="{ content: enableEvents ? $t('disableEvents') : $t('enableEvents') }"
      />
    </div>
    <rk-sidebox width="1000px" :fixed="true" :show.sync="dialogEventVisible" @closeSideboxCallback="updateEvents">
      <div class="config-box">
        <div class="series-type" v-show="type === pageEventsType.DASHBOARD_EVENTS">
          <label class="title">{{ $t('eventSeries') }}</label>
          <RkSelect
            :mode="'multiple'"
            :current="rocketComps.currentSeriesType"
            :data="seriesTypes"
            @onChoose="(item) => changeSeriesType(item)"
          />
        </div>
        <div v-show="type === pageEventsType.DASHBOARD_EVENTS">
          <div class="title">{{ $t('serviceEvents') }}</div>
          <ul>
            <li class="header">
              <span class="check">
                <input type="checkbox" v-model="checkAllServiceEvents" @click="checkServiceEvents" />
              </span>
              <span v-for="(item, index) of eventsHeaders" :class="item.class" :key="item.class + index">{{
                $t(item.text)
              }}</span>
            </li>
            <li v-show="!rocketComps.serviceEvents.length">{{ $t('noData') }}</li>
            <li v-for="event in rocketComps.serviceEvents" :key="event.uuid" @click="viewEventDetail(event)">
              <span class="check">
                <input type="checkbox" :checked="!!event.checked" @click="selectEvents(event)" />
              </span>
              <span v-for="(item, index) of eventsHeaders" :class="item.class" :key="event.uuid + index">{{
                event[item.class]
              }}</span>
            </li>
          </ul>
        </div>
        <div v-show="type !== pageEventsType.TOPO_ENDPOINT_EVENTS">
          <div class="title">{{ $t('instanceEvents') }}</div>
          <ul>
            <li class="header">
              <span class="check">
                <input type="checkbox" v-model="checkAllInstanceEvents" @click="checkInstanceEvents" />
              </span>
              <span v-for="(item, index) of eventsHeaders" :class="item.class" :key="item.class + index">{{
                $t(item.text)
              }}</span>
            </li>
            <li v-show="!rocketComps.serviceInstanceEvents.length">{{ $t('noData') }}</li>
            <li v-for="event in rocketComps.serviceInstanceEvents" :key="event.uuid" @click="viewEventDetail(event)">
              <span class="check">
                <input type="checkbox" :checked="!!event.checked" @click="selectEvents(event)" />
              </span>
              <span v-for="(item, index) of eventsHeaders" :class="item.class" :key="event.uuid + index">{{
                event[item.class]
              }}</span>
            </li>
          </ul>
        </div>
        <div v-show="type !== pageEventsType.TOPO_INSTANCE_EVENTS">
          <div class="title">{{ $t('endpointEvents') }}</div>
          <ul>
            <li class="header">
              <span class="check">
                <input type="checkbox" v-model="checkAllEndpointEvents" @click="checkEndpointEvents" />
              </span>
              <span v-for="(item, index) of eventsHeaders" :class="item.class" :key="item.class + index">{{
                $t(item.text)
              }}</span>
            </li>
            <li v-show="!rocketComps.endpointEvents.length">{{ $t('noData') }}</li>
            <li v-for="event in rocketComps.endpointEvents" :key="event.uuid" @click="viewEventDetail(event)">
              <span class="check">
                <input type="checkbox" :checked="!!event.checked" @click="selectEvents(event)" />
              </span>
              <span v-for="(item, index) of eventsHeaders" :class="item.class" :key="event.uuid + index">{{
                event[item.class]
              }}</span>
            </li>
          </ul>
        </div>
        <div class="save-btn bg-blue" @click="updateEvents">{{ $t('setEvent') }}</div>
      </div>
    </rk-sidebox>
    <rk-sidebox :width="'1000px'" :show.sync="showEventDetail" :title="$t('eventDetail')">
      <div class="event-detail">
        <div class="mb-10 rk-flex" v-for="(item, index) in eventsDetailHeaders" :key="index">
          <span>{{ $t(item.text) }}: </span>
          <span v-if="item.class === 'parameters'">
            <span v-for="(item, index) of currentEvent[item.class]" :key="index"
              >{{ item.key }}={{ item.value }};
            </span>
          </span>
          <span v-else>{{ currentEvent[item.class] }}</span>
        </div>
      </div>
    </rk-sidebox>
  </div>
</template>
<script lang="ts">
  import { Mutation, Action } from 'vuex-class';
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { Event } from '@/types/dashboard';
  import { DurationTime, Option } from '@/types/global';
  import { UpdateDashboardEvents, SeriesTypes, EventsHeaders, EventsDetailHeaders } from '../constant';
  import { EntityType } from '../charts/constant';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { PageEventsType } from '@/constants/constant';

  @Component
  export default class DashboardEvent extends Vue {
    @Prop() private rocketComps!: rocketData;
    @Prop() private stateDashboard!: optionState;
    @Prop() private durationTime!: DurationTime;
    @Prop() private type!: string;
    @Mutation('SET_CHECKED_EVENTS') private SET_CHECKED_EVENTS: any;
    @Mutation('UPDATE_DASHBOARD') private UPDATE_DASHBOARD: any;
    @Mutation('SET_ENABLE_EVENTS') private SET_ENABLE_EVENTS: any;
    @Mutation('SET_DASHBOARD_EVENTS') private SET_DASHBOARD_EVENTS: any;
    @Mutation('SET_EVENTS_PAGE_TYPE') private SET_EVENTS_PAGE_TYPE!: (type: string) => void;
    @Mutation('SET_CURRENT_SERIES_TYPE') private SET_CURRENT_SERIES_TYPE!: (data: {
      item: Option;
      index: number;
    }) => void;
    @Mutation('SET_CLEAR_SELECTED_EVENTS') private SET_CLEAR_SELECTED_EVENTS!: () => void;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Action('GET_EVENT') private GET_EVENT: any;

    private dialogEventVisible: boolean = false;
    private enableEvents: boolean = false;
    private selectedEvents: Event[] = [];
    private checkAllServiceEvents: boolean = false;
    private checkAllInstanceEvents: boolean = false;
    private checkAllEndpointEvents: boolean = false;
    private showEventDetail: boolean = false;
    private currentEvent: Event | {} = {};
    private pageEventsType = PageEventsType;
    private seriesTypes = SeriesTypes;
    private eventsHeaders = EventsHeaders;
    private eventsDetailHeaders = EventsDetailHeaders;

    private created() {
      this.initEvents();
      this.SET_EVENTS([
        () => {
          if (!this.enableEvents) {
            return;
          }
          this.fetchEvents();
        },
      ]);
    }

    private initEvents() {
      this.SET_EVENTS_PAGE_TYPE(this.type);
      if (this.type === this.pageEventsType.DASHBOARD_EVENTS) {
        this.SET_CURRENT_SERIES_TYPE({ item: this.seriesTypes[0], index: -1 });
        this.SET_CURRENT_SERIES_TYPE({ item: this.seriesTypes[2], index: -1 });
      } else if (this.type === this.pageEventsType.TOPO_ENDPOINT_EVENTS) {
        this.SET_CURRENT_SERIES_TYPE({ item: this.seriesTypes[1], index: -1 });
      } else {
        this.SET_CURRENT_SERIES_TYPE({ item: this.seriesTypes[2], index: -1 });
      }
      this.updateAllChecked();
    }

    private viewEventsList() {
      this.dialogEventVisible = true;
      this.updateAllChecked();
    }

    private updateAllChecked() {
      this.checkAllServiceEvents = this.checkAllEvents(this.rocketComps.serviceEvents);
      this.checkAllEndpointEvents = this.checkAllEvents(this.rocketComps.endpointEvents);
      this.checkAllInstanceEvents = this.checkAllEvents(this.rocketComps.serviceInstanceEvents);
    }

    private checkAllEvents(events: Event[]) {
      if (!events.length) {
        return false;
      }
      const selectedServiceEvents = events.filter((item: Event) => item.checked);
      if (selectedServiceEvents.length === events.length) {
        return true;
      } else {
        return false;
      }
    }

    private viewEventDetail(event: Event) {
      this.showEventDetail = true;
      this.currentEvent = event;
    }

    private changeSeriesType(item: Option) {
      const index = this.rocketComps.currentSeriesType.findIndex((d: Option) => item.key === d.key);

      this.SET_CURRENT_SERIES_TYPE({ item, index });
      this.SET_CLEAR_SELECTED_EVENTS();
      const selectedEvents: Event[] = [];
      for (const type of this.rocketComps.currentSeriesType) {
        if (type.key === this.seriesTypes[0].key) {
          selectedEvents.push(...this.rocketComps.serviceEvents.slice(0, 3));
        } else if (type.key === this.seriesTypes[1].key) {
          selectedEvents.push(...this.rocketComps.endpointEvents.slice(0, 3));
        } else {
          selectedEvents.push(...this.rocketComps.serviceInstanceEvents.slice(0, 3));
        }
      }
      this.selectedEvents = selectedEvents.map((d: Event) => {
        d.checked = true;
        return d;
      });
      this.SET_CHECKED_EVENTS(this.selectedEvents);
      this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
      this.selectedEvents = [];
      this.updateAllChecked();
    }

    private setEnbleEvents() {
      this.enableEvents = !this.enableEvents;
      this.SET_ENABLE_EVENTS(this.enableEvents);
      if (!this.enableEvents) {
        this.clearAllEvents();
        this.checkAllServiceEvents = false;
        this.checkAllInstanceEvents = false;
        this.checkAllEndpointEvents = false;
        this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
        return;
      }
      this.fetchEvents();
    }

    private clearAllEvents() {
      this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[0].key });
      this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[2].key });
      this.SET_DASHBOARD_EVENTS({ events: [], type: EntityType[3].key });
    }

    private fetchEvents() {
      if (this.type === PageEventsType.DASHBOARD_EVENTS) {
        Promise.all([this.fetchServiceEvents(), this.fetchInstanceEvents(), this.fetchEndpointEvents()]).then(() => {
          this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
        });
        return;
      }
      if (this.type === PageEventsType.TOPO_INSTANCE_EVENTS) {
        this.fetchInstanceEvents().then(() => {
          this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
        });
        return;
      }
      if (this.type === PageEventsType.TOPO_ENDPOINT_EVENTS) {
        this.fetchEndpointEvents().then(() => {
          this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
        });
      }
    }

    private fetchServiceEvents() {
      return this.GET_EVENT({
        condition: {
          time: this.durationTime,
          size: 20,
          source: {
            service: this.stateDashboard.currentService.label,
          },
        },
        type: EntityType[0].key,
      });
    }

    private fetchInstanceEvents() {
      return this.GET_EVENT({
        condition: {
          time: this.durationTime,
          size: 20,
          source: {
            service: this.stateDashboard.currentService.label,
            serviceInstance: this.stateDashboard.currentInstance.label,
          },
        },
        type: EntityType[3].key,
      });
    }

    private fetchEndpointEvents() {
      return this.GET_EVENT({
        condition: {
          time: this.durationTime,
          size: 20,
          source: {
            service: this.stateDashboard.currentService.label,
            endpoint: this.stateDashboard.currentEndpoint.label,
          },
        },
        type: EntityType[2].key,
      }).then(() => {
        if (this.type === PageEventsType.DASHBOARD_EVENTS) {
          return;
        }
        this.UPDATE_DASHBOARD({ key: UpdateDashboardEvents + new Date().getTime() });
      });
    }

    private selectEvents(data: Event, e: any) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      const index = this.selectedEvents.findIndex(
        (item: Event) => item.uuid === data.uuid && item.entityType === data.entityType,
      );

      data.checked = !data.checked;
      if (index > -1) {
        this.selectedEvents[index].checked = data.checked;
      } else {
        this.selectedEvents.push(data);
      }
    }

    private updateEvents() {
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

    private beforeDestroy() {
      this.clearAllEvents();
      this.SET_ENABLE_EVENTS(false);
      this.SET_EVENTS([]);
    }

    @Watch('durationTime')
    private watchDurationTime() {
      if (!this.enableEvents) {
        return;
      }
      this.fetchEvents();
    }
  }
</script>
<style lang="scss" scoped>
  .event-list {
    color: #444;
  }
  .rk-dashboard-tool-btn {
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 4px;
    margin-left: 5px;
    padding: 3px;
    color: #efefef;
    cursor: pointer;
  }
  .rk-sidebox-title {
    color: #444;
  }
  .config-box {
    color: #444;
    .series-type {
      margin-bottom: 20px;
      width: 400px;
    }
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
      max-height: 200px;
      min-height: 100px;
      overflow: auto;
      margin-bottom: 20px;
      .header {
        font-weight: bold;
      }
      .check {
        width: 30px;
        input {
          cursor: pointer;
        }
      }
      .starTime,
      .endTime {
        width: 150px;
      }
      .uuid,
      .parameters {
        width: 280px;
      }
      .message {
        width: 220px;
      }
    }
    li {
      cursor: pointer;
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
  .event-detail {
    color: #444;
  }
</style>
