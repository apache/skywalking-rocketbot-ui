<template>

  <div class="trace-detail-chart-table">
    <TraceContainer>
      <Item v-for="(item, index) in tableData"  :data="item"  :key="'key'+ index" /> 
    </TraceContainer>
  </div>
</template>
<script>
import Item from './trace-chart-table/trace-item'
import TraceContainer from './trace-chart-table/trace-container'

export default {
  components: {
    Item,
    TraceContainer
  },
  props: ['data'],
  watch: {
    'data'(val) {
      // console.log(val, 'data------>>>>')
      // console.log(JSON.stringify(val))
      this.tableData = this.formatData(this.changeTree())
    }
  },
  data() {
    return {
      tableData: [],
      diaplay: true,
      selected: false,
      fakeData: [
          {
            name: 'a',
            index: 0,
            children: [
              {
                name: 'a-1',
                index: 1,
              },
              {
                name: 'a-2',
                index: 1,
                children: [
                  {
                    name: 'a-2-1',
                    index: 2,
                  },
                  {
                    name: 'a-2-2',
                    index: 2,
                  },
                ]
              }
            ]
          },
          {
            name: 'b',
            index: 0,
          }
      ]
    }
  },
  methods: {
    highlight () {
      this.selected = true;
    },
    // 给增加层级关系
    formatData (arr, level = 1, totalExec = null) {
      for (let item of arr) {
        item.level = level
        totalExec = totalExec || (item.endTime - item.startTime)
        item.totalExec = totalExec
        if (item.children && item.children.length > 0) {
          this.formatData(item.children, level + 1, totalExec)
        }
      }
      return arr
    },
    changeTree(){
      console.log('trace-detail-chart-list')
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
      // console.log(this.segmentId, 'dddd')
      console.log('table页面的数据-------', this.segmentId)
      return this.segmentId
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
    },
    traverseTree(node, spanId, segmentId, data){
      if (!node) return;
      if(node.spanId == spanId && node.segmentId == segmentId) {node.children.push(data);return;}
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            this.traverseTree(node.children[i],spanId,segmentId,data);
        }
      }
    },        
  },
  mounted () {
    this.tableData = this.formatData(this.changeTree())
    // TODO 还需要将层级给定义到对象里面，根据层级赋值样式确定每一行的缩进，indent_1/2/3
    console.log(this.tableData, "格式化之后的数据tableData")
  }
}

</script>
