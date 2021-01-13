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
  <nav class="rk-log-nav">
    <span class="mr-20">Browser</span>
    <span class="mr-20">Service</span>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Model } from 'vue-property-decorator';
  import { State, Mutation, Action } from 'vuex-class';

  @Component
  export default class ToolNav extends Vue {}
</script>

<style lang="scss" scoped>
  .rk-log-nav {
    box-shadow: 0 1px 0px rgba(0, 0, 0, 0.08);
    background-color: rgba(196, 200, 225, 0.2);
    padding: 0 15px;
  }
</style>
