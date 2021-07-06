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
  <nav class="rk-event-tool flex-h">
    <div class="flex-h event-select">
      <CommonSelector
        :hasSearch="true"
        :title="$t('service')"
        @input="selectService"
        :value="rocketOption.currentService"
        :data="rocketOption.services"
      />
      <CommonSelector
        :hasSearch="true"
        :title="$t('instance')"
        :value="rocketOption.currentInstance"
        :data="rocketOption.instances"
        @input="selectInstance"
      />
      <CommonSelector
        :hasSearch="true"
        :title="$t('endpoint')"
        @input="selectEndpoint"
        :value="rocketOption.currentEndpoint"
        :data="rocketOption.endpoints"
      />
      <CommonSelector
        :title="$t('eventsType')"
        :value="eventType"
        @input="chooseStatus"
        :data="[
          { label: 'All', key: 'ALL' },
          { label: 'Normal', key: 'Normal' },
          { label: 'Error', key: 'ERROR' },
        ]"
      />
    </div>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Action, Mutation, Getter, State } from 'vuex-class';
  import { Option, DurationTime } from '@/types/global';
  import { CommonSelector } from '../common/index';
  import { State as optionState } from '@/store/modules/global/selectors';
  import { PageTypes } from '@/constants/constant';

  @Component({ components: { CommonSelector } })
  export default class EventSearch extends Vue {
    @Action('SELECT_SERVICE') private SELECT_SERVICE: any;
    @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Getter('durationTime') private durationTime!: DurationTime;
    @State('rocketOption') private rocketOption!: optionState;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;

    private eventType: Option = { key: 'Normal', label: 'Normal' };

    private beforeMount() {
      this.MIXHANDLE_GET_OPTION({
        compType: 'service',
        duration: this.durationTime,
        pageType: PageTypes.EVENT,
      });
    }

    private selectService(i: { key: string; label: string }) {
      this.SELECT_SERVICE({ service: i, duration: this.durationTime });
    }
    private selectEndpoint(i: { key: string; label: string }) {
      this.SELECT_ENDPOINT({ endpoint: i, duration: this.durationTime });
    }

    private selectInstance(i: { key: string; label: string }) {
      this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
    }

    private chooseStatus(i: Option) {
      this.eventType = i;
    }
  }
</script>

<style lang="scss" scoped>
  .rk-event-tool {
    border-bottom: 1px solid #c1c5ca41;
    height: 52px;
    background-color: #333840;
    padding: 0 15px;
    color: #efefef;
    flex-shrink: 0;
    justify-content: space-between;
  }

  .rk-event-tool-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
  }
  .event-conditions {
    height: 100%;
  }
</style>
