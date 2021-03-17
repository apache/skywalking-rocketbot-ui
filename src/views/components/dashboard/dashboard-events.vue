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
    <ul>
      <li>
        <span>id</span>
        <span>name</span>
        <span>start time</span>
        <span>end time</span>
      </li>
      <li v-for="event in rocketData.events" :key="event.uuid" @click="updateEvent(event)">
        <span>{{ event.uuid }}</span>
        <span>{{ event.name }}</span>
        <span>{{ event.startTime }}</span>
        <span>{{ event.endTime }}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
  import { State, Mutation } from 'vuex-class';
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { Event } from '@/types/dashboard';

  @Component
  export default class DashboardEvent extends Vue {
    @State('rocketData') private rocketData!: rocketData;
    @Mutation('SET_CURRENT_EVENTS') private SET_CURRENT_EVENTS: any;
    @Prop() private itemIndex!: number;
    @Prop() private closeBox: any;

    private updateEvent(event: Event) {
      this.SET_CURRENT_EVENTS({ ...event, itemIndex: this.itemIndex });
      this.closeBox();
    }
  }
</script>
<style scope lang="scss">
  ul {
    // border: 1px solid #ccc;
  }
  li {
    cursor: pointer;
    span {
      width: 200px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      display: inline-block;
      border-bottom: 1px solid #ccc;
      overflow: hidden;
    }
  }
</style>
