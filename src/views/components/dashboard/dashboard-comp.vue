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
  <div class="rk-dashboard-comp">
    <nav class="rk-dashboard-comp-nav mb-15">
      <a
        class="rk-dashboard-comp-nav-i b mr-20"
        v-show="value.length"
        @click="
          current = key;
          configMode = false;
        "
        :class="{ active: key === current }"
        v-for="(value, key) in tree"
        :key="key"
      >
        {{ $t(key.toLowerCase()) }}
      </a>
      <div class="pt-10 r">
        <a class="rk-btn ghost sm" @click="configMode = !configMode">{{ $t('templateConfig') }}</a>
      </div>
    </nav>
    <div class="rk-dashboard-comp-wrapper">
      <div v-if="configMode" class="mb-15">
        <textarea class="long mb-5 sm rk-dashboard-textarea" rows="3" v-model="config"></textarea>
        <a class="rk-btn ghost sm mr-10" @click="handleCopy(config)">{{ $t('copy') }}</a>
        <a class="rk-btn ghost sm mr-10" @click="handleReset">{{ $t('reset') }}</a>
        <a class="rk-btn ghost sm" @click="handleApply">{{ $t('apply') }}</a>
      </div>
      <div v-else class="rk-dashboard-comp-i mr-10 mb-10" v-for="(i, index) in tree[current]" :key="index">
        <span class="b mr-5 sm">{{ $t(i.o.toLowerCase()) }}</span>
        <svg class="icon blue cp lg r" @click="ADD_COMP(i)">
          <use xlink:href="#file-addition"></use>
        </svg>
        <div class="mr-5">{{ i.t }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Mutation } from 'vuex-class';
  import copy from '@/utils/copy';

  @Component
  export default class DashboardComp extends Vue {
    @Prop() private rocketComps: any;
    @Prop() private compType: any;
    @Mutation('ADD_COMP') private ADD_COMP: any;
    private current: string = 'Global';
    private configMode: boolean = false;
    private config: string = '';
    private get tree() {
      const temp: any = {
        Global: [],
        Service: [],
        ServiceEndpoint: [],
        ServiceInstance: [],
        Proxy: [],
        ProxyEndpoint: [],
        ProxyInstance: [],
        Database: [],
      };
      this.rocketComps.data[this.compType].forEach((i: any) => {
        if (temp[i.o]) {
          temp[i.o].push(i);
        }
      });
      return temp;
    }
    private created() {
      this.config = JSON.stringify(this.rocketComps.tree);
    }
    private handleCopy(i: any) {
      copy(i);
    }
    private handleApply() {
      const r = confirm('');
      if (r === true) {
        window.localStorage.setItem('dashboard', this.config);
        this.configMode = false;
        location.reload();
      }
    }
    private handleReset() {
      const r = confirm('');
      if (r === true) {
        window.localStorage.removeItem('dashboard');
        this.configMode = false;
        location.reload();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-comp-nav {
    padding: 0 15px;
  }
  .rk-dashboard-textarea {
    resize: none;
    border: 1px solid #c1c5ca41;
    outline: none;
    padding: 0 8px;
    border-radius: 4px;
  }
  .rk-dashboard-comp-nav-i {
    display: inline-block;
    line-height: 30px;
    border-bottom: 2px;
    border-bottom-style: solid;
    color: rgba(61, 68, 79, 0.6);
    border-color: rgba(0, 0, 0, 0);
    will-change: border-color, color;
    transition: border-color 0.3s, color 0.3s;
    &:hover {
      color: #448dfe;
    }
    &.active {
      color: #448dfe;
      border-color: #448dfe;
    }
  }
  .rk-dashboard-comp {
    flex-shrink: 0;
    border-top: 1px solid #c1c5ca41;
    color: #515a6e;
    background-color: rgba(196, 200, 225, 0.2);
    .title {
      padding: 0 15px;
    }
  }
  .rk-dashboard-comp-wrapper {
    padding: 0 15px;
  }
  .rk-dashboard-comp-i {
    padding: 6px 10px;
    min-width: 100px;
    display: inline-block;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  }
</style>
