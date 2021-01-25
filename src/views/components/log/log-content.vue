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
  <div class="log-container">
    <LogServiceDetail :data="logState.logs || []" :loading="logState.loading" v-if="logState.type.key === 'service'" />
    <LogBrowserDetail :data="logState.logs || []" :loading="logState.loading" v-else />
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Vue } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import LogBrowserDetail from './log-browser-detail.vue';
  import LogServiceDetail from './log-service-detail.vue';

  @Component({
    components: { LogBrowserDetail, LogServiceDetail },
  })
  export default class LogContent extends Vue {
    @State('rocketLog') private logState: any;
  }
</script>

<style scoped lang="scss">
  .log-container {
    overflow: auto;
    padding: 5px 15px 15px;
    height: 100%;
    flex-grow: 1;
  }
</style>
