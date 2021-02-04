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
    class="rk-topo-bar-select cp"
    v-clickout="
      () => {
        visible = false;
        search = '';
      }
    "
    :class="{ active: visible }"
  >
    <div class="rk-topo-bar-i flex-h" @click="visible = !visible">
      <div class="mr-15 rk-topo-bar-i-text">
        <div class="sm grey">{{ title }}</div>
        <div class="ell" v-tooltip:right.ellipsis="current.label || ''">
          {{ current.label }}
        </div>
      </div>
      <svg class="icon lg trans" :style="`transform: rotate(${visible ? 180 : 0}deg)`">
        <use xlink:href="#arrow-down"></use>
      </svg>
    </div>
    <div class="rk-topo-sel" v-if="visible">
      <div>
        <input type="text" class="rk-topo-sel-search" v-model="search" />
        <svg class="icon sm close" @click="search = ''" v-if="search">
          <use xlink:href="#clear"></use>
        </svg>
      </div>
      <div class="rk-topo-opt-wrapper scroll_bar_style">
        <div
          class="rk-topo-opt ell"
          @click="handleSelect(i)"
          :class="{ active: i.key === current.key }"
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
  export default class TopoSelect extends Vue {
    @Prop() public data!: any;
    @Prop() public current!: any;
    @Prop() public title!: string;
    @Prop() public icon!: string;
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
  .rk-topo-bar-select {
    position: relative;
    z-index: 1;
    height: 40px;
    justify-content: space-between;
    background-color: #2b3037;
    color: #ddd;
    width: 280px;
    .sm {
      line-height: 12px;
    }
    .icon {
      flex-shrink: 0;
    }
  }
  .rk-topo-bar-i-text {
    width: 100%;
  }
  .rk-topo-bar-i {
    height: 100%;
    width: 100%;
    padding: 5px 15px;
    &.active,
    &:hover {
      background-color: #40454e;
    }
  }
  .rk-topo-sel {
    position: absolute;
    top: 40px;
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
  .rk-topo-opt {
    padding: 7px 15px;
    &.active,
    &:hover {
      background-color: #40454e;
    }
  }
  .rk-topo-sel-search {
    width: calc(100% - 4px);
    border: 0;
    background-color: #333840;
    color: #eee;
    outline: 0;
    padding: 7px 25px 7px 10px;
    margin: 2px;
    border-radius: 3px;
  }
  .rk-topo-opt-wrapper {
    overflow: auto;
    max-height: 200px;
    padding-bottom: 2px;
  }
</style>
