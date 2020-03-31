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
  <a class="rk-back" @click="handleBack">
    <svg class="icon"><use xlink:href="#chevron-left"></use></svg>
  </a>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class RkBack extends Vue {
    @Prop({ default: '' }) private size!: string;
    private handleBack() {
      const query = this.$route.query as any;
      if (query.form) {
        this.$router.push(query.form);
      } else {
        this.$emit('back');
      }
    }
  }
</script>
<style lang="scss">
  .rk-back {
    margin-right: 10px;
    .icon {
      vertical-align: bottom;
      height: 22px;
      width: 22px;
      padding: -1px 3px;
    }
  }
</style>
