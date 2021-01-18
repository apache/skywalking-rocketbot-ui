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
  <div class="rk-log-condition">
    <label>{{ this.$t('metricName') }}</label>
    <input type="text" class="rk-log-input" @change="changeConditions($event, updateLogOpt.metricName)" />
    <label>{{ this.$t('endpointName') }}</label>
    <input type="text" class="rk-log-input" @change="changeConditions($event, updateLogOpt.EndpointName)" />
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';

  @Component({
    components: {},
  })
  export default class LogConditions extends Vue {
    private updateLogOpt = {};
    private changeConditions(item: any, type: string) {
      console.log(item);
    }
  }
</script>

<style scoped lang="scss">
  label {
    display: inline-block;
    margin: 10px 0;
    font-size: 12px;
  }
  .rk-log-input {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    height: 30px;
    line-height: 40px;
    display: block;
    width: 100%;
  }
</style>
