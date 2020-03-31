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
  <a class="rk-btn" :class="{ size, ghost: ghost }" @click.stop="$emit('click')">
    <svg v-if="icon" class="icon"><use :xlink:href="`#${icon}`"></use></svg>
    <slot />
  </a>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class RkBtn extends Vue {
    @Prop({ default: '' }) private size!: string;
    @Prop({ default: '' }) private icon!: string;
    @Prop({ default: false }) private ghost!: boolean;
  }
</script>
<style lang="scss">
  .rk-btn {
    display: inline-block;
    line-height: 26px;
    padding: 0 7px;
    background-color: #448dfe;
    border-radius: 4px;
    color: #fff;
    transition: background-color 0.3s;
    .icon {
      margin-top: -2px;
    }
    &.sm {
      line-height: 24px;
    }
    &.lg {
      line-height: 30px;
    }
    &.ghost {
      background-color: transparent;
    }
    &:hover {
      background-color: #357de9;
    }
  }
</style>
