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
  <div class="rk-progress">
    <div class="rk-progress-inner" :style="`width:${precent}%;background-color: ${color};`"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component({})
  export default class RkProgress extends Vue {
    @Prop({
      default: 0,
    })
    public precent!: number;
    @Prop({
      default: '#3fb1e3',
    })
    public color!: string;
  }
</script>
<style lang="scss" scoped>
  .rk-progress {
    height: 4px;
    border-radius: 2px;
    background-color: rgba(196, 200, 225, 0.3);
  }
  .rk-progress-inner {
    height: 100%;
    border-radius: 2px;
  }
</style>
