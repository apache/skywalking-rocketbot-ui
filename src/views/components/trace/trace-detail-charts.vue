<template>
  <div class="time-charts scroll_content">
    <transition-group name="fade" tag="div" class="mb-5">
      <span class="time-charts-item mr-10" v-for="(i,index) in list" :key="i" :style="`color:${computedScale(index)}`">
         <svg class="icon vm mr-5 sm">
            <use xlink:href="#issue-open-m"></use>
          </svg> 
        <span>{{i}}</span>
      </span>
    </transition-group>
    <div class="trace-tree">
      <div ref="traceTree"></div>
    </div>
  </div>
</template>
<script lang="js">
import * as d3 from 'd3';
import Trace from './d3-trace';
/* eslint-disable */
/* tslint:disable */
export default {
  props: ['data', 'traceId'],
  data(){
    return {
      segmentId:[],
      list: [],
    };
  },
  watch: {
    data() {
      if(!this.data.length) {return;}
      this.changeTree();
      this.tree.init({label:`TRACE_ROOT`, children: this.segmentId}, this.data);
      this.tree.draw()
    }
  },
  mounted() {
    this.changeTree();
    this.tree = new Trace(this.$refs.traceTree, this)
    this.tree.init({label:`TRACE_ROOT`, children: this.segmentId}, this.data);
    this.tree.draw()
    // this.computedScale();
  },
  methods: {
     traverseTree(node, spanId, segmentId, data){
      if (!node) return;
      if(node.spanId == spanId && node.segmentId == segmentId) {node.children.push(data);return;}
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            this.traverseTree(node.children[i],spanId,segmentId,data);
        }
      }
    },
    computedScale(i) {
       // 彩虹图
      const sequentialScale = d3.scaleSequential()
      .domain([0, this.list.length + 1])
      .interpolator(d3.interpolateCool);
      return sequentialScale(i);
    },
    changeTree(){
      if (this.data.length === 0) return [];
      this.list = Array.from(new Set(this.data.map(i => i.serviceCode)));
      this.segmentId = [];
      const segmentGroup = {}
      const segmentIdGroup = []
      this.data.forEach(i => {
        i.label=i.endpointName || 'no operation name';
        i.children = [];
        if(segmentGroup[i.segmentId] === undefined){
          segmentIdGroup.push(i.segmentId);
          segmentGroup[i.segmentId] = [];
          segmentGroup[i.segmentId].push(i);
        }else{
          segmentGroup[i.segmentId].push(i);
        }
      });
      segmentIdGroup.forEach(id => {
        let currentSegment = segmentGroup[id].sort((a,b) => b.parentSpanId-a.parentSpanId);
        currentSegment.forEach(s =>{
          let index = currentSegment.findIndex(i => i.spanId === s.parentSpanId);
          if(index !== -1){
            currentSegment[index].children.push(s);
            currentSegment[index].children.sort((a, b) => a.spanId - b.spanId );
          }
        })
        segmentGroup[id] = currentSegment[currentSegment.length-1]
      })
      segmentIdGroup.forEach(id => {
        segmentGroup[id].refs.forEach(ref => {
          if(ref.traceId === this.traceId) {
            this.traverseTree(segmentGroup[ref.parentSegmentId],ref.parentSpanId,ref.parentSegmentId,segmentGroup[id])
          };
        })
        // if(segmentGroup[id].refs.length !==0 ) delete segmentGroup[id];
      })
      for (let i in segmentGroup) {
        if(segmentGroup[i].refs.length ===0 )
        this.segmentId.push(segmentGroup[i]);
      }
      this.segmentId.forEach((_, i) => {
        this.collapse(this.segmentId[i]);
      })
    },
    collapse(d) {
      if(d.children){
        let dur = d.endTime - d.startTime;
        d.children.forEach(i => {
          dur -= (i.endTime - i.startTime);
        })
        d.dur = dur < 0 ? 0 : dur;
        d.children.forEach((i) => this.collapse(i));
      }
    }
  }
};
</script>
<style lang="scss">
.time-charts{
  overflow: auto;
  padding: 15px 30px;
}
.trace-node .group {
  cursor: pointer;
  fill-opacity: 0;
}
.trace-node-container{
  fill: rgba(0, 0, 0, 0);
  stroke-width: 5px;
  cursor: pointer;
  // stroke: rgba(0,0,0,0);
  &:hover{
    fill: rgba(0,0,0,0.05)
  }
}
.trace-node  .node-text {
  font: 12.5px sans-serif;
  pointer-events: none;
}
.domain{display: none;}
.trace-link {
  fill: none;
  stroke: rgba(0,0,0,0.1);
  stroke-width: 2px;
}
.time-charts-item{
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid;
  font-size: 11px;
  border-radius: 4px;
  // background-color: rgba(0, 0, 0, 0.04);
}

 .trace-tree{
   fill: rgba(0,0,0,0)
 }
 .trace-tree .trace-node rect{
   &:hover{
     fill: rgba(0,0,0,0.05)
   }
 }
.d3-tip {
      line-height: 1;
      padding: 8px;
      background: #252a2f;
      color: #eee;
      border-radius: 4px;
      font-size: 12px;
    }
 
    /* Creates a small triangle extender for the tooltip */
    .d3-tip:after {
      box-sizing: border-box;
      display: block;
      font-size: 10px;
      width: 100%;
      line-height: 0.8;
      color: #252a2f;
      content: "\25BC";
      position: absolute;
      text-align: center;
    }
 
    /* Style northward tooltips specifically */
    .d3-tip.n:after {
      margin: -2px 0 0 0;
      top: 100%;
      left: 0;
    }

</style>
