/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div class="rk-profile-task">
    <label>{{ this.$t('service') }}</label>
    <RkSelect
      class="mb-5"
      :current="newTaskFields.service"
      :data="taskFieldSource.serviceSource"
      @onChoose="(item) => changOption(item)"
    />
    <label>{{ this.$t('endpoint') }}</label>
    <input type="text" v-model="endpointName" class="rk-profile-input" />
    <label>{{ this.$t('monitorTime') }}</label>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';

  @Component
  export default class ProfileTask extends Vue {
    private endpointName: string = localStorage.getItem('endpointName') || '';
    private serviceOpt: any;
    @Prop() private newTaskFields: any;
    @Prop() private taskFieldSource: any;

    private changOption(item: any) {
      this.serviceOpt = item;
    }
  }
</script>

<style lang="scss">
  .rk-profile-task {
    margin: 20px;
  }
  label {
    display: inline-block;
    margin: 10px 0;
    font-weight: bold;
    font-size: 14px;
  }
  .rk-profile-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
    display: block;
    width: 100%;
  }
</style>
