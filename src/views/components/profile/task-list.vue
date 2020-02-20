/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div class="profile-task-list flex-v">
    <div class="profile-task-wrapper"></div>
    <div class="profile-trace-wrapper"></div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';

  @Component
  export default class ProfileTaskList extends Vue {
    @Prop() private taskListSource: any;
    @Prop() private traceListSource: any;
  }
</script>

<style lang="scss">
  .profile-task-list {
    padding: 20px;
    width: 30%;
    border-right: 1px solid #ccc;
    min-height: 150px;
    min-width: 350px;
    flex-grow: 1;
    height: 100%;
    overflow: auto;
  }
</style>
