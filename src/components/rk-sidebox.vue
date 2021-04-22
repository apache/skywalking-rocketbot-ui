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
  <div>
    <div class="rk-sidebox-backdrop" v-show="show" @click="handleHide"></div>
    <aside
      class="rk-sidebox flex-v"
      :style="
        show ? `width:${width};${right ? 'right:0' : 'left:0'}` : `width:${width};${right ? 'right' : 'left'}:-${width}`
      "
    >
      <div class="rk-sidebox-title">
        <span class="title">{{ this.title }}</span>
        <div class="r rk-sidebox-close" @click="handleHide">
          <svg class="icon">
            <use xlink:href="#close"></use>
          </svg>
        </div>
      </div>
      <div class="rk-sidebox-inner" :class="{ 'rk-sidebox-inner-fixed': fixed }">
        <slot />
      </div>
    </aside>
  </div>
</template>
<script lang="js">
        // tslint:disable
  export default {
    name: 'RkSidebox',
    props: {
      show: {},
      title: {
        default: '',
      },
      right: {
        default: false,
      },
      fixed: {
        default: false,
      },
      width: {
        default: '550px',
      },
    },
    methods: {
      handleHide() {
        this.$emit('update:show', false);
        this.$emit('closeSideboxCallback');
      },
    },
  };
</script>

<style lang="scss">
  .rk-sidebox-backdrop {
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(31, 33, 38, 0.2);
    z-index: 199;
  }
  .rk-sidebox {
    overflow-y: auto;
    transition: all 0.3s;
    position: fixed;
    right: 0;
    top: 50px;
    bottom: 30px;
    z-index: 200;
    background-color: #fff;
  }
  .rk-sidebox-inner {
    padding: 20px;
  }
  .rk-sidebox-inner-fixed {
    height: 100%;
    padding: 0;
    overflow: auto;
  }
  .rk-sidebox-title {
    font-size: 16px;
    width: 100%;
    padding-left: 20px;
    line-height: 35px;
  }
  .rk-sidebox-close {
    position: absolute;
    right: 10px;
    top: 0;
    cursor: pointer;
    color: #d8d8d8;
    transition: color 0.3s;
    .icon {
      width: 18px;
      height: 20px;
    }
    &:hover {
      color: #3d92ff;
    }
  }
  .rk-sidebox-magnify {
    cursor: pointer;
    color: #d8d8d8;
    transition: color 0.3s;
    .icon {
      width: 18px;
      height: 20px;
    }
    &:hover {
      color: #3d92ff;
    }
  }
</style>
