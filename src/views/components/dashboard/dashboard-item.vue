<template>
<div>
  <div v-show="isDrag || isMousedown" class="dashboard-item-shadow" :style="`top:${top}px;left:${left}%;height:${height}px;width:${width}%;`"></div>
  <div class="dashboard-item" @mouseup="end" :style="`top:${trueTop}px;left:${trueLeft}%;height:${trueHeight}px;width:${trueWidth}%;`">
    <div class="dashboard-item-title" @mousedown.stop="drageStart">
      <div>
        <svg class="icon cp grey r" v-if="!rocketGlobal.lock" @click="handleSelect">
          <use xlink:href="#settings"></use>
        </svg>
        <span>{{i.t}}</span>
        <!-- <input class="dashboard-item-title-input"  :value="i.t" @change="EDIT_COMP({index,type:'t',value:$event.target.value})"/> -->
      </div>
    </div>
    <div class="dashboard-item-body" style="flex-grow:1;">
      <div style="height:100%;">
        <component :is="i.c" ref="chart"></component>
      </div>
    </div>
    <svg  v-if="!rocketGlobal.lock" @mousedown.stop="start" class="dashboard-item-resize" xmlns="http://www.w3.org/2000/svg" width="6" height="6"><path d="M6 6H0V4.2h4.2V0H6v6z"/></svg>
  </div>
</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import charts from './charts';

import { Mutation, Action } from 'vuex-class';

@Component({
  components: { ...charts },
})
export default class DashboardItem extends Vue {
  @Mutation('EDIT_COMP') private EDIT_COMP: any;
  @Mutation('SET_CURRENT_INDEX') private SET_CURRENT_INDEX: any;
  @Action('SET_EDIT') private SET_EDIT: any;
  @Prop() private rocketGlobal!: any;
  @Prop() private i!: any;
  @Prop() private index!: number;
  private current: string = 'Line';
  private config: boolean = false;
  private width: number = 30;
  private widthCopy: number = 30;
  private trueWidth: number = 30;
  private height: number = 200;
  private heightCopy: number = 200;
  private trueHeight: number = 200;
  private top: number = 0;
  private left: number = 0;
  private trueTop: number = 0;
  private trueLeft: number = 0;
  private topCopy: number = 0;
  private leftCopy: number = 0;
  private isMousedown: boolean = false;
  private isDrag: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  public drageStart(event: any) {
    if (this.rocketGlobal.lock) { return; }
    this.isDrag = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.topCopy = this.top;
    this.leftCopy = this.left;
    document.onmousemove = (e: any) => {
      this.move(e);
    };
  }
  public handleSelect() {
    this.SET_CURRENT_INDEX(this.index);
    this.SET_EDIT(true);
  }
  public start(event: any) {
    if (this.rocketGlobal.lock) { return; }
    this.isMousedown = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.widthCopy = this.width;
    this.heightCopy = this.height;
    document.onmousemove = (e: any) => {
      this.move(e);
    };
  }
  public end() {
    this.trueWidth = this.width;
    this.trueHeight = this.height;
    this.trueTop = this.top;
    this.trueLeft = this.left;
    this.isMousedown = false;
    this.isDrag = false;
    document.onmousemove = null;
  }
  public move(e: any) {
    if (this.isMousedown) {
      const tempX = Math.ceil((e.clientX - this.startX) / 10);
      const tempY = Math.ceil((e.clientY - this.startY) / 10);
      this.trueWidth = this.widthCopy + (e.clientX - this.startX) * 100 / (document.documentElement.offsetWidth - 30);
      this.trueHeight  = this.heightCopy + (e.clientY - this.startY);
      this.width = this.widthCopy + tempX * 10 * 100 / (document.documentElement.offsetWidth - 30);
      this.height = this.heightCopy + tempY * 10;
      const chart: any = this.$refs.chart;
      chart.resize();
    }
    if (this.isDrag) {
      const tempX = Math.ceil((e.clientX - this.startX) / 10);
      const tempY = Math.ceil((e.clientY - this.startY) / 10);
      this.trueLeft = this.leftCopy + (e.clientX - this.startX) * 100 / (document.documentElement.offsetWidth - 30);
      this.trueTop  = this.topCopy + (e.clientY - this.startY);
      this.left = this.leftCopy + tempX * 10 * 100 / (document.documentElement.offsetWidth - 30);
      this.top = this.topCopy + tempY * 10;
    }
  }
}

</script>
<style lang="scss">
.dashboard-item{
  display: flex;
  height: 100%;
  flex-direction: column;
  position:absolute;
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
  z-index: 2;
  width: 8px;
  height: 8px;
  padding: 3px;
  right: -4px;
  bottom: 0;
  cursor: se-resize;
}
.dashboard-item-body{
  padding: 7px 10px;
  z-index: 1;
  color: #f1f3f6;
}
</style>
