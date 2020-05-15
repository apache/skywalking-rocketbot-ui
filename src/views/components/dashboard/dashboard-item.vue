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
  <div
    class="rk-dashboard-item"
    :class="`g-sm-${item.w}`"
    :style="rocketGlobal.edit ? 'height:350px' : `height:${item.h}px;`"
  >
    <div class="rk-dashboard-item-title ell">
      <svg class="icon cp red r" v-if="rocketGlobal.edit" @click="DELETE_COMP(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
      <span>{{ item.t }}</span>
      <span class="hint" v-if="rocketDashboard[item.d].Hint">({{ rocketDashboard[item.d].Hint }})</span>
      <span v-if="status === 'UNKNOWN'" class="item-status">( {{ $t('unknownMetrics') }} )</span>
    </div>
    <div class="rk-dashboard-item-body">
      <div style="height:100%;">
        <component
          :is="rocketGlobal.edit ? 'ChartEdit' : item.c"
          ref="chart"
          :item="item"
          :index="index"
          :intervalTime="intervalTime"
          :data="chartSource"
          @updateStatus="(type) => setStatus(type)"
        ></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import charts from './charts';

  import { Mutation, State, Getter, Action } from 'vuex-class';

  @Component({
    components: { ...charts },
  })
  export default class DashboardItem extends Vue {
    @Mutation('DELETE_COMP') private DELETE_COMP: any;
    @Mutation('SWICH_COMP') private SWICH_COMP: any;
    // @State('rocketDashboard') private rocketDashboard: any;
    @Getter('intervalTime') private intervalTime: any;
    @Action('GET_QUERY') private GET_QUERY: any;
    @Getter('durationTime') private durationTime: any;
    @Prop() private rocketGlobal!: any;
    @Prop() private item!: any;
    @Prop() private index!: number;
    private status = 'UNKNOWN';
    private chartSource = {};

    private beforeMount() {
      this.status = this.item.metricType;
      this.chartRender();
    }

    private chartRender() {
      this.GET_QUERY({
        duration: this.durationTime,
      }).then((params: any) => {
        if (!params) {
          return;
        }

        const { values } = params.values;
        const data = values.map((item: { value: number }) => item.value);

        this.chartSource = { [params.metricName]: data };
      });
    }

    private setStatus(data: string) {
      this.status = data;
    }
  }
</script>
<style lang="scss">
  .rk-dashboard-item {
    display: flex;
    height: 100%;
    flex-direction: column;
    padding-left: 5px;
    padding-right: 5px;
  }
  .dashboard-item-shadow {
    background-color: #448dfe15;
    position: absolute;
    border: 1px solid #448dfec0;
    border-radius: 4px;
  }
  .rk-dashboard-item-title {
    flex-shrink: 0;
    user-select: none;
    line-height: 16px;
    border-radius: 2px;
    background-color: rgba(196, 200, 225, 0.2);
    color: #9da5b2;
    padding: 6px 10px;
  }
  .rk-dashboard-item-title .hint {
    color: #fbb03b;
    padding-left: 10px;
  }
  .dashboard-item-title-input {
    border-style: unset;
    background-color: #ffffffcc;
    outline: 0;
    border-radius: 3px;
    padding: 5px;
    height: 16px;
    margin-left: -5px;
  }
  .dashboard-item-resize {
    position: absolute;
    fill: #9da5b2;
    z-index: 1;
    width: 8px;
    height: 8px;
    padding: 3px;
    right: -4px;
    bottom: 0;
    cursor: se-resize;
  }
  .rk-dashboard-item-body {
    padding: 7px 10px;
    flex-grow: 1;
    // height:100%;
    height: calc(100% - 28px);
  }
  .item-status {
    color: red;
    display: inline-block;
    margin-left: 10px;
  }
</style>
