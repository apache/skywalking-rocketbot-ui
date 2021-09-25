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
  <div v-if="show" class="rk-alert flex-h" :class="type">
    <span v-show="closable" @click="closeAlert">
      <rk-icon icon="clearclose" class="close" />
    </span>
    <rk-icon v-show="showIcon" :icon="iconType" class="xll mr-5 tip-icon" />
    <div class="rk-alert-content">
      <div class="rk-alert-message">{{ message }}</div>
      <div class="rk-alert-description">{{ description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  @Component
  export default class RkAlert extends Vue {
    @Prop() private message!: string;
    @Prop({ default: 'error' }) private type!: string;
    @Prop() private description!: string;
    @Prop({ default: true }) private showIcon!: boolean;
    @Prop({ default: true }) private closable!: boolean;
    @Prop() private show!: boolean;

    private iconType: string = 'error';

    private mounted() {
      this.iconType =
        this.type === 'error'
          ? 'highlight_remove'
          : this.type === 'warning'
          ? 'error_outline'
          : this.type === 'info'
          ? 'info_outline'
          : 'sentiment_satisfied_alt';
      setTimeout(() => {
        this.$emit('update:show', false);
      }, 30000);
    }

    private closeAlert() {
      this.$emit('update:show', false);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-alert {
    position: relative;
    display: flex;
    word-wrap: break-word;
    width: 580px;
    z-index: 1000;
    color: #000;
    border-radius: 2px;
    padding: 10px 10px;
    align-items: flex-start;
    transition: all 0.7s;
    margin-bottom: 15px;
    &.error {
      border: 1px solid #ffccc7;
      background-color: #fff2f0;
    }
    &.warning {
      border: 1px solid #ffe58f;
      background-color: #fffbe6;
    }
    &.info {
      border: 1px solid #91d5ff;
      background-color: #e6f7ff;
    }
    &.success {
      border: 1px solid #b7eb8f;
      background-color: #f6ffed;
    }
  }
  .error {
    .tip-icon {
      color: #ff4d4f;
    }
  }
  .warning {
    .tip-icon {
      color: #faad14;
    }
  }
  .info {
    .tip-icon {
      color: #1890ff;
    }
  }
  .success {
    .tip-icon {
      color: #52c41a;
    }
  }
  .close {
    font-size: 20px;
    color: #00000073;
    transition: color 0.3s;
    position: absolute;
    top: 2px;
    right: 0;
    cursor: pointer;
    z-index: 1001;
  }
  .rk-alert-message {
    font-size: 16px;
  }
  .rk-alert-content {
    flex: 1;
    min-width: 0;
  }
  .rk-alert-description {
    line-height: 22px;
  }
</style>
