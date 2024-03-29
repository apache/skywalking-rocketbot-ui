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
  <div class="sm flex-h page-tools">
    <RkFooterTime />
    <span class="mr-10 cp" id="utcVal"> UTC{{ utcHour >= 0 ? '+' : '' }}{{ `${this.utcHour}:${this.utcMin}` }} </span>
    <span class="ghost mr-5 cp" @click="handleReload" title="refresh">
      <rk-icon icon="retry" :loading="auto" class="lg" />
    </span>
    <span class="ghost cp">
      <rk-icon icon="keyboard_arrow_down" class="xll" id="settings" />
    </span>
    <div class="tool-bar-setting " v-show="showSetting" @click="markSettings">
      <div class="flex-h item">
        <span class="label">{{ $t('version') }}</span>
        <span>{{ rocketbotGlobal.version }}</span>
      </div>
      <div class="flex-h item">
        <span class="label">{{ $t('language') }}</span>
        <span>Zh</span>
        <rk-switch class="mr-5 ml-5" :checked="lang === 'en'" @onChange="setLang" />
        <span>En</span>
      </div>
      <div class="flex-h item">
        <span class="label">{{ $t('serverZone') }}</span>
        <div>
          <span>UTC{{ utcHour >= 0 ? '+' : '' }}</span>
          <input v-model="utcHour" min="-12" max="14" class="rk-utc" type="number" />
          <span>:</span>
          <span class="utc-min">{{ utcMin > 9 || utcMin === 0 ? null : 0 }}</span>
          <input v-model="utcMin" min="0" max="59" class="rk-utc" type="number" />
        </div>
      </div>
      <div class="flex-h item">
        <span class="label">{{ $t('auto') }}</span>
        <rk-switch class="mr-10" :checked="auto" @onChange="handleAuto" />
        <div class="auto-time">
          <span class="rk-auto-select">
            <input v-model="autoTime" type="number" @change="changeAutoTime" min="1" />
          </span>
          {{ $t('second') }}
          <i class="ml-10">{{ $t('timeReload') }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';
  import timeFormat from '@/utils/timeFormat';

  @Component
  export default class PageToolBar extends Vue {
    @Getter('duration') private duration: any;
    @State('rocketbot') private rocketbotGlobal: any;
    @Action('SET_DURATION') private SET_DURATION: any;
    @Action('SET_UTC') private SET_UTC: any;
    @Action('FETCH_VERSION') private FETCH_VERSION: any;
    private lang: string | null = '';
    private utcHour: number = 0;
    private utcMin: number = 0;
    private auto: boolean = false;
    private autoTime: number = 6;
    private timer: any = null;
    private showSetting: boolean = false;
    private settingOpened: boolean = false;

    private beforeMount() {
      let utc = localStorage.getItem('utc') || '';
      if (!utc.includes(':')) {
        utc = (localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60)) + ':0';
      }
      const utcArr = (utc || '').split(':');
      this.utcHour = isNaN(Number(utcArr[0])) ? 0 : Number(utcArr[0]);
      this.utcMin = isNaN(Number(utcArr[1])) ? 0 : Number(utcArr[1]);
      this.SET_UTC(`${this.utcHour}:${this.utcMin}`);
      this.lang = window.localStorage.getItem('lang');
      this.FETCH_VERSION();
    }

    private mounted() {
      document.addEventListener('click', this.closeSettings, false);
    }

    private setLang() {
      if (this.lang === 'zh') {
        this.$i18n.locale = 'en';
        window.localStorage.setItem('lang', 'en');
        this.lang = 'en';
      } else {
        this.$i18n.locale = 'zh';
        window.localStorage.setItem('lang', 'zh');
        this.lang = 'zh';
      }
    }

    private handleReload() {
      const gap = this.duration.end.getTime() - this.duration.start.getTime();
      const time: Date[] = [new Date(new Date().getTime() - gap), new Date()];
      this.SET_DURATION(timeFormat(time));
    }
    private handleAuto(status: boolean) {
      if (this.autoTime < 1) {
        return;
      }
      this.auto = status;
      if (this.auto) {
        this.handleReload();
        this.timer = setInterval(this.handleReload, this.autoTime * 1000);
      } else {
        clearInterval(this.timer);
      }
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

    private closeSettings(e: any) {
      if (this.settingOpened) {
        this.settingOpened = false;
        return;
      }
      if (e.target.id === 'utcVal' || e.target.id === 'settings' || e.target.parentElement.id === 'settings') {
        this.showSetting = true;
      } else {
        this.showSetting = false;
      }
    }

    private markSettings() {
      this.settingOpened = true;
    }

    private beforeDestroy() {
      document.removeEventListener('click', this.closeSettings, false);
    }

    @Watch('utcHour')
    private onUtcUpdate() {
      if (this.utcHour < -12) {
        this.utcHour = -12;
      }
      if (this.utcHour > 14) {
        this.utcHour = 14;
      }
      if (isNaN(this.utcHour)) {
        this.utcHour = 0;
      }
      this.SET_UTC(`${this.utcHour}:${this.utcMin}`);
      localStorage.setItem('utc', `${this.utcHour}:${this.utcMin}`);
    }

    @Watch('utcMin')
    private onUtcMinUpdate() {
      if (this.utcMin < 0) {
        this.utcMin = 0;
      }
      if (this.utcMin > 59) {
        this.utcMin = 59;
      }
      if (isNaN(this.utcMin)) {
        this.utcMin = 0;
      }
      this.SET_UTC(`${this.utcHour}:${this.utcMin}`);
      localStorage.setItem('utc', `${this.utcHour}:${this.utcMin}`);
    }
  }
</script>

<style lang="scss" scoped>
  .page-tools {
    position: relative;
  }
  .rk-utc {
    color: inherit;
    background: 0;
    border: 0;
    outline: none;
    width: 40px;
    padding-bottom: 0;
  }
  .utc-min {
    display: inline-block;
    padding-top: 2px;
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
  .tool-bar-setting {
    position: absolute;
    top: 30px;
    right: -5px;
    color: #666;
    font-family: inherit;
    font-size: 12px;
    background: #fff;
    z-index: 10000;
    padding: 20px;
    border-radius: 3px;
    box-shadow: 0 2px 4px #00230b33;
    width: 550px;
    &:after {
      bottom: 100%;
      right: 8px;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(0, 0, 0, 0);
      border-bottom-color: #fff;
      border-width: 8px;
      margin-right: 0px;
    }
    .item {
      margin-top: 10px;
    }
    input {
      outline: 0;
      width: 40px;
      border-radius: 3px;
      border: 1px solid #ccc;
      text-align: center;
      height: 22px;
    }
    .label {
      width: 100px;
      display: inline-block;
    }
  }
</style>
