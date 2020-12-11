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
  <div>
    <div v-if="create">
      <input class="group-create-input mr-5" placeholder="Add local view" v-model="name" />
      <RkButton class="mr-5" @click="handleCreateGroup">Confirm</RkButton>
      <RkButton @click="create = false">Cancel</RkButton>
    </div>
    <RkButton v-else icon="add" @click="create = true">Create group</RkButton>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Mutation } from 'vuex-class';

  @Component({
    components: {},
  })
  export default class TopoGroupCreate extends Vue {
    @Mutation('rocketTopoGroup/CREATE_GROUP') private CREATE_GROUP: any;
    private name: string = '';
    private create: boolean = false;

    private handleCreateGroup() {
      this.CREATE_GROUP(this.name);
      this.create = false;
      this.name = '';
    }
  }
</script>
<style lang="scss">
  .group-create-input {
    border: none;
    outline: none;
    line-height: 26px;
    padding: 0px 8px;
    color: #ddd;
    background-color: #2b3037;
    border-radius: 4px;
  }
</style>
