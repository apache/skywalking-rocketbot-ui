<template>
  <div class="time-charts">
    <div class="container">
      <span class="time-charts-item mb10 mr10" v-for="(i,index) in list" :key="i" :style="`border-color:${computedScale(index)}`">{{i}}</span>
    </div>
    <div id="svg"></div>
  </div>
</template>
<script lang="js">
import * as d3 from 'd3';
import trace from './d3-trace';
/* eslint-disable */
/* tslint:disable */
export default {
  props: ['data', 'traceId'],
  data(){
    return {
      segmentId:[],
    };
  },
  watch: {
    data() {
      this.changeTree();
    }
  },
  mounted() {
    this.changeTree();
    // this.computedScale();
  },
  computed: {
    list() {
      if (this.data.length === 0) return [];
      const a = this.data.map(i => i.applicationCode);
      return Array.from(new Set(a));
    },
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
      .domain([0, this.list.length])
      .interpolator(d3.interpolateWarm);
      return sequentialScale(i);
    },
    changeTree(){
      this.segmentId = [];
      const segmentGroup = {}
      const segmentIdGroup = []
      this.data.forEach(i => {
        i.label=i.operationName || 'no operation name';
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
        if(segmentGroup[id].refs.length !==0 ) delete segmentGroup[id];
      })
      for (let i in segmentGroup) {
        this.segmentId.push(segmentGroup[i])
      }
      trace({label:`TraceID: ${this.traceId}`, children: this.segmentId},this.$el.offsetWidth, this.data,this);
    },
  }
};
</script>
<style lang="scss">
.trace-node .group {
  cursor: pointer;
  fill-opacity: 0;
}
.trace-node-container{
  fill: rgba(0, 0, 0, 0);
  cursor: pointer;
  &:hover{
    fill: rgba(226, 230, 246, .5)
  }
}
.trace-node text {
  font: 12.5px sans-serif;
  pointer-events: none;
}
.domain{display: none;}
.trace-link {
  fill: none;
  stroke: #d3d3d6;
  stroke-width: 1px;
}
.time-charts-item{
  display: inline-block;
  padding: 2px 10px;
  border-left: 5px solid;
  font-size: 11px;
  border-radius: 3px;
  background-color: #e8e8e8;
}
</style>
