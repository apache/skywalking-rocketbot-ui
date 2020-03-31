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
  <div class="rk-box" :style="width ? `width: ${width};` : ''">
    <div class="rk-box-title ell">{{ title }}</div>
    <div class="rk-box-container"><slot></slot></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component({})
  export default class RkPanel extends Vue {
    @Prop() private title!: string;
    @Prop({ default: '' }) private width!: string;
  }
</script>
<style lang="scss" scoped>
  .rk-box {
    padding-left: 5px;
    padding-right: 5px;
  }
  .rk-box-title {
    padding: 5px 15px;
    border-radius: 4px;
    background-color: rgba(196, 200, 225, 0.2);
    // color: rgba(61, 68, 79, 0.6);
    color: #9da5b2;
  }
  .rk-box-container {
    padding: 7px 10px;
    // min-height: 220px;
  }
</style>
