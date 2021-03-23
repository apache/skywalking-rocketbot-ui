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
    <div class="flex-h">
      <a
        class="rk-btn mr-5 sm"
        :class="auto ? 'blue' : 'ghost'"
        @click="handleAuto"
        v-tooltip:bottom="{ content: $t('timeReload') }"
      >
        <span class="vm">{{ $t('auto') }}</span>
      </a>
      <div class="auto-time">
        <span class="rk-auto-select">
          <input v-model="autoTime" type="number" @change="changeAutoTime" min="1" />
        </span>
        {{ $t('second') }}
      </div>
      <a class="rk-btn sm ghost" @click="handleReload">
        <rk-icon icon="retry" :loading="auto" />
        <span class="vm">{{ $t('reload') }}</span>
      </a>
    </div>
  </header>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { Action, State, Getter } from 'vuex-class';
  import { routes } from '@/router';
  import timeFormat from '@/utils/timeFormat';

  @Component
  export default class Header extends Vue {
    @Getter('duration') private duration: any;
    @Action('SET_DURATION') private SET_DURATION: any;
    private show: boolean = false;
    private auto: boolean = false;
    private autoTime: number = 6;
    private timer: any = null;

    private get menus() {
      return routes[0].children;
    }

    private handleReload() {
      const gap = this.duration.end.getTime() - this.duration.start.getTime();
      const utcCopy: any = -(new Date().getTimezoneOffset() / 60);
      const time: Date[] = [new Date(new Date().getTime() - gap), new Date()];
      this.SET_DURATION(timeFormat(time));
    }
    private handleAuto() {
      if (this.autoTime < 1) {
        return;
      }
      this.auto = !this.auto;
      if (this.auto) {
        this.handleReload();
        this.timer = setInterval(this.handleReload, this.autoTime * 1000);
      } else {
        clearInterval(this.timer);
      }
    }
    private handleHide() {
      this.show = false;
    }
    private handleShow() {
      this.show = !this.show;
    }
    private handleSignout() {
      localStorage.removeItem('skywalking-authority');
      this.$router.push('/login');
    }
    private changeAutoTime() {
      if (this.autoTime < 1) {
        return;
      }
      clearInterval(this.timer);
      if (this.auto) {
        this.handleReload();
        this.timer = setInterval(this.handleReload, this.autoTime * 1000);
      }
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
      padding: 4px 10px;
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
  .rk-auto-select {
    border-radius: 3px;
    background-color: #fff;
    padding: 1px;
    border-radius: 3px;

    input {
      width: 38px;
      border-style: unset;
      outline: 0;
    }
  }
</style>
