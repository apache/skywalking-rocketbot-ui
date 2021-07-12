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
  <div
    class="rk-common-select cp flex-h"
    v-clickout="
      () => {
        visible = false;
        search = '';
      }
    "
    :class="{ active: visible }"
  >
    <div class="rk-common-bar-i flex-h" @click="visible = !visible">
      <rk-icon :icon="`${icon}`" class="icon lg mr-15" />
      <div class="mr-15 rk-common-bar-i-text">
        <div class="sm grey">{{ title }}</div>
        <div class="ell" v-tooltip:right.ellipsis="value.label || ''">
          {{ value.label || '' }}
        </div>
      </div>
      <svg class="icon lg trans" :style="`transform: rotate(${visible ? 180 : 0}deg)`">
        <use xlink:href="#arrow-down"></use>
      </svg>
    </div>
    <div class="rk-common-sel" v-if="visible">
      <div v-if="hasSearch">
        <input type="text" class="rk-common-sel-search" v-model="search" placeholder="Search..." />
        <svg class="icon sm close" @click="search = ''" v-if="search">
          <use xlink:href="#clear"></use>
        </svg>
      </div>
      <div class="rk-common-opt-wrapper scroll_bar_style">
        <div
          class="rk-common-opt ell"
          @click="handleSelect(i)"
          :class="{ active: i.key === value.key }"
          v-for="i in filterData"
          :key="i.key"
        >
          {{ i.label || '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  @Component
  export default class CommonSelector extends Vue {
    @Prop() private icon!: string;
    @Prop() private data!: any;
    @Prop() private value!: any;
    @Prop() private title!: string;
    @Prop({ default: false }) private hasSearch!: boolean;

    private search: string = '';
    private visible: boolean = false;

    get filterData() {
      return this.data.filter((i: any) => i.label.toUpperCase().indexOf(this.search.toUpperCase()) !== -1);
    }
    public handleOpen() {
      this.visible = true;
    }
    public handleSelect(i: any) {
      this.$emit('input', i);
      this.visible = false;
    }
  }
</script>

<style lang="scss" scoped>
  .rk-common-select {
    position: relative;
    z-index: 1;
    height: 100%;
    justify-content: space-between;
    .sm {
      line-height: 12px;
    }
    .icon {
      flex-shrink: 0;
    }
  }
  .rk-common-bar-i-text {
    max-width: 150px;
    min-width: 80px;
  }
  .rk-common-bar-i {
    height: 100%;
    padding: 0 15px;
    border-right: 2px solid #252a2f;
  }
  .rk-common-sel {
    position: absolute;
    top: 50px;
    box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
    background-color: #252a2f;
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
    .close {
      position: absolute;
      right: 10px;
      top: 12px;
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
    }
  }
  .rk-common-opt {
    padding: 7px 15px;
    &.active,
    &:hover {
      background-color: #40454e;
    }
  }
  .rk-common-sel-search {
    width: calc(100% - 4px);
    border: 0;
    background-color: #333840;
    color: #eee;
    outline: 0;
    padding: 7px 25px 7px 10px;
    margin: 2px;
  }
  .rk-common-opt-wrapper {
    overflow: auto;
    max-height: 200px;
    padding-bottom: 2px;
  }
</style>
