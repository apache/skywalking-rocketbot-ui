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
  <div class="rk-endpoint-dependency">
    <DependencySankey :data="stateTopo.endpointDependency" @showMetrics="showEndpointMetrics" />
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { State, Action, Getter, Mutation } from 'vuex-class';
  import { State as topoState } from '@/store/modules/topology';
  // import Topo from './chart/topo.vue';
  // import TopoChart from './topo-chart.vue';
  import DependencySankey from './dependency-sankey.vue';
  // import ChartLine from './chart-line.vue';

  @Component({
    components: {
      // Topo,
      // ChartLine,
      // TopoChart,
      DependencySankey,
    },
  })
  export default class TopoEndpointDependency extends Vue {
    @Getter('durationTime') private durationTime: any;
    @Getter('intervalTime') private intervalTime: any;
    @State('rocketTopo') private stateTopo!: topoState;

    private showEndpointMetrics(data: any) {
      console.log(data);
    }
  }
</script>
<style lang="scss">
  .rk-endpoint-dependency {
    background: #333840;
    height: 100%;
  }
</style>
