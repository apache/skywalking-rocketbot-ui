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
  <rk-popper ref="popper" :trigger="trigger" :forceShow="show">
    <span slot="reference"><slot></slot></span>
    <div class="rk-dropdown" :style="`width:${width}`">
      <input v-model="searchString" type="text" placeholder="搜索..." class="rk-dropdown-search" />
      <RkDropdownItem
        v-for="i in searchResult"
        :key="i.name"
        @click.native="handleClick(i)"
        :detail="true"
        :value="i.name"
      />
    </div>
  </rk-popper>
</template>

<script lang="ts">
  import RkDropdownItem from './rk-dropdown-item.vue';
  import Vue from 'vue';
  import { Component, Prop, PropSync, Ref } from 'vue-property-decorator';

  interface Option {
    value: string | number;
    name: string | number;
  }

  @Component({
    components: { RkDropdownItem },
  })
  export default class RkDropdown extends Vue {
    @Ref('popper') private readonly popper!: any;
    @Prop({ default: 'click' }) private trigger!: string;
    @Prop({ default: '180px' }) private width!: string;
    @Prop({ default: false }) private show!: boolean;
    @Prop({ default: false }) private search!: boolean;
    @Prop({ default: () => [] }) private options!: Option[];
    private searchString: string = '';
    private get searchResult() {
      return this.options.filter((item: Option) => `${item.name}`.indexOf(this.searchString) !== -1);
    }
    private handleClick(i: Option) {
      this.$emit('click', i);
      this.popper.doClose();
    }
  }
</script>

<style lang="scss">
  .rk-dropdown {
    color: #efefef;
    box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
    background-color: #252a2f;
    border-radius: 3px;
    overflow: auto;
    max-height: 200px;
    padding-bottom: 2px;
    &-search {
      width: calc(100% - 4px);
      border: 0;
      background-color: #333840;
      color: #eee;
      outline: 0;
      padding: 5px 25px 5px 10px;
      margin: 2px;
      border-radius: 3px;
    }
  }
</style>
