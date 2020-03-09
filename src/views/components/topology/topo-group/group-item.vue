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
  <div class="group-item ell" :class="{'active': active}" @click="$emit('select')">
    <RkButton icon="settings" size="sm" class="mr-5" :ghost="true" @click="open = !open"/>
    <span class="mr-5">{{data.name}}</span>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { State as TopoGroupState } from '@/store/modules/topology/group';
  import GroupServices from './group-services.vue';
  @Component({ components: { GroupServices } })
  export default class TopoGroupItem extends Vue {
    @Prop() private active!: boolean;
    @Prop() private data!: any;
  }
</script>
<style lang="scss">
  .topo-group{
    .group-item{
      display: inline-block;
      position: relative;
      user-select: none;
      cursor: pointer;
      background: #252a2f66;
      color: #ccc;
      height: 26px;
      width: 100px;
      line-height: 26px;
      padding-right: 10px;
      border-radius: 4px;
      margin-bottom: 5px;
      &:hover,&.active{
        color: #fff;
        background-color: #252a2f;
      }
      &.default{
        padding-left: 10px;
      }
    }
  }
</style>
