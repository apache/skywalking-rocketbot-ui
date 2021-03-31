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
    class="rk-bar-select cp flex-h"
    v-clickout="
      () => {
        visible = false;
        search = '';
      }
    "
    :class="{ active: visible }"
  >
    <div class="rk-bar-i flex-h" @click="visible = !visible">
      <div class="mr-15 rk-bar-i-text">
        <div v-if="Array.isArray(current)">
          <span class="selected" v-for="item in current" :key="item.key">
            <span>{{ item.label }}</span>
            <span class="remove-icon" v-if="current.length !== 1" @click="removeSelected(item)">×</span>
          </span>
        </div>
        <div class="ell" v-else v-tooltip:right.ellipsis="current.label || ''">
          {{ current.label }}
        </div>
      </div>
      <svg class="icon lg trans" :style="`transform: rotate(${visible ? 180 : 0}deg)`">
        <use xlink:href="#arrow-down"></use>
      </svg>
    </div>
    <div class="rk-sel" v-show="visible">
      <div>
        <input type="text" class="rk-sel-search" v-model="search" />
        <svg class="icon sm close" @click="search = ''" v-if="search">
          <use xlink:href="#clear"></use>
        </svg>
      </div>
      <div class="rk-opt-wrapper">
        <div
          class="rk-opt ell"
          @click="handleSelect(i)"
          :class="{ 'select-disabled': selectedOpt.includes(i.key) }"
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
  const Multiple = 'multiple';
  @Component
  export default class RkSelect extends Vue {
    @Prop() private mode: any;
    @Prop() private data!: any;
    @Prop() private current!: any;
    private search: string = '';
    private visible: boolean = false;

    get filterData() {
      return this.data.filter((i: any) => i.label.toUpperCase().indexOf(this.search.toUpperCase()) !== -1);
    }

    get selectedOpt() {
      return this.mode === Multiple ? this.current.map((item: any) => item.key) : [this.current.key];
    }

    public handleOpen() {
      this.visible = true;
    }

    public handleSelect(i: any) {
      const selected = this.mode === Multiple ? this.current.map((item: any) => item.key) : [this.current.key];
      if (selected.includes(i.key)) {
        return;
      }
      this.$emit('onChoose', i);
      this.visible = false;
    }

    private removeSelected(item: any) {
      if (this.mode === Multiple) {
        this.$emit('onChoose', item);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rk-bar-select {
    position: relative;
    justify-content: space-between;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 3px;
    color: #000;
    .sm {
      line-height: 12px;
    }
    .icon {
      flex-shrink: 0;
    }
    .selected {
      display: inline-block;
      padding: 5px;
      border-radius: 3px;
      margin: 3px;
      overflow: hidden;
      color: rgba(0, 0, 0, 0.65);
      background-color: #fafafa;
      border: 1px solid #e8e8e8;
    }
    .remove-icon {
      display: inline-block;
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .rk-bar-i-text {
    width: 100%;
  }
  .rk-bar-i {
    height: 100%;
    width: 100%;
    padding: 5px 10px;
    overflow: auto;
  }
  .rk-sel {
    position: absolute;
    top: 100%;
    left: 0;
    background: #fff;
    box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
    border: 1px solid #ddd;
    width: 100%;
    border-radius: 0 0 3px 3px;
    border-right-width: 1px !important;
    z-index: 10;
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
  .rk-opt {
    padding: 7px 15px;
    &.select-disabled {
      color: rgba(0, 0, 0, 0.25);
      cursor: not-allowed;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
  .rk-sel-search {
    width: calc(100% - 4px);
    border: 0;
    border-bottom: 1px solid #ddd;
    outline: 0;
    padding: 7px 25px 7px 10px;
    margin: 2px;
    border-radius: 3px;
  }
  .rk-opt-wrapper {
    overflow: auto;
    max-height: 200px;
    padding-bottom: 2px;
  }
</style>
