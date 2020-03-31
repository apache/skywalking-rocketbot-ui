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
  <div class="profile">
    <div class="profile-header">
      <div class="thread">
        Thread Stack
      </div>
      <div class="self">
        Duration (ms)
      </div>
      <div class="exec-ms">
        Self Duration (ms)
        <a
          class="profile-set-btn"
          @click="updateHighlightTop()"
          v-tooltip:bottom="{ content: 'Highlight top 10 slow methods', popperCls: ['trace-table-tooltip'] }"
          :style="{ color: highlightTop ? '#448dfe' : '#484b55' }"
        >
          top slow
        </a>
      </div>
      <div class="dump-count">
        Dump Count
      </div>
    </div>
    <slot> </slot>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Mutation } from 'vuex-class';

  @Component
  export default class ProfileContainer extends Vue {
    @Mutation('profileStore/SET_HIGHLIGHT_TOP') private SET_HIGHLIGHT_TOP: any;
    @Prop() private highlightTop!: boolean;

    private updateHighlightTop() {
      this.SET_HIGHLIGHT_TOP();
    }
  }
</script>
<style lang="scss" scoped>
  @import './profile.scss';
  .profile {
    font-size: 12px;
    height: 100%;
    min-width: 1200px;
    .profile-set-btn {
      font-size: 12px;
      border: 1px solid #ccc;
      border-radius: 3px;
      text-align: center;
      width: 57px;
      overflow: hidden;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      position: absolute;
      top: 4px;
      right: 3px;
      padding: 0 3px;
    }
  }
  .profile-header {
    display: flex;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .profile-header div {
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    line-height: 30px;
    background-color: #f3f4f9;
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
