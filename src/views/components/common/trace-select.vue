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
    class="rk-trace-sel-wrapper flex-h"
    v-clickout="
      () => {
        visible = false;
        search = '';
      }
    "
    :class="{ cp: !readonly, active: visible }"
  >
    <div class="rk-trace-bar-i flex-h" @click="visible = !visible && !readonly">
      <div class="mr-15 rk-trace-bar-i-text">
        <div class="sm grey">{{ title }}</div>
        <div v-tooltip:right.ellipsis="value.label || ''">
          {{ value.label || '' }}
        </div>
      </div>
      <svg v-if="!readonly" class="icon lg trans" :style="`transform: rotate(${visible ? 180 : 0}deg)`">
        <use xlink:href="#arrow-down"></use>
      </svg>
    </div>
    <div class="rk-trace-sel" v-if="visible">
      <div v-if="hasSearch">
        <input type="text" class="rk-trace-sel-search" v-model="search" :placeholder="`${$t('search')}...`" />
        <svg class="icon sm close" @click="search = ''" v-if="search">
          <use xlink:href="#clear"></use>
        </svg>
      </div>
      <div class="rk-trace-opt-wrapper scroll_bar_style">
        <div
          class="rk-trace-opt ell"
          @click="handleSelect(i)"
          :class="{ active: i.key === value.key }"
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
  export default class TraceSelect extends Vue {
    @Prop() public data!: any;
    @Prop() public value!: any;
    @Prop() public title!: string;
    @Prop({ default: false }) public hasSearch!: boolean;
    @Prop({ default: false })
    public readonly!: boolean;
    public search: string = '';
    public visible: boolean = false;
    get filterData() {
      return this.data.filter((i: any) => i.label.toUpperCase().indexOf(this.search.toUpperCase()) !== -1);
    }
    public handleSelect(i: any) {
      this.$emit('input', i);
      this.visible = false;
    }
  }
</script>

<style lang="scss" scoped>
  .rk-trace-sel-wrapper {
    position: relative;
    z-index: 2;
    height: 100%;
    justify-content: space-between;
    .sm {
      line-height: 13px;
    }
    .icon {
      flex-shrink: 0;
    }
  }
  .rk-trace-bar-i-text {
    max-width: 350px;
    min-width: 100px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .rk-trace-bar-i {
    height: 100%;
    padding: 0 15px;
    border-right: 2px solid #252a2f;
  }
  .rk-trace-sel {
    position: absolute;
    top: 44px;
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
  .rk-trace-opt {
    padding: 7px 15px;
    &.active,
    &:hover {
      background-color: #40454e;
    }
  }
  .rk-trace-sel-search {
    width: calc(100% - 4px);
    border: 0;
    background-color: #333840;
    color: #eee;
    outline: 0;
    padding: 7px 25px 7px 10px;
    margin: 2px;
  }
  .rk-trace-opt-wrapper {
    overflow: auto;
    max-height: 200px;
    padding-bottom: 2px;
  }
</style>
