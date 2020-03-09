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
  <div class="topo-group">
    <div v-for="i in rocketTopoGroup.groups">
      <GroupItem
      :active="rocketTopoGroup.groupId === i.id"
      :key="i.id"
      @delete="handleSelectGroup(i.id)"
      @select="handleSelectGroup(i.id)"
      :data="i"/>
    </div>
    <div>
      <div class="group-item default" @click="handleSelectGroup('all')" :class="{'active': rocketTopoGroup.groupId === 'all'}"><span>Default</span></div>
    </div>
    <CreateGroup/>
    <GroupServices/>
  </div>
</template>
<script lang="ts">
  import topo, { State as topoState } from '@/store/modules/topology';
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import { State as TopoGroupState } from '@/store/modules/topology/group';
  import CreateGroup from './create-group.vue';
  import GroupItem from './group-item.vue';
  import GroupServices from './group-services.vue';
  @Component({
    components: {
      CreateGroup,
      GroupItem,
      GroupServices,
    },
  })
  export default class TopoGroup extends Vue {
    @State('rocketTopo') private stateTopo!: topoState;
    @State('rocketTopoGroup') private rocketTopoGroup!: TopoGroupState;
    @Getter('durationTime') private durationTime: any;
    @Getter('rocketTopoGroup/services') private services: any;
    @Mutation('rocketTopoGroup/INIT_GROUPS') private INIT_GROUPS: any;
    @Mutation('rocketTopoGroup/DELETE_GROUP') private DELETE_GROUP: any;
    @Mutation('rocketTopoGroup/SELECT_GROUP') private SELECT_GROUP: any;
    @Action('rocketTopo/FILTER_TOPO') private FILTER_TOPO: any;

    private handleDeleteGroup(id: string) {
      const r = confirm('Do you want to delete this group!');
      if (r === true) {
         this.DELETE_GROUP(id);
      }
    }
    private handleSelectGroup(id: string) {
      this.SELECT_GROUP(id);
      this.FILTER_TOPO({ services: this.services, group: id });
    }
    private created() {
      this.INIT_GROUPS();
    }
  }
</script>
<style lang="scss">
  .topo-group{
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
</style>
