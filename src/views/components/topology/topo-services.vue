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
  <div class="selector-topo-aside-box">
    <TopoSelect :current="group" :data="groups" @onChoose="changeGroup" />
    <TopoSelect :current="service" :data="currentServices" @onChoose="handleChange" />
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
    private services = [{ key: '', label: 'All services', group: '' }];
    private currentServices = [{ key: '', label: 'All services' }];
    private service = { key: '', label: 'All services' };
    private groups = [{ key: '', label: 'All groups' }];
    private group = { key: '', label: 'All groups' };

    private created() {
      this.fetchData();
    }

    get currentServiceList() {
      const services = this.services.filter((item) => item.group === this.group.key);

      return this.group.key ? services : [{ key: '', label: 'All services' }, ...this.services];
    }

    private fetchData() {
      this.GET_SERVICES({ duration: this.durationTime })
        .then((json: Array<{ key: string; label: string; group: string }>) => {
          const groups = [] as string[];
          for (const g of json) {
            if (!groups.includes(g.group)) {
              groups.push(g.group);
            }
          }
          this.groups = [
            ...groups.map((g) => {
              return {
                key: g,
                label: g,
              };
            }),
            { key: '', label: 'All groups' },
          ];
          this.group = this.groups[0];
          this.services = json;
          this.currentServices = this.currentServiceList;
          this.service = this.currentServices[0];
        })
        .then(() => {
          this.renderTopo();
        });
    }

    private handleChange(i: { key: string; label: string; group: string }) {
      this.service = i;
      this.UNSELECT_GROUP();
      this.GET_TOPO({
        serviceId: this.service.key,
        duration: this.durationTime,
      });
    }

    private changeGroup(i: { key: string; label: string }) {
      this.group = i;
      this.currentServices = this.currentServiceList;
      this.service = this.currentServices[0];
      this.GET_TOPO({
        serviceId: this.service.key,
        duration: this.durationTime,
      });
    }

    private renderTopo() {
      const groups = localStorage.getItem('topology-groups');
      if (groups) {
        const jsonGroup = JSON.parse(groups);
        if (!jsonGroup.length) {
          this.GET_TOPO({
            serviceId: this.service.key,
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

    @Watch('durationTime')
    private watchDurationTime(newValue: DurationTime, oldValue: DurationTime) {
      // Avoid repeating fetchData() after enter the component for the first time.
      if (compareObj(newValue, oldValue)) {
        this.fetchData();
      }
    }
  }
</script>
<style lang="scss">
  .topo-server.dao-select .dao-select-main .dao-select-switch {
    border: 0;
  }
  .selector-topo-aside-box {
    > div {
      background-color: #2b3037;
      color: #ddd;
    }
    > div:last-child {
      margin-top: 250px;
    }
  }
</style>
