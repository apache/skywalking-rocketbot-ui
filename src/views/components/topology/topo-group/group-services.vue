/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
  <div class="group-item-services">
    <div class="ell mb-5" v-for="i in services">
      <input type="checkbox" class="mr-5">
      <span>{{i.label}}</span>
    </div>
    <RkButton size="sm" class="mr-5" @click="open = !open">Render</RkButton>
    <RkButton size="sm" class="mr-5"  @click="open = !open">Delete</RkButton>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import Axios, { AxiosResponse } from 'axios';

  @Component
  export default class TopoGroupItem extends Vue {
    @Getter('durationTime') public durationTime: any;
    @Mutation('rocketTopoGroup/ADD_GROUP_SERVICE') private ADD_GROUP_SERVICE: any;
    @Mutation('rocketTopoGroup/DELETE_GROUP_SERVICE') private DELETE_GROUP_SERVICE: any;
    private services = [];
    private fetchData() {
      Axios.post('/graphql', {
        query: `
      query queryServices($duration: Duration!) {
        services: getAllServices(duration: $duration) {
          key: id
          label: name
        }
      }`,
        variables: {
          duration: this.durationTime,
        },
      }).then((res: AxiosResponse) => {
        this.services = res.data.data.services
          ? res.data.data.services
          : [];
      });
    }
    private created() {
      this.fetchData();
    }
  }
</script>
<style lang="scss">
.topo-group .group-item-services{
    background-color: #252a2f;
    padding: 5px;
    border-radius: 4px;
    position: absolute;
    bottom: 0;
    left: 120px;
    width: 150px;
    color: #ccc;
  }
</style>
