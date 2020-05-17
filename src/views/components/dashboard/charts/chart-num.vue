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
  <div class="rk-chart-num b">
    <span>{{ (Object.values(data)[0] || 0).toFixed(2) }}</span>
    <span class="rk-chart-num-unit">{{ unit }}</span>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartNum extends Vue {
    @Prop() private data!: any;
    @Prop() private item!: any;
    @Prop() private intervalTime!: any;
    get unit() {
      let unit = 'ms' as string | null;
      if (
        this.item.d === 'databaseThroughput' ||
        this.item.d === 'serviceThroughput' ||
        this.item.d === 'instanceThroughput' ||
        this.item.d === 'endpointThroughput'
      ) {
        unit = 'cpm';
      }
      if (
        this.item.d === 'databaseSLA' ||
        this.item.d === 'serviceSLA' ||
        this.item.d === 'instanceSLA' ||
        this.item.d === 'endpointSLA'
      ) {
        unit = '%';
      }
      if (this.item.d === 'serviceApdexScore') {
        unit = null;
      }
      return unit;
    }
  }
</script>
<style lang="scss">
  .rk-chart-num {
    font-size: 24px;
  }
  .rk-chart-num-unit {
    font-size: 16px;
  }
</style>
