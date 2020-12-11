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
  <div class="group-wrapper">
    <div class="group-item ell" :class="{ active: active }" @click="$emit('select', data.id)">
      <RkButton icon="close" size="sm" class="mr-5" :ghost="true" @click="$emit('delete')" />
      <span class="mr-5">{{ data.name }}</span>
    </div>
    <div class="group-services">
      <div class="group-services-wrapper">
        <div class="ell mb-10" v-for="i in servicesMap" :key="i.key">
          <input
            type="checkbox"
            @click="
              (e) => {
                !e.target.checked
                  ? DELETE_GROUP_SERVICE({ id: data.id, service: i })
                  : ADD_GROUP_SERVICE({ id: data.id, service: i });
              }
            "
            :checked="data.services.some((service) => service.label === i.label)"
          />
          <span>{{ i.label }}</span>
        </div>
      </div>

      <RkButton size="sm" class="mr-5" @click="$emit('select', data.id)">Render</RkButton>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { State as TopoGroupState } from '@/store/modules/topology/group';
  @Component
  export default class TopoGroupItem extends Vue {
    @Prop() private active!: boolean;
    @Prop() private data!: any;
    @Prop() private servicesMap!: any;
    @Mutation('rocketTopoGroup/ADD_GROUP_SERVICE') private ADD_GROUP_SERVICE: any;
    @Mutation('rocketTopoGroup/DELETE_GROUP_SERVICE') private DELETE_GROUP_SERVICE: any;
  }
</script>
<style lang="scss">
  .topo-group {
    z-index: 101;
    .group-wrapper {
      position: relative;
      margin-bottom: 5px;
      &:hover {
        .group-services {
          display: block;
        }
      }
    }
    .group-services-wrapper {
      max-height: 250px;
      overflow: auto;
      padding-right: 15px;
    }
    .group-services {
      display: none;
      position: absolute;
      background-color: #252a2f;
      padding: 10px;
      left: 110px;
      bottom: 0;
      color: #ccc;
      border-radius: 4px;
    }
    .group-item {
      position: relative;
      user-select: none;
      cursor: pointer;
      background: #252a2f66;
      color: #ccc;
      height: 26px;
      width: 110px;
      line-height: 26px;
      padding-right: 10px;
      border-radius: 4px;
      &:hover,
      &.active {
        color: #fff;
        background-color: #252a2f;
      }
      &.default {
        padding-left: 10px;
      }
    }
  }
</style>
