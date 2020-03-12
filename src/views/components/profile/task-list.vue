/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div class="profile-task-list flex-v">
    <div class="profile-task-wrapper flex-v">
      <div class="rk-trace-t-loading" v-show="loading">
        <svg class="icon loading">
          <use xlink:href="#spinner"></use>
        </svg>
      </div>
      <div class="rk-trace-t-wrapper scroll_hide">
        <table class="rk-trace-t">
          <tr class="rk-trace-tr cp" v-for="(i, index) in taskListSource" @click="selectTask(i)" :key="index">
            <td
              class="rk-trace-td"
              :class="{
                selected: selectedTask === i.id,
              }"
            >
              <div class="ell mb-5">
                <span class="b">{{ i.endpointName }}</span>
              </div>
              <div class="grey ell sm">
                <span class="rk-tag mr-10 sm">{{ i.duration }} ms</span>{{ i.startTime | dateformat }}
                <span class="rk-tag mr-10 sm">{{ i.maxSamplingCount }}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="profile-trace-wrapper profile-segment flex-v">
      <div class="rk-trace-t-loading" v-show="loading">
        <svg class="icon loading">
          <use xlink:href="#spinner"></use>
        </svg>
      </div>
      <div class="rk-trace-t-wrapper scroll_hide">
        <table class="rk-trace-t">
          <tr class="rk-trace-tr cp" v-for="(i, index) in segmentList" @click="selectTrace(i)" :key="index">
            <td
              class="rk-trace-td"
              :class="{
                'rk-trace-success': !i.isError,
                'rk-trace-error': i.isError,
                selected: selectedKey == i.key,
              }"
            >
              <div
                class="ell mb-5"
                :class="{
                  blue: !i.isError,
                  red: i.isError,
                }"
              >
                <span class="b">{{ i.endpointNames[0] }}</span>
              </div>
              <div class="grey ell sm">
                <span class="rk-tag mr-10 sm">{{ i.duration }} ms</span>{{ parseInt(i.start) | dateformat }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';

  @Component
  export default class ProfileTaskList extends Vue {
    @Prop() private taskListSource: any;
    @Prop() private segmentList: any;
    @Action('profileStore/GET_SEGMENT_LIST') private GET_SEGMENT_LIST: any;
    @Mutation('profileStore/SET_CURRENT_SEGMENT') private SET_CURRENT_SEGMENT: any;
    @Action('profileStore/GET_SEGMENT_SPANS') private GET_SEGMENT_SPANS: any;
    private loading: any;
    private selectedKey: string = '';
    private selectedTask: string = '';

    private created() {
      this.loading = false;
    }

    private selectTask(item: { id: string; segmentId: string }) {
      this.selectedTask = item.id;
      this.GET_SEGMENT_LIST({ taskID: item.id });
    }

    private selectTrace(item: { key: string; segmentId: string }) {
      this.SET_CURRENT_SEGMENT(item);
      this.selectedKey = item.key;
      this.GET_SEGMENT_SPANS({ segmentId: item.segmentId });
    }
  }
</script>

<style lang="scss">
  .profile-task-list {
    width: 30%;
    min-height: 150px;
    min-width: 350px;
    height: 100%;
    overflow: auto;
    .profile-task-wrapper {
      height: 100%;
      width: 100%;
    }
    .profile-trace-wrapper {
      height: 100%;
      width: 100%;
    }
    .rk-trace-td {
      padding: 8px 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      &.selected {
        background-color: #ededed;
      }
    }
  }
  .profile-segment {
    margin-top: 10px;
    border-top: 1px solid #ccc;
  }
</style>
