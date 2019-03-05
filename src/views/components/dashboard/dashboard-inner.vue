

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, Getter, State, Mutation } from 'vuex-class';
import ChartEdit from './charts/chart-edit.vue';
import ChartAvgResponse from './charts/chart-avg-response.vue';
import ChartAvgThroughput from './charts/chart-avg-throughput.vue';
import ChartAvgSLA from './charts/chart-avg-sla.vue';
import ChartResponse from './charts/chart-response.vue';
import ChartTrace from './charts/chart-trace.vue';
import ChartSlow from './charts/chart-slow.vue';
import ChartCpu from './charts/chart-cpu.vue';
import ChartGC from './charts/chart-gc.vue';
import ChartHeap from './charts/chart-heap.vue';
import ChartNonHeap from './charts/chart-nonheap.vue';
@Component({
  components: {
    ChartEdit,
    ChartCpu,
    ChartGC,
    ChartHeap,
    ChartNonHeap,
    ChartAvgResponse,
    ChartAvgThroughput,
    ChartAvgSLA,
    ChartResponse,
    ChartTrace,
    ChartSlow,
  },
})
export default class DashboardService extends Vue {
  @State('rocketbot') private rocketGlobal: any;
  @State('rocketComps') private rocketComps: any;
  @Mutation('SWICH_COMP') private SWICH_COMP: any;
  @Mutation('SET_CURRENTCOMP') private SET_CURRENTCOMP: any;

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
          index,
        },
        key: index,
        class: `g-sm-${i.width}`,
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
  // private created() {
  //   this.temp.children.forEach((i: any, index: number) => {
  //     const sym = Symbol();
  //     this.temp.children[index].sym = sym;
  //   });
  // }
}
</script>
<style lang="scss">
.list-complete-item {
  transition: all .4s;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>

