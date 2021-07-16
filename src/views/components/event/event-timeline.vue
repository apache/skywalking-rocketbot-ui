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
    <div
      v-for="(i, index) in rocketEvent.currentEvents"
      :key="index"
      class="mb-10 clear timeline-item"
      @click="showEventDetails(i)"
    >
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
    <rk-sidebox :width="'90%'" :show.sync="showDetails" :title="$t('eventDetail')">
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
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import { State as EventState } from '@/store/modules/event';
  import { Event } from '@/types/dashboard';
  import { EventsDetailKeys } from '../common/constant';

  @Component({ components: {} })
  export default class EventTimeline extends Vue {
    @State('rocketEvent') private rocketEvent!: EventState;
    private showDetails: boolean = false;
    private currentEvent: any = {
      startTime: 0,
      endTime: 0,
      message: '',
      name: '',
      type: '',
      uuid: '',
      source: {
        service: '',
        endpoint: '',
        serviceInstance: '',
      },
    };
    private eventsDetailKeys = EventsDetailKeys;

    private showEventDetails(item: Event) {
      this.showDetails = true;
      this.currentEvent = item;
    }
  }
</script>
<style lang="scss" scoped>
  @import '../common/index.scss';
</style>
