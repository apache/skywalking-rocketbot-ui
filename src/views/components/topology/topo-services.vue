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
  <div class="link-topo-aside-box" style="padding:0;">
    <TopoSelect :current="service" :data="services" @onChoose="handleChange" />
  </div>
</template>
<script lang="ts">
  import { DurationTime } from '@/types/global';
  import compareObj from '@/utils/comparison';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation } from 'vuex-class';
  import TopoSelect from './topo-select.vue';

  @Component({ components: { TopoSelect } })
  export default class TopoServices extends Vue {
    @Getter('durationTime') public durationTime: any;
    @Action('rocketTopo/GET_TOPO') public GET_TOPO: any;
    @Action('rocketTopo/GET_SERVICES') private GET_SERVICES: any;
    @Mutation('rocketTopoGroup/UNSELECT_GROUP') private UNSELECT_GROUP: any;
    private services = [{ key: 0, label: 'All services' }];
    private service = { key: 0, label: 'All services' };

    private fetchData() {
      this.GET_SERVICES({ duration: this.durationTime }).then((json: any[]) => {
        this.services = [...this.services, ...json];
      });
    }

    @Watch('durationTime')
    private watchDurationTime(newValue: DurationTime, oldValue: DurationTime) {
      // Avoid repeating fetchData() after enter the component for the first time.
      if (compareObj(newValue, oldValue)) {
        this.fetchData();
      }
    }

    private handleChange(i: any) {
      this.service = i;
      this.UNSELECT_GROUP();
      this.GET_TOPO({
        serviceId: this.service.key,
        duration: this.durationTime,
      });
    }

    private created() {
      this.fetchData();
      const groups = localStorage.getItem('topology-groups');
      if (groups) {
        const jsonGroup = JSON.parse(groups);
        if (!jsonGroup.length) {
          this.GET_TOPO({
            serviceId: 0,
            duration: this.durationTime,
          });
        }
      } else {
        this.GET_TOPO({
          serviceId: this.service.key,
          duration: this.durationTime,
        });
      }
    }
  }
</script>
<style lang="scss">
  .topo-server.dao-select .dao-select-main .dao-select-switch {
    border: 0;
  }
</style>
