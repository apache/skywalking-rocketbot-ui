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
  <div style="height: 100%">
    <div class="rk-dashboard-bar flex-h">
      <span class="flex-h">
        <div class="rk-dashboard-bar-btn">
          <span v-tooltip:bottom="{ content: rocketGlobal.edit ? 'view' : 'edit' }">
            <svg
              class="icon lg vm cp rk-btn ghost"
              :style="`color:${!rocketGlobal.edit ? '' : '#ffc107'}`"
              @click="() => SET_EDIT(!rocketGlobal.edit)"
            >
              <use :xlink:href="!rocketGlobal.edit ? '#lock' : '#lock-open'"></use>
            </svg>
          </span>
        </div>
        <div class="rk-dashboard-bar-btn">
          <span v-tooltip:bottom="{ content: 'import' }">
            <input id="instance-file" type="file" name="file" title="" accept=".json" @change="importData" />
            <label class="rk-btn ghost input-label" for="instance-file">
              <svg class="icon lg vm cp " :style="`marginTop: 0px`">
                <use :xlink:href="'#folder_open'"></use>
              </svg>
            </label>
          </span>
        </div>
        <div class="rk-dashboard-bar-btn">
          <span v-tooltip:bottom="{ content: 'export' }">
            <svg class="icon lg vm cp rk-btn ghost" @click="exportData">
              <use :xlink:href="'#save_alt'"></use>
            </svg>
          </span>
        </div>
      </span>
      <ToolBarSelect :selectable="false" :title="this.$t('currentService')" :current="current" icon="package" />
      <ToolBarSelect
        @onChoose="selectInstance"
        :title="$t('currentInstance')"
        :current="stateDashboardOption.currentInstance"
        :data="stateDashboardOption.instances"
        icon="disk"
      />
    </div>
    <instances-survey :instanceComps="instanceComps" :updateObjects="updateObjects" />
  </div>
</template>

<script lang="ts">
  import InstancesSurvey from './instances-survey.vue';
  import ToolBarSelect from '@/views/components/dashboard/tool-bar-select.vue';
  import ToolBarEndpointSelect from '@/views/components/dashboard/tool-bar-endpoint-select.vue';
  import _ from 'lodash';
  import Vue from 'vue';
  import { Component, PropSync, Watch, Prop } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import { ObjectsType } from '../../../../constants/constant';

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
    @State('rocketbot') private rocketGlobal: any;
    @Getter('durationTime') private durationTime: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Action('GET_SERVICE_INSTANCES') private GET_SERVICE_INSTANCES: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT') private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Mutation('SET_EDIT') private SET_EDIT: any;
    @Mutation('SET_CURRENT_SERVICE') private SET_CURRENT_SERVICE: any;
    @Prop() private current!: { key: number | string; label: number | string };
    @Prop() private instanceComps: any;
    @Prop() private updateObjects!: string;

    private selectInstance(i: any) {
      this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
    }

    private beforeMount() {
      this.SET_CURRENT_SERVICE(this.current);
      this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 3 });
      this.GET_SERVICE_INSTANCES({ duration: this.durationTime, serviceId: this.current.key }).then(() => {
        this.selectInstance(this.stateDashboardOption.instances[0]);
      });
    }

    private async importData(event: any) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        this.$emit('changeInstanceComps', { json: data, type: ObjectsType.UPDATE_ENDPOINTS });
        const el: any = document.getElementById('instance-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportData() {
      const data = this.instanceComps;
      const name = 'instanceComps.json';
      saveFile(data, name);
    }

    private beforeDestroy() {
      this.$emit('changeInstanceComps', { type: '' });
      this.SET_EDIT(false);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-bar-btn {
    padding: 0 5px;
    border-right: 2px solid #252a2f;
    height: 19px;
  }
  #instance-file {
    display: none;
  }
  .input-label {
    display: inline;
    line-height: inherit;
  }
</style>
