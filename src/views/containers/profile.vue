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
  <div class="rk-profile flex-v">
    <ProfileHeader
      :headerSource="profile.headerSource"
      :newTaskFields="profile.newTaskFields"
      :taskFieldSource="profile.taskFieldSource"
    />
    <div class="rk-profile-context">
      <ProfileTaskList
        :headerSource="profile.headerSource"
        :taskListSource="profile.taskListSource"
        :segmentList="profile.segmentList"
      />
      <ProfileTraceDetail
        :currentSegment="profile.currentSegment"
        :segmentSpans="profile.segmentSpans"
        :profileAnalyzation="profile.profileAnalyzation"
        :highlightTop="profile.highlightTop"
        :currentSpan="profile.currentSpan"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State, Getter, Action, Mutation } from 'vuex-class';
  import { State as profileState } from '@/store/modules/profile/profile-store';
  import ProfileHeader from '@/views/components/profile/profile-header.vue';
  import ProfileTaskList from '@/views/components/profile/task-list.vue';
  import ProfileTraceDetail from '@/views/components/profile/profile-trace-detail.vue';

  @Component({
    components: { ProfileHeader, ProfileTaskList, ProfileTraceDetail },
  })
  export default class Profile extends Vue {
    @State('profileStore') private profile!: profileState;
    @Getter('durationTime') private durationTime: any;
    @Action('profileStore/GET_SERVICES') private GET_SERVICES: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;

    private beforeMount() {
      this.GET_SERVICES({
        duration: this.durationTime,
      });
      this.SET_EVENTS([
        () => {
          this.GET_SERVICES({ duration: this.durationTime });
        },
      ]);
    }
    private beforeDestroy() {
      this.SET_EVENTS([]);
    }
  }
</script>

<style lang="scss">
  .rk-profile {
    height: 100%;
    overflow: auto;
  }
  .rk-profile-context {
    height: 100%;
    display: flex;
    min-height: 0;
  }
</style>
