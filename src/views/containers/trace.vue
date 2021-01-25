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
  <div class="rk-trace flex-v">
    <TraceSearch />
    <div class="rk-trace-inner">
      <TraceTable />
      <TraceDetail :current="stateTrace.currentTrace" :spans="stateTrace.traceSpans" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Option } from '@/types/global';
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { State, Action, Mutation } from 'vuex-class';
  import TraceSearch from '@/views/components/trace/trace-search.vue';
  import TraceTable from '@/views/components/trace/trace-table.vue';
  import TraceDetail from '@/views/components/trace/trace-detail.vue';

  @Component({
    components: {
      TraceTable,
      TraceDetail,
      TraceSearch,
    },
  })
  export default class Trace extends Vue {
    @State('rocketTrace') private stateTrace!: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;

    @Prop({ default: () => ({ label: 'All', key: '' }) })
    private service!: Option;

    @Prop({ default: false, type: Boolean })
    private beforeMount() {
      this.SET_EVENTS([]);
    }
  }
</script>
<style lang="scss">
  .rk-trace {
    flex-grow: 1;
    height: 100%;
    min-height: 0;
  }
  .rk-trace-inner {
    height: 100%;
    display: flex;
    min-height: 0;
  }
</style>
