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
    <div class="title">service events</div>
    <ul>
      <li class="header">
        <span class="check">select</span>
        <span class="id">id</span>
        <span>name</span>
        <span>service name</span>
        <span class="time">start time</span>
        <span class="time">end time</span>
      </li>
      <li v-show="!rocketData.serviceEvents.length">no data</li>
      <li v-for="event in rocketData.serviceEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" @click="selectEvents(event)"/></span>
        <span class="id">{{ event.uuid }}</span>
        <span>{{ event.name }}</span>
        <span>{{ event.source.service }}</span>
        <span class="time">{{ event.startTime | dateformat }}</span>
        <span class="time">{{ event.endTime | dateformat }}</span>
      </li>
    </ul>
    <div class="title">instance events</div>
    <ul>
      <li class="header">
        <span class="check">select</span>
        <span class="id">id</span>
        <span>name</span>
        <span>service name</span>
        <span>instance name</span>
        <span class="time">start time</span>
        <span class="time">end time</span>
      </li>
      <li v-show="!rocketData.serviceInstanceEvents.length">no data</li>
      <li v-for="event in rocketData.serviceInstanceEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" @click="selectEvents(event)"/></span>
        <span class="id">{{ event.uuid }}</span>
        <span>{{ event.name }}</span>
        <span>{{ event.source.service }}</span>
        <span>{{ event.source.serviceInstance }}</span>
        <span class="time">{{ event.startTime | dateformat }}</span>
        <span class="time">{{ event.endTime | dateformat }}</span>
      </li>
    </ul>
    <div class="title">endpoint events</div>
    <ul>
      <li class="header">
        <span class="check">select</span>
        <span class="id">id</span>
        <span>name</span>
        <span>service name</span>
        <span>endpoint name</span>
        <span class="time">start time</span>
        <span class="time">end time</span>
      </li>
      <li v-show="!rocketData.endpointEvents.length">no data</li>
      <li v-for="event in rocketData.endpointEvents" :key="event.uuid">
        <span class="check"><input type="checkbox" @click="selectEvents(event)"/></span>
        <span class="id">{{ event.uuid }}</span>
        <span>{{ event.name }}</span>
        <span>{{ event.source.service }}</span>
        <span>{{ event.source.endpoint }}</span>
        <span class="time">{{ event.startTime | dateformat }}</span>
        <span class="time">{{ event.endTime | dateformat }}</span>
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
  import { EntityType } from './charts/constant';

  @Component
  export default class DashboardEvent extends Vue {
    @State('rocketData') private rocketData!: rocketData;
    @Mutation('SET_CURRENT_EVENTS') private SET_CURRENT_EVENTS: any;
    @Prop() private closeBox: any;
    private selectedEvents: Event[] = [];

    private selectEvents(data: Event) {
      const index = this.selectedEvents.findIndex((item: Event) => item.uuid === data.uuid);
      if (data.source.endpoint) {
        data.entityType = EntityType[2].key;
      } else if (data.source.serviceInstance) {
        data.entityType = EntityType[3].key;
      } else {
        data.entityType = EntityType[0].key;
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
<style scope lang="scss">
  .config-box {
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
      margin-top: 10px;
      cursor: pointer;
    }
    ul {
      // width: 850px;
      max-height: 240px;
      min-height: 100px;
      overflow: auto;
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
