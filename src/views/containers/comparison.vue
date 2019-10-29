/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div class="rk-comparison flex-h">
    <ConparisonConfig />
    <ConparisonCharts />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';

  import ConparisonConfig from '../components/comparison/comparison-config.vue';
  import ConparisonCharts from '../components/comparison/comparison-charts.vue';

  @Component({
    components: {
      ConparisonConfig,
      ConparisonCharts,
    },
  })
  export default class Comparison extends Vue {

    }
</script>

<style lang="scss">
  .rk-comparison {
    height: 100%;
  }
</style>
