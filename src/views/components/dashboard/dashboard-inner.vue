

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
          index,
          intervalTime: this.intervalTime,
          stateDashboard: this.stateDashboard,
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

