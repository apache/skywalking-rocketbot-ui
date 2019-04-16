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

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';
import charts from './charts';

@Component({
  components: {
    ...charts,
  },
})
export default class DashboardService extends Vue {
  @Prop() private rocketGlobal: any;
  @Prop() private rocketComps: any;
  @Prop() private stateDashboard: any;
  @Getter('intervalTime') private intervalTime: any;
  @Mutation('SWICH_COMP') private SWICH_COMP: any;

  private dragIndex: number = NaN;
  private dragstart(index: number) {
    this.dragIndex = index;
  }
  private drop(index: number) {
    this.SWICH_COMP({start: this.dragIndex, end: index});
  }
  private render(h: any) {
    const comps: any = [];
    if (!this.rocketComps.tree[this.rocketComps.group].children.length) { return; }
    this.rocketComps.tree[this.rocketComps.group]
    .children[this.rocketComps.current].children.forEach((i: any, index: number) => {
      const rowComp = h(this.rocketGlobal.edit ? 'ChartEdit' : i.comp, {
        props: {
          ...i,
          title: i.t,
          index,
          intervalTime: this.intervalTime,
          stateDashboard: this.stateDashboard,
        },
        key: index,
        class: `g-sm-${i.w}`,
        on: {
          dragstart: this.dragstart,
          drop: this.drop,
        },
      });
      comps.push(rowComp);
    });
    return h('div', {
      class: 'dashboard-container clear',
      // props: {
      //   name: this.rocketGlobal.edit ? 'list-complete' : '',
      //   tag: 'div',
      // },
    }, comps);
  }
}
</script>
<style lang="scss">
.list-complete-item {
  transition: all .4s;
}
.list-complete-enter, .list-complete-leave-to{
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>

