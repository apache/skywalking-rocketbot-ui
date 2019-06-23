<template>
  <div class="dashboard-item" :class="`g-sm-${i.w}`" :style="`height:${i.h}px;`"
    draggable="true" @dragstart="dragstart" @dragover="$event.preventDefault();" @drop="drop">
    <div class="dashboard-item-title">
      <div>
        <svg class="icon cp red r" v-if="rocketGlobal.edit" @click="DELETE_COMP(index)">
          <use xlink:href="#file-deletion"></use>
        </svg>
        <span>{{i.t}}</span>
      </div>
    </div>
    <div class="dashboard-item-body">
      <div style="height:100%;">
        <component :is="rocketGlobal.edit ? 'ChartEdit' : i.c" ref="chart" :i="i" :index="index" :intervalTime="intervalTime" :data="rocketDashboard[i.d]"></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import charts from './charts';

import { Mutation, Action, State, Getter } from 'vuex-class';

@Component({
  components: { ...charts },
})
export default class DashboardItem extends Vue {
  @Mutation('DELETE_COMP') private DELETE_COMP: any;
  @Mutation('SWICH_COMP') private SWICH_COMP: any;
  @State('rocketDashboard') private rocketDashboard: any;
  @Getter('intervalTime') private intervalTime: any;
  @Prop() private rocketGlobal!: any;
  @Prop() private i!: any;
  @Prop() private index!: number;
  private dragIndex: number = NaN;
  private dragstart() {
    this.dragIndex = this.index;
  }
  private drop() {
    this.SWICH_COMP({start: this.dragIndex, end: this.index});
  }
}

</script>
<style lang="scss">
.dashboard-item{
  display: flex;
  height: 100%;
  flex-direction: column;
  padding-left: 5px;
  padding-right: 5px;
}
.dashboard-item-shadow{
  background-color:#448dfe15;
  position:absolute;
  border: 1px solid #448dfec0;
  border-radius: 4px;
}
.dashboard-item-title{
  flex-shrink: 0;
  user-select: none;
  line-height: 16px;
  border-radius: 2px;
  background-color: rgba(196,200,225,.2);
  color: #9da5b2;
  padding: 6px 10px ;
}
.dashboard-item-title-input{
  border-style: unset;
  background-color: #ffffffcc;
  outline: 0;
  border-radius: 3px;
  padding: 5px;
  height: 16px;
  margin-left: -5px;
}
.dashboard-item-resize{
  position: absolute;
  fill: #9da5b2;
  z-index: 1;
  width: 8px;
  height: 8px;
  padding: 3px;
  right: -4px;
  bottom: 0;
  cursor: se-resize;
}
.dashboard-item-body{
  padding: 7px 10px;
  flex-grow:1;
  // height:100%;
  height: calc(100% - 28px);
}
</style>
