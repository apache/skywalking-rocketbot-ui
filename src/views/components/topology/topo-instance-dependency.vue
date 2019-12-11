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
  <div class="rk-topo-instance-dependency">
    <Topo :datas="stateTopo.instanceDependency"/>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';

import { State as topoState} from '@/store/modules/topology';
import Topo from './topo.vue';

@Component({
  components: {
    Topo,
  },
})
export default class TopoInstanceDependency extends Vue {
  @Action('rocketTopo/GET_TOPO_INSTANCE_DEPENDENCY') private GET_INSTANCE_DEPENDENCY: any;
  @Getter('durationTime') private durationTime: any;
  @State('rocketTopo') private stateTopo!: topoState;
  @Prop() private selectedCallId: any;

  private created() {
    if (!this.selectedCallId) {
      return;
    }
    const selectedIds = this.selectedCallId.split('_');
    this.GET_INSTANCE_DEPENDENCY({
      serverServiceId: selectedIds[0],
      clientServiceId: selectedIds[1],
      duration: this.durationTime,
    });
  }
}

</script>
<style lang="scss">
  .rk-topo-instance-dependency {
    height: 100%;
  }
</style>
