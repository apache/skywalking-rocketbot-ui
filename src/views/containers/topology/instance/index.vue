/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div style="height: 100%">
    <div class="rk-dashboard-bar flex-h">
      <ToolBarSelect :selectable="false" :title="this.$t('currentService')" :current="current" icon="package" />
      <ToolBarSelect
        @onChoose="selectInstance"
        :title="$t('currentInstance')"
        :current="stateDashboardOption.currentInstance"
        :data="stateDashboardOption.instances"
        icon="disk"
      />
    </div>
    <instances-survey />
  </div>
</template>

<script lang="ts">
  import InstancesSurvey from './instances-survey.vue';
  import ToolBarSelect from '@/views/components/dashboard/tool-bar-select.vue';
  import ToolBarEndpointSelect from '@/views/components/dashboard/tool-bar-endpoint-select.vue';
  import _ from 'lodash';
  import Vue from 'vue';
  import { Component, PropSync, Watch, Prop } from 'vue-property-decorator';
  import { Action, Getter, State } from 'vuex-class';

  interface Instance {
    label: string;
    key: string;
    name?: string;
  }

  @Component({
    components: {
      InstancesSurvey,
      ToolBarSelect,
      ToolBarEndpointSelect,
    },
  })
  export default class WindowInstance extends Vue {
    @State('rocketOption') private stateDashboardOption!: any;
    @State('rocketData') private rocketComps!: any;
    @Getter('durationTime') private durationTime: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Action('GET_SERVICE_INSTANCES') private GET_SERVICE_INSTANCES: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT') private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Prop() private current!: { key: number | string; label: number | string };

    private selectInstance(i: any) {
      this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
    }

    private beforeMount() {
      this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 3 });
      this.GET_SERVICE_INSTANCES({ duration: this.durationTime, serviceId: this.current.key }).then(() => {
        this.selectInstance(this.stateDashboardOption.instances[0]);
      });
    }
  }
</script>

<style lang="less" scoped></style>
