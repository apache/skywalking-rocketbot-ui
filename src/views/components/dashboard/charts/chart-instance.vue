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
  <div class="chart-instance-info">
    <div class="ell mb-10 pt-10 b" v-tooltip="rocketOption.currentInstance.label || ''">
      {{ this.rocketOption.currentInstance.label }}
    </div>
    <div>
      <span class="mr-5 mb-5 grey">Language</span>
      <span>{{ this.rocketOption.currentInstance.language }}</span>
    </div>
    <div v-for="(i, index) in rocketOption.currentInstance.attributes" :key="index">
      <span class="mr-5 mb-5 grey">{{ i.name }}</span>
      <span>{{ i.value }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import moment from 'dayjs';
  import { State } from 'vuex-class';
  @Component
  export default class ChartInstance extends Vue {
    @State('rocketOption') private rocketOption!: any;
    @Prop() private intervalTime!: any;
  }
</script>
<style lang="scss">
  .chart-instance-info {
    height: 215px;
    overflow: auto;
  }
</style>
