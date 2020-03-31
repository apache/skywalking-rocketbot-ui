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
  <div class="rk-dropdown-item" :class="{ active: value === active && active }">
    <div class="ell" v-if="!show">
      <svg v-if="detail" class="icon sm r" @click.stop="show = !show">
        <use xlink:href="#code"></use>
      </svg>
      {{ value }}
    </div>
    <div v-else>
      <svg v-if="detail" class="icon sm r" @click.stop="show = !show">
        <use xlink:href="#code"></use>
      </svg>
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component({})
  export default class RkDropdownItem extends Vue {
    @Prop({ default: false }) private detail!: boolean;
    @Prop() private active!: string | number;
    @Prop() private value!: string | number;
    private show: boolean = false;
  }
</script>

<style lang="scss">
  .rk-dropdown-item {
    padding: 7px 15px;
    cursor: pointer;
    user-select: none;
    .icon {
      margin-top: 3px;
    }
    &:hover,
    &.active {
      background-color: #40454e;
    }
  }
</style>
