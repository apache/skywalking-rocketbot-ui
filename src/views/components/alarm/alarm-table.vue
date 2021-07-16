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
  <div class="rk-timeline-table clear">
    <div v-for="(i, index) in data" :key="index" class="mb-10 clear timeline-item" @click="showDetails(i)">
      <div class="g-sm-3 grey sm hide-xs rk-time-line tr">
        {{ parseInt(i.startTime) | dateformat }}
      </div>
      <div class="rk-timeline-table-i g-sm-9">
        <div class="message mb-5 b">
          {{ i.message }}
        </div>
        <div
          class="rk-timeline-table-i-scope mr-10 l sm"
          :class="{
            blue: i.scope === 'Service',
            green: i.scope === 'Endpoint',
            yellow: i.scope === 'ServiceInstance',
          }"
        >
          {{ $t(i.scope.toLowerCase()) }}
        </div>
        <div class="grey sm show-xs">
          {{ parseInt(i.startTime) | dateformat }}
        </div>
      </div>
    </div>
    <rk-sidebox :width="'90%'" :show.sync="isShowDetails" :title="$t('alarmDetail')">
      <div class="mb-10 clear rk-flex" v-for="(item, index) in AlarmDetailCol" :key="index">
        <template>
          <span class="g-sm-2 grey">{{ $t(item.value) }}:</span>
          <span v-if="item.label === 'startTime'">{{ currentDetail[item.label] | dateformat }}</span>
          <span v-else-if="item.label === 'tags'">
            <div v-for="(d, index) in alarmTags" :key="index">{{ d }}</div>
          </span>
          <span v-else-if="item.label === 'events'" class="event-detail">
            <div>
              <ul>
                <li>
                  <span v-for="(i, index) of eventsHeaders" :class="i.class" :key="i.class + index">
                    {{ $t(i.text) }}
                  </span>
                </li>
                <li v-for="event in currentEvents" :key="event.uuid" @click="viewEventDetail(event)">
                  <span v-for="(d, index) of eventsHeaders" :class="d.class" :key="event.uuid + index">
                    <span v-if="d.class === 'startTime' || d.class === 'endTime'">
                      {{ event[d.class] | dateformat }}
                    </span>
                    <span v-else>
                      {{ event[d.class] }}
                    </span>
                  </span>
                </li>
              </ul>
              <rk-sidebox :width="'90%'" :show.sync="showEventDetails" :title="$t('eventDetail')">
                <div class="event-detail">
                  <div class="mb-10 rk-flex" v-for="(eventKey, index) in eventsDetailKeys" :key="index">
                    <span class="keys">{{ $t(eventKey.text) }}</span>
                    <span v-if="eventKey.class === 'parameters'">
                      <span v-for="(d, index) of currentEvent[d.class]" :key="index">{{ d.key }}={{ d.value }}; </span>
                    </span>
                    <span v-else-if="eventKey.class === 'startTime' || eventKey.class === 'endTime'">{{
                      currentEvent[eventKey.class] | dateformat
                    }}</span>
                    <span v-else-if="eventKey.class === 'source'" class="source">
                      <span>{{ $t('currentService') }}: {{ currentEvent[eventKey.class].service }}</span>
                      <div v-show="currentEvent[eventKey.class].endpoint">
                        {{ $t('currentEndpoint') }}: {{ currentEvent[eventKey.class].endpoint }}
                      </div>
                      <div v-show="currentEvent[eventKey.class].serviceInstance">
                        {{ $t('currentInstance') }}: {{ currentEvent[eventKey.class].serviceInstance }}
                      </div>
                    </span>
                    <span v-else>{{ currentEvent[eventKey.class] }}</span>
                  </div>
                </div>
              </rk-sidebox>
            </div>
          </span>
          <span v-else>{{ currentDetail[item.label] }}</span>
        </template>
      </div>
    </rk-sidebox>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Alarm, Event } from '@/types/alarm';
  import { EventsDetailHeaders, AlarmDetailCol } from './constant';
  import { EventsDetailKeys } from '../common/constant';

  @Component
  export default class AlarmTable extends Vue {
    @Prop({ default: () => [] }) private data!: Alarm[];
    private isShowDetails: boolean = false;
    private currentDetail: Alarm = {
      tags: [],
      scope: 'All',
      message: '',
      key: '',
      startTime: '',
      events: [],
    };
    private showEventDetails: boolean = false;
    private alarmTags: string[] = [];
    private AlarmDetailCol = AlarmDetailCol;
    private eventsHeaders = EventsDetailHeaders;
    private eventsDetailKeys = EventsDetailKeys;
    private currentEvents: Event[] = [];
    private currentEvent: Event = {
      startTime: 0,
      endTime: 0,
      message: '',
      name: '',
      type: '',
      uuid: '',
      source: {},
    };

    private showDetails(item: Alarm) {
      this.currentDetail = item;
      this.currentEvents = item.events;
      this.alarmTags = this.currentDetail.tags.map((d: { key: string; value: string }) => {
        return `${d.key} = ${d.value}`;
      });
      this.isShowDetails = true;
    }

    private viewEventDetail(event: Event) {
      this.showEventDetails = true;
      this.currentEvent = event;
    }
  }
</script>

<style lang="scss" scoped>
  @import '../common/index.scss';
</style>
