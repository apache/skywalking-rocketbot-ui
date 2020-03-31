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
  <div class="rk-chart-edit">
    <div class="rk-chart-edit-container">
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('title') }}:</div>
        <input
          type="text"
          class="rk-chart-edit-input long"
          :value="i.t"
          @change="EDIT_COMP({ index, type: 't', value: $event.target.value })"
        />
      </div>
      <div class="flex-h mb-5">
        <div class="title grey sm">{{ $t('width') }}:</div>
        <input
          type="number"
          min="1"
          max="12"
          class="rk-chart-edit-input long"
          :value="i.w"
          @change="EDIT_COMP({ index, type: 'w', value: $event.target.value })"
        />
      </div>
      <div class="flex-h">
        <div class="title grey sm">{{ $t('height') }}:</div>
        <input
          type="number"
          min="1"
          class="rk-chart-edit-input long"
          :value="i.h"
          @change="EDIT_COMP({ index, type: 'h', value: $event.target.value })"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { State, Getter, Mutation } from 'vuex-class';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartEdit extends Vue {
    @Mutation('EDIT_COMP') private EDIT_COMP: any;
    @Prop() private i!: any;
    @Prop() private index!: number;
    @Prop() private intervalTime!: any;
  }
</script>
<style lang="scss">
  .rk-chart-edit {
    margin: 0 -10px;
    height: 100%;
    overflow: auto;
  }

  .rk-chart-edit-container {
    padding: 7px 5px;
    border: 1px dashed rgba(196, 200, 225, 0.5);
    border-radius: 4px;
    height: 100%;
    .title {
      width: 45px;
      flex-shrink: 0;
    }
  }
  .rk-chart-edit-input {
    border: 0;
    outline: 0;
    padding: 4px 10px;
    border-radius: 3px;
    // border: 1px solid #c1c5ca41;
    background-color: rgba(196, 200, 225, 0.2);
  }
</style>
