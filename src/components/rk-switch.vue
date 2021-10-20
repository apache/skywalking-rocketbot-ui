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
  <button type="button" class="rk-switch" :class="checked ? 'switch-checked' : ''" @click="changeStatus">
    <div class="switch-handle"></div>
    <span class="switch-inner"></span>
  </button>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  @Component
  export default class RkSwitch extends Vue {
    @Prop() private checked!: boolean;

    private changeStatus() {
      this.$emit('onChange', !this.checked);
    }
  }
</script>
<style lang="scss" scoped>
  .rk-switch {
    padding: 0;
    color: #000000d9;
    font-size: 14px;
    line-height: 1.5715;
    position: relative;
    display: inline-block;
    min-width: 44px;
    height: 22px;
    line-height: 22px;
    background-color: #00000040;
    border: 0;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .switch-checked {
    background-color: #448dfe;
  }
  .switch-inner {
    margin: 0 25px 0 7px;
    display: block;
    margin: 0 7px 0 25px;
    color: #fff;
    font-size: 12px;
    transition: all 0.2s;
  }
  .switch-handle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    transition: all 0.2s ease-in-out;
    &:before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #fff;
      border-radius: 9px;
      box-shadow: 0 2px 4px #00230b33;
      transition: all 0.2s ease-in-out;
      content: '';
    }
  }
  .switch-checked .switch-handle {
    left: calc(100% - 20px);
    transition: all 0.2s;
  }
</style>
