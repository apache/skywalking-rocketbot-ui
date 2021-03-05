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
  <RkEcharts height="100%" :option="optionConfigs" :clickEvent="clickLinks" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import * as echarts from 'echarts/lib/echarts';

  @Component
  export default class DependencySankey extends Vue {
    @Prop() private data: any;
    @Getter('durationTime') private durationTime: any;
    @Action('rocketTopo/GET_INSTANCE_DEPENDENCY_METRICS')
    private GET_INSTANCE_DEPENDENCY_METRICS: any;

    get optionConfigs() {
      return {
        series: {
          type: 'sankey',
          left: 40,
          top: 20,
          right: 300,
          bottom: 40,
          emphasis: { focus: 'adjacency' },
          data: this.data.nodes,
          links: this.data.calls,
          label: {
            color: '#fff',
            formatter: (param: any) => param.data.name,
          },
          color: ['#3fe1da', '#6be6c1', '#3fcfdc', '#626c91', '#3fbcde', '#a0a7e6', '#3fa9e1', '#96dee8', '#bf99f8'],
          itemStyle: {
            borderWidth: 0,
          },
          lineStyle: {
            color: 'source',
            opacity: 0.12,
          },
        },
      };
    }

    private clickLinks(params: any) {
      if (params.dataType === 'edge' && params.data) {
        this.$emit('showMetrics', params.data);
      }
    }
  }
</script>
