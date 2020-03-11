/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div class="profile-trace-dashboard flex-v">
    <div class="profile-trace-detail-wrapper mb-5 blue sm">
      <select class="profile-trace-detail-ids">
        <option v-for="i in currentSegment.traceIds" :value="i" :key="i">{{ i }}</option>
      </select>
      <select class="profile-trace-detail-ids" @change="spanModeChange($event)">
        <option value="include" key="include">include children</option>
        <option value="exclude" key="exclude">exclude children</option>
      </select>
      <a class="profile-analyze-btn bg-blue profile-trace-detail-ids" @click="analyzeProfile()">
        <span class="vm">{{ this.$t('analyze') }}</span>
      </a>
    </div>
    <TraceDetailChartTable :data="segmentSpans" :traceId="currentSegment.traceIds[0]" :showSpanDetail="false" />
    <ProfileDetailChartTable :data="profileAnalyzation" />
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { TraceDetailChartTable, ProfileDetailChartTable } from '../common';

  @Component({
    components: { TraceDetailChartTable, ProfileDetailChartTable },
  })
  export default class ProfileTraceDetail extends Vue {
    @Prop() private segmentSpans: any;
    @Prop() private currentSegment: any;
    @Prop() private profileAnalyzation: any;
    @Action('profileStore/GET_PROFILE_ANALYZE') private GET_PROFILE_ANALYZE: any;

    private currentSpan: any;
    private timeRange: any;
    private mode: string = 'include';

    private created() {
      this.$eventBus.$on('HANDLE-SELECT-SPAN', this, this.handleSelectSpan);
    }
    private handleSelectSpan(data: any) {
      this.currentSpan = data;
    }
    private spanModeChange(item: any) {
      this.mode = item.target.value;
      this.updateTimeRange();
    }
    private updateTimeRange() {
      if (!this.currentSpan) {
        this.currentSpan = this.segmentSpans[4];
      }
      if (this.mode === 'include') {
        this.timeRange = [
          {
            start: this.currentSpan.startTime,
            end: this.currentSpan.endTime,
          },
        ];
      } else {
        this.timeRange = [
          {
            start: this.currentSpan.startTime,
            end: this.currentSpan.endTime,
          },
        ];
      }
    }
    private analyzeProfile() {
      this.updateTimeRange();
      this.GET_PROFILE_ANALYZE({
        segmentId: this.currentSegment.segmentId,
        timeRanges: this.timeRange,
      });
    }
  }
</script>

<style lang="scss">
  .profile-trace-dashboard {
    padding: 20px;
    width: 68%;
    min-width: 350px;
    min-height: 150px;
    flex-shrink: 0;
    height: 100%;
    overflow: auto;
  }
  .profile-trace-detail-wrapper {
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .profile-trace-detail-ids {
    background-color: rgba(0, 0, 0, 0);
    outline: 0;
    border-style: unset;
    color: inherit;
    border: 1px solid;
    border-radius: 4px;
  }
  select {
    margin: 0 10px;
  }
  .profile-analyze-btn {
    color: #fff;
    padding: 3px 9px;
    background-color: #484b55;
    &.bg-blue {
      background-color: #448dfe;
    }
  }
</style>
