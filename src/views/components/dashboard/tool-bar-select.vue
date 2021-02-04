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
    class="rk-dashboard-bar-select flex-h"
    v-clickout="
      () => {
        visible = false;
        search = '';
      }
    "
    :class="{ active: visible, cp: selectable, cd: !selectable }"
  >
    <div class="rk-dashboard-bar-i flex-h" @click="selectable && (visible = !visible)">
      <svg class="icon lg mr-15">
        <use :xlink:href="`#${icon}`"></use>
      </svg>
      <div class="mr-15 rk-dashboard-bar-i-text">
        <div class="sm grey">{{ title }}</div>
        <div class="selector-ell" v-tooltip:right.ellipsis="current.label || ''">
          {{ current.label }}
        </div>
      </div>
      <svg v-if="selectable" class="icon lg trans" :style="`transform: rotate(${visible ? 180 : 0}deg)`">
        <use xlink:href="#arrow-down"></use>
      </svg>
    </div>
    <div class="rk-dashboard-sel" v-if="visible && selectable">
      <div>
        <input type="text" class="rk-dashboard-sel-search" v-model="search" />
        <svg class="icon sm close" @click="search = ''" v-if="search">
          <use xlink:href="#clear"></use>
        </svg>
      </div>
      <div class="rk-dashboard-opt-wrapper scroll_bar_style">
        <div
          class="rk-dashboard-opt ell"
          @click="i.disabled ? () => {} : handleSelect(i)"
          :class="{ active: i.key === current.key, disabled: i.disabled }"
          v-for="i in filterData"
          :key="i.key"
        >
          {{ i.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  @Component
  export default class ToolBarSelect extends Vue {
    @Prop() public data!: any;
    @Prop() public current!: any;
    @Prop() public title!: string;
    @Prop() public icon!: string;
    @Prop({ type: Boolean, default: true }) public selectable!: boolean;
    public search: string = '';
    public visible: boolean = false;
    get filterData() {
      return this.data.filter((i: any) => i.label.toUpperCase().indexOf(this.search.toUpperCase()) !== -1);
    }
    public handleOpen() {
      this.visible = true;
    }
    public handleSelect(i: any) {
      this.$emit('onChoose', i);
      this.visible = false;
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-bar-select {
    position: relative;
    z-index: 1;
    height: 52px;
    justify-content: space-between;
    .sm {
      line-height: 12px;
    }
    .icon {
      flex-shrink: 0;
    }
  }
  .rk-dashboard-bar-i-text {
    max-width: 350px;
    .selector-ell {
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  .rk-dashboard-bar-i {
    height: 100%;
    padding: 0 15px;
    border-right: 2px solid #252a2f;
    &.active,
    &:hover {
      background-color: #40454e;
    }
  }
  .rk-dashboard-sel {
    position: absolute;
    top: 50px;
    left: -1px;
    box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
    background-color: #252a2f;
    width: 100%;
    border-radius: 0 0 3px 3px;
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
  .rk-dashboard-opt {
    padding: 7px 15px;
    &.active,
    &:hover {
      background-color: #40454e;
    }
    &.disabled {
      cursor: not-allowed;
    }
  }
  .rk-dashboard-sel-search {
    width: calc(100% - 4px);
    border: 0;
    background-color: #333840;
    color: #eee;
    outline: 0;
    padding: 7px 25px 7px 10px;
    margin: 2px;
    border-radius: 3px;
  }
  .rk-dashboard-opt-wrapper {
    overflow: auto;
    max-height: 200px;
    padding-bottom: 2px;
  }
</style>
