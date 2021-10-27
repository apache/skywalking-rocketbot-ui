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
  <header class="rk-header flex-h">
    <div class="flex-h">
      <svg class="svg-logo icon" style="margin-right:35px;margin-top:-5px">
        <use xlink:href="#logo-sw"></use>
      </svg>
      <span class="grey rocketbot">Rocketbot</span>
      <router-link
        v-for="(menu, index) in menus"
        :key="index"
        :to="menu.path"
        :exact="menu.meta.exact"
        class="nav-link mr-20"
      >
        <rk-icon size="sm" :icon="menu.meta.icon" />
        <span class="vm hide-xs ml-5">{{ $t(menu.meta.title) }}</span>
      </router-link>
    </div>
    <PageToolBar />
  </header>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { routes } from '@/router';
  import PageToolBar from './page-tool-bar.vue';

  @Component({
    components: {
      PageToolBar,
    },
  })
  export default class Header extends Vue {
    private get menus() {
      return routes[0].children;
    }

    private handleSignout() {
      localStorage.removeItem('skywalking-authority');
      this.$router.push('/login');
    }
  }
</script>

<style lang="scss" scoped>
  .rk-header {
    flex-shrink: 0;
    justify-content: space-between;
    height: 48px;
    padding-right: 15px;
    padding-left: 15px;
    font-size: 13px;
    color: #efefef;
    z-index: 9;
    background-color: #252a2f;
    box-shadow: 0 1px 2px 0 rgba(26, 24, 29, 0.24);
    .svg-logo {
      width: 90px;
      height: 22px;
    }
    .rocketbot {
      padding-top: 27px;
      position: absolute;
      font-size: 11px;
    }
    .logo {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      font-size: 18px;
      padding-top: 2px;
      margin-right: 50px;
    }
    .nav-link {
      padding: 5px;
      border-radius: 4px;
      opacity: 0.8;
      color: #efeff1;
      will-change: opacity, background-color;
      transition: opacity 0.3s, background-color 0.3s;
    }
    .nav-link:hover,
    .nav-link.active {
      opacity: 1;
      background-color: #333844;
    }
  }
  .rk-header-user {
    display: none;
    position: relative;
  }
  .rk-header-user-menu {
    position: absolute;
    top: 35px;
    right: 0;
    background-color: #fff;
    overflow: hidden;
    border-radius: 4px;
    padding: 3px 0;
    color: #333844;
    width: 100px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.15);
  }
  .rk-header-user-menu-i {
    padding: 6px 10px;
    will-change: background-color;
    transition: background-color 0.3s;
    &:hover {
      background-color: #dededf;
    }
  }
</style>
