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
  <div class="flex-h btn-box">
    <div class="rk-dashboard-bar-btn" @click="handleSetEdit">
      <rk-icon
        class="lg"
        :style="`color:${!rocketGlobal.edit ? '' : '#ffc107'}`"
        :icon="!rocketGlobal.edit ? 'lock' : 'lock-open'"
        v-tooltip:bottom="{ content: rocketGlobal.edit ? 'view' : 'edit' }"
      />
    </div>
    <div class="rk-dashboard-bar-btn" v-tooltip:bottom="{ content: 'import' }">
      <input id="tool-bar-file" type="file" name="file" title="" accept=".json" @change="importData" />
      <label for="tool-bar-file">
        <rk-icon class="lg import" icon="folder_open" />
      </label>
    </div>
    <div class="rk-dashboard-bar-btn" @click="exportData">
      <rk-icon class="lg" icon="save_alt" v-tooltip:bottom="{ content: 'export' }" />
    </div>
    <div class="rk-dashboard-bar-btn" @click="handleOption">
      <rk-icon class="lg" icon="retry" v-tooltip:bottom="{ content: 'auto' }" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Action, Mutation } from 'vuex-class';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  import { DurationTime } from '@/types/global';
  import { State as rocketData } from '@/store/modules/dashboard/dashboard-data';
  import { State as rocketGlobal } from '@/store/modules/global';
  import { PageTypes } from '@/constants/constant';

  @Component
  export default class ToolBarBtns extends Vue {
    @Prop() private compType!: string;
    @Prop() private rocketGlobal!: rocketGlobal;
    @Prop() private rocketComps!: rocketData;
    @Prop() private durationTime!: DurationTime;
    @Mutation('IMPORT_TREE') private IMPORT_TREE: any;
    @Action('SET_EDIT') private SET_EDIT: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;

    private handleOption() {
      return this.MIXHANDLE_GET_OPTION({
        compType: this.compType,
        duration: this.durationTime,
        pageType: PageTypes.DASHBOARD,
        keywordServiceName:
          this.rocketComps.tree[this.rocketComps.group] && this.rocketComps.tree[this.rocketComps.group].serviceGroup,
      });
    }

    private handleSetEdit() {
      this.SET_EDIT(!this.rocketGlobal.edit);
    }

    private async importData(event: any) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        const [{ children, name, type }] = data;
        if (children && name && type) {
          this.IMPORT_TREE(data);
        } else {
          throw new Error('error');
        }
        const el: any = document.getElementById('tool-bar-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportData() {
      const group = this.rocketComps.tree[this.rocketComps.group];
      delete group.query;
      const name = 'dashboard.json';
      saveFile([group], name);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-bar-btn {
    padding: 0 8px;
    border-right: 2px solid #252a2f;
    height: 19px;
    cursor: pointer;
  }
  #tool-bar-file {
    display: none;
  }
  .input-label {
    display: inline;
    line-height: inherit;
    cursor: pointer;
  }
  .btn-box {
    height: 58px;
  }
  .import {
    margin-top: 0;
    cursor: pointer;
  }
</style>
