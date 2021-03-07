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
  <div class="rk-dashboard-opt ell" @click="$emit('handleSelect', data)">
    {{ data.label }}
    <svg style="margin-top: 3px;" class="icon sm r" @click.stop="show = !show">
      <use xlink:href="#code"></use>
    </svg>
    <div class="rk-dashboard-opt-tip" v-if="show">{{ data.label }}</div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  @Component
  export default class ToolBarEndpointSelectOpt extends Vue {
    @Prop() public data!: any;
    private show: boolean = false;
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-opt-tip {
    margin-top: 5px;
    word-break: break-all;
    white-space: pre-wrap;
    border-radius: 3px;
    padding: 3px;
    background-color: #f3f4f9;
    color: #334444;
  }
</style>
