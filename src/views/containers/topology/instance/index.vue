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
      <div class="flex-h">
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
      </div>
      <div class="rk-dashboard-bar-tool flex-h">
        <div class="flex-h">
          <ToolBarSelect :selectable="false" :title="$t('currentService')" :current="current" icon="package" />
          <ToolBarSelect
            @onChoose="selectInstance"
            :title="$t('currentInstance')"
            :current="stateDashboardOption.currentInstance"
            :data="stateDashboardOption.instances"
            icon="disk"
          />
          <div class="pl-10 pb-5 flex-h">
            <div class="type grey">{{ $t('templateType') }}</div>
            <RkSelect
              class="content grey"
              :mode="'multiple'"
              :current="currentType"
              :data="templateTypesList"
              :theme="'dark'"
              @onChoose="(item) => changeTemplatesType(item)"
            />
          </div>
        </div>
        <DashboardEvent
          :rocketComps="rocketComps"
          :stateDashboard="stateDashboardOption"
          :durationTime="durationTime"
          :type="pageEventsType"
        />
      </div>
    </div>
    <instances-survey :currentType="currentType" ref="survey" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Action, Getter, State, Mutation } from 'vuex-class';
  import InstancesSurvey from './instances-survey.vue';
  import ToolBarSelect from '@/views/components/dashboard/tool-bar/tool-bar-select.vue';
  import ToolBarEndpointSelect from '@/views/components/dashboard/tool-bar/tool-bar-endpoint-select.vue';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import { EntityType } from '@/views/components/dashboard/charts/constant';
  import { DurationTime, Option } from '@/types/global';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { State as rocketbotGlobal } from '@/store/modules/global';
  import DashboardEvent from '@/views/components/dashboard/tool-bar/dashboard-events.vue';
  import { PageEventsType, DEFAULT, TopologyType } from '@/constants/constant';
  import { State as topoState } from '@/store/modules/topology';

  @Component({
    components: {
      InstancesSurvey,
      ToolBarSelect,
      ToolBarEndpointSelect,
      DashboardEvent,
    },
  })
  export default class WindowInstance extends Vue {
    @Prop() private current!: { key: number | string; label: number | string };
    @State('rocketOption') private stateDashboardOption!: optionState;
    @State('rocketData') private rocketComps!: rocketData;
    @State('rocketbot') private rocketGlobal!: rocketbotGlobal;
    @State('rocketTopo') private stateTopo!: topoState;
    @Getter('durationTime') private durationTime!: DurationTime;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Action('GET_SERVICE_INSTANCES') private GET_SERVICE_INSTANCES: any;
    @Action('MIXHANDLE_CHANGE_GROUP_WITH_CURRENT') private MIXHANDLE_CHANGE_GROUP_WITH_CURRENT: any;
    @Action('GET_EVENT') private GET_EVENT: any;
    @Mutation('SET_EDIT') private SET_EDIT: any;
    @Mutation('SET_CURRENT_SERVICE') private SET_CURRENT_SERVICE: any;
    @Mutation('rocketTopo/UPDATE_TOPO_TEMPLATE_TYPES') private UPDATE_TOPO_TEMPLATE_TYPES: any;
    @Mutation('rocketTopo/SET_TOPO_INSTANCE') private SET_TOPO_INSTANCE: any;

    private pageEventsType = PageEventsType.TOPO_INSTANCE_EVENTS;
    private currentType: Option[] = [{ key: '', label: '' }];
    private templateTypesList: Option[] = [{ key: '', label: '' }];

    private beforeMount() {
      this.SET_CURRENT_SERVICE(this.current);
      this.MIXHANDLE_CHANGE_GROUP_WITH_CURRENT({ index: 0, current: 3 });
      this.GET_SERVICE_INSTANCES({ duration: this.durationTime, serviceId: this.current.key }).then(() => {
        this.selectInstance(this.stateDashboardOption.instances[0]);
      });
      this.templateTypesList = Object.keys(this.stateTopo.topoInstances).map((item: string) => {
        return { label: item, key: item };
      });
      const topoTemplatesType: any = this.stateTopo.topoTemplatesType;
      const nodeType = this.stateTopo.currentNode.type || DEFAULT;

      if (topoTemplatesType[TopologyType.TOPOLOGY_INSTANCE]) {
        this.currentType = topoTemplatesType[TopologyType.TOPOLOGY_INSTANCE][nodeType] || [
          { label: DEFAULT, key: DEFAULT },
        ];
      } else {
        this.currentType = [{ label: DEFAULT, key: DEFAULT }];
      }
    }

    private changeTemplatesType(item: Option) {
      let topoTemplateTypes;
      const types = this.stateTopo.topoTemplatesType;

      if (this.currentType.find((d) => d.key === item.key)) {
        this.deleteTemplateTypes(item);
        return;
      }
      this.currentType.push(item);
      const nodeType = this.stateTopo.currentNode.type || DEFAULT;

      topoTemplateTypes = {
        ...types,
        [TopologyType.TOPOLOGY_INSTANCE]: { [nodeType]: this.currentType },
      };
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
    }

    private deleteTemplateTypes(item: Option) {
      let topoTemplateTypes;
      const types = this.stateTopo.topoTemplatesType;
      const index = this.currentType.findIndex((d) => item.key === d.key);

      this.currentType.splice(index, 1);
      const nodeType = this.stateTopo.currentNode.type || DEFAULT;

      topoTemplateTypes = {
        ...types,
        [TopologyType.TOPOLOGY_INSTANCE]: { [nodeType]: this.currentType },
      };
      this.UPDATE_TOPO_TEMPLATE_TYPES(topoTemplateTypes);
    }

    private selectInstance(i: Option) {
      if (!this.rocketComps.enableEvents) {
        this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
        return;
      }
      this.GET_EVENT({
        condition: {
          time: this.durationTime,
          paging: {
            pageNum: 1,
            pageSize: 20,
            needTotal: true,
          },
          source: {
            service: this.stateDashboardOption.currentService.label,
            serviceInstance: i.label,
          },
        },
        type: EntityType[3].key,
      }).then(() => {
        this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
      });
    }

    private async importData(event: any) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        this.SET_TOPO_INSTANCE(data);
        const survey: any = this.$refs.survey;
        survey.setTemplates();
        const el: any = document.getElementById('instance-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportData() {
      let topoInstances = {};
      const name = 'instanceComps.json';

      for (const type of Object.keys(this.stateTopo.topoInstances)) {
        const metricsTemp = this.stateTopo.topoInstances[type].map((item: any) => {
          delete item.uuid;
          return item;
        });
        topoInstances = {
          ...topoInstances,
          [type]: metricsTemp,
        };
      }
      saveFile(topoInstances, name);
    }

    private beforeDestroy() {
      this.$emit('changeInstanceComps', { type: false });
      this.SET_EDIT(false);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-bar-tool {
    width: calc(100% - 160px);
    justify-content: space-between;
  }
  .rk-dashboard-bar {
    flex-shrink: 0;
    color: #efefef;
    background-color: #333840;
  }
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
  .type {
    display: inline-block;
    width: 100px;
  }

  .content {
    vertical-align: top;
    display: inline-block;
    width: 300px;
  }
</style>
