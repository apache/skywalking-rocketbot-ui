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
  <footer class="rk-footer trans" :class="{ 'rk-footer-dark': $route.path === '/topology' }">
    <div class="rk-footer-inner">
      <div class="flex-h"></div>
      <div class="sm flex-h">
        <RkFooterTime />
        <span class="mr-15 cp" @click="setLang">{{ lang === 'zh' ? '中' : 'En' }}</span>
        <span>{{ $t('serverZone') }} UTC {{ utcHour >= 0 ? '+' : '' }}</span>
        <input v-model="utcHour" min="-12" max="14" class="rk-footer-utc" type="number" />
        <span>:&nbsp;</span>
        <span class="utc-min">{{ utcMin > 9 ? null : 0 }}</span>
        <input v-model="utcMin" min="0" max="59" class="rk-footer-utc" type="number" />
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator';
  import { State, Action } from 'vuex-class';

  @Component
  export default class Footerssd extends Vue {
    @State('rocketbot') private rocketbotGlobal: any;
    @Action('SET_DURATION') private SET_DURATION: any;
    @Action('SET_UTC') private SET_UTC: any;
    private lang: string | null = '';
    private utcHour: number = 0;
    private utcMin: number = 0;

    private beforeMount() {
      let utc = localStorage.getItem('utc') || '';
      if (!utc.includes(':')) {
        utc = (localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60)) + ':0';
      }
      const utcArr = (utc || '').split(':');
      this.utcHour = Number(utcArr[0]);
      this.utcMin = Number(utcArr[1]);
      this.SET_UTC(`${this.utcHour}:${this.utcMin}`);
      this.lang = window.localStorage.getItem('lang');
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

    @Watch('utcHour')
    private onUtcUpdate() {
      if (this.utcHour < -12) {
        this.utcHour = -12;
      }
      if (this.utcHour > 14) {
        this.utcHour = 14;
      }
      if (!this.utcHour) {
        this.utcHour = 0;
      }
      this.SET_UTC(`${this.utcHour}:${this.utcMin}`);
      localStorage.setItem('utc', `${this.utcHour}:${this.utcMin}`);
    }

    @Watch('utcMin')
    private onUtcMinUpdate() {
      if (!this.utcMin) {
        this.utcMin = 0;
      }
      this.SET_UTC(`${this.utcHour}:${this.utcMin}`);
      localStorage.setItem('utc', `${this.utcHour}:${this.utcMin}`);
    }
  }
</script>

<style scoped>
  .rk-footer {
    color: #515a6e;
    flex-shrink: 0;
    padding-right: 15px;
    padding-left: 15px;
    padding-bottom: 1px;
    box-shadow: 0 -1px 0px rgba(0, 0, 0, 0.08);
    z-index: 2;
  }
  .rk-footer-dark {
    color: #ddd;
    background: #252a2f;
    border-top: 1px solid #252a2f;
  }
  .rk-footer-edit {
    color: #eee;
    background: #448dfe;
    border-top: 1px solid #448dfe;
  }
  .rk-footer-utc {
    color: inherit;
    background: 0;
    border: 0;
    outline: none;
    width: 40px;
    padding-bottom: 0;
  }
  .rk-footer-inner {
    justify-content: space-between;
    display: flex;
  }
  .utc-min {
    display: inline-block;
    padding-top: 2px;
  }
</style>
