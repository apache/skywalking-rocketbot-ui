/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */
<template>
  <div class="rk-comparison flex-h">
    <ConparisonCharts :chartSource="comparison.chartSource" />
    <ConparisonConfig :currentOptions="comparison.currentOptions" :optSource="comparison.dataSource" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State, Getter, Mutation } from 'vuex-class';
  import { ConparisonConfig, ConparisonCharts } from '../components/comparison';
  import { DurationTime } from '@/types/global';
  import compareObj from '@/utils/comparison';

  @Component({
    components: {
      ConparisonConfig,
      ConparisonCharts,
    },
  })
  export default class Comparison extends Vue {
    @State('comparisonStore') private comparison: any;
    @Getter('durationTime') private durationTime: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Mutation('comparisonStore/SET_ISPREVIOUS') private SET_ISPREVIOUS: any;
    private beforeMount() {
      this.$store.dispatch('comparisonStore/GET_SERVICES', {
        duration: this.durationTime,
      });
      this.SET_EVENTS([this.reloadConfig]);
    }
    private reloadConfig() {
      this.$store.dispatch('comparisonStore/RENDER_CHART', this.durationTime);
    }
  }
</script>

<style lang="scss">
  .rk-comparison {
    height: 100%;
    overflow: auto;
  }
</style>
