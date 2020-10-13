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
  <div class="flex-v rk-log">
    <LogBar :logState="logState"></LogBar>
    <div class="log-container">
      <LogDetailTable
        :data="logState.logs"
        :loading="logState.loading"
        v-if="logState.type.key === 'browser'"
      ></LogDetailTable>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import LogBar from '@/views/components/log/log-bar.vue';
  import LogDetailTable from '@/views/components/log/log-detail-table.vue';
  @Component({
    components: {
      LogBar,
      LogDetailTable,
    },
  })
  export default class Log extends Vue {
    @Getter('durationTime') private durationTime: any;
    @State('rocketLog') private logState: any;
  }
</script>

<style scoped lang="scss">
  .rk-log {
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
  }
  .log-container {
    overflow: auto;
    padding: 5px 15px 15px;
    height: 100%;
    flex-grow: 1;
  }
</style>
