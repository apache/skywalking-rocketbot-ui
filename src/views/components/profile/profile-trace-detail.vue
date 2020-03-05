/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div class="profile-trace-dashboard flex-v">
    <div class="profile-trace-detail-wrapper">
      <div class="mb-5 blue sm">
        <select class="profile-trace-detail-ids" @change="GET_TRACE_SPANS({ traceId: i })">
          <option v-for="i in currentSegment.traceIds" :value="i" :key="i">{{ i }}</option>
        </select>
        <select class="profile-trace-detail-ids" @change="analyzeProfile()">
          <option value="include" key="include">include children</option>
          <option value="exclude" key="exclude">exclude children</option>
        </select>
      </div>
    </div>
    <TraceDetailChartTable :data="segmentSpans" :traceId="currentSegment.traceIds[0]" />
    <TraceDetailChartTable :data="segmentSpans" :traceId="currentSegment.traceIds[0]" />
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { TraceDetailChartTable } from '../common';

  @Component({
    components: { TraceDetailChartTable },
  })
  export default class ProfileTraceDetail extends Vue {
    @Prop() private segmentSpans: any;
    @Prop() private currentSegment: any;

    private analyzeProfile() {}
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
</style>
