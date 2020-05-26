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
  <div class="dashboard-container clear">
    <DashboardItem
      v-for="(i, index) in endpointComps || []"
      :key="index + i.t + i.w + i.d"
      :rocketGlobal="{ edit: false }"
      :item="i"
      :index="index"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import DashboardItem from '@/views/components/dashboard/dashboard-item.vue';

  @Component({
    components: {
      DashboardItem,
    },
  })
  export default class InstancesSurvey extends Vue {
    private endpointComps: any = [];

    private created() {
      const dashboard: string = `${window.localStorage.getItem('dashboard')}`;
      const tree = JSON.parse(dashboard);
      const groupComps =
        (tree || []).filter((group: { type: string; children: any[] }) => group.type === 'service')[0] || {};
      const comps =
        (groupComps.children || []).filter((item: { type: string; children: any[] }) => item.type === 'Endpoint')[0] ||
        {};
      this.endpointComps = comps.children;
    }
  }
</script>

<style lang="less" scoped></style>
