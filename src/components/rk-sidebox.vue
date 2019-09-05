/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div>
    <div class="rk-sidebox-backdrop" v-show="show" @click="handleHide"></div>
    <aside class="rk-sidebox" :style="show?`width:${width};left:0`:`width:${width};left:-${width}`">
      <h3 class="rk-sidebox-title">{{this.title}}
        <div class="r rk-sidebox-close" @click="handleHide">
          <svg class="icon">
            <use xlink:href="#close"></use>
          </svg>
        </div>
      </h3>
      <div class="rk-sidebox-inner">
        <slot/>
      </div>
    </aside>
  </div>
</template>
<script lang="js">      // tslint:disable
export default {
  name: 'RkSidebox',
  props: {
    show: {},
    title: {
      default: '',
    },
    width: {
      default: '550px',
    },
  },
  methods: {
    handleHide() {
      this.$emit('update:show', false);
    },
  },
};
</script>

<style lang="scss">
.rk-sidebox-backdrop{
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(31, 33, 38, 0.2);
  z-index: 199;
}
.rk-sidebox{
  overflow-y: auto;
  will-change: left;
  transition:left .3s;
  position: fixed;
  right: 0;
  top: 50px;
  bottom: 0;
  z-index: 200;
  background-color: #fff;
}
.rk-sidebox-inner{
  padding: 35px 20px 20px;
}
.rk-sidebox-title {
  font-size: 16px;
  position: absolute;
  width: 100%;
  padding: 0 20px;
  line-height: 20px;
}
.rk-sidebox-close{
  cursor: pointer;
  color: #D8D8D8;
  transition: color .3s;
  .icon{
    width: 18px;
    height: 20px;
  }
  &:hover{
    color: #3D92FF;
  }
}
.rk-sidebox-magnify{
  cursor: pointer;
  color: #D8D8D8;
  transition: color .3s;
  .icon{
    width: 18px;
    height: 20px;
  }
  &:hover{
    color: #3D92FF;
  }
}
</style>
