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
  <svg
    class="icon"
    :class="{
      sm: size === 'sm',
      lg: size === 'lg',
      offset: offset,
      loading: loading,
    }"
  >
    <use :xlink:href="`#${icon}`"></use>
  </svg>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import '../assets/icons/index';

  @Component
  export default class RkIcon extends Vue {
    @Prop({ default: '' }) private icon!: string;
    @Prop({ default: '' }) private size!: string;
    @Prop({ default: false }) private loading!: boolean;
    @Prop({ default: false }) private offset!: boolean;
  }
</script>

<style lang="scss">
  .icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    fill: currentColor;
    &.sm {
      width: 13px;
      height: 13px;
    }
    &.lg {
      width: 18px;
      height: 18px;
    }
    &.offset {
      margin-top: -2px;
    }
    &.loading {
      animation: loading 1.5s linear infinite;
    }
  }
</style>
