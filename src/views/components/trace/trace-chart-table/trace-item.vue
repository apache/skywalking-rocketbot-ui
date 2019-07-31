<template>
  <div>
    <!-- <div> -->
  
      <!-- {{data.name}} -->
      <!--todo 显示指标 -->

      <div :class="['trace-item', 'level'+( data.level - 1)]">
        <div :class="['method', 'level'+( data.level - 1)]">
          <span 
              v-if="data.children && data.children.length > 0" 
              @click="toggle" 
              :class="['trace-table-toggle', displayChildren? 'collapse': 'expand']">

          </span>
          <span v-tooltip:bottom.inTraceTable="data.endpointName">
            {{data.endpointName}}
          </span>
          <!-- <span ref="endpoint">
            {{data.endpointName}}
          </span>           -->
        </div>
        <div class="start-time">
          {{formatTime(data.startTime)}}
        </div>
        <div class="gap">
          0
        </div>
        <div class="exec-ms">
         {{(data.endTime - data.startTime)?(data.endTime - data.startTime) : '0'}} 
         <!-- {{( (data.endTime - data.startTime) && data.children && data.children.length > 0 ) || (data.level == 1) ?(data.endTime - data.startTime) + '' : '0'}}  -->

        </div>
        <div class="exec-percent">

          <div class="outer-progress_bar" :style="{width: outterPercent}">
              <div class="inner-progress_bar" :style="{width: innerPercent}"></div>
          </div>
        </div>
        <div class="self">
          {{data.dur ? data.dur + '' : '0'}}
        </div>
        <!-- <div class="class">
          Abstract
        </div> -->
        <div class="api">
          <span v-tooltip:bottom="data.component||'-'">{{data.component || '-'}}</span>
        </div>
        <!-- <div class="agent">
          audit-center-tomcat
        </div> -->
        <div class="application">
          <span v-tooltip:bottom="data.serviceCode||'-'">{{data.serviceCode}}</span>
          

        </div>
      </div>      
    <!-- </div> -->
    <div v-show="data.children && data.children.length > 0 && displayChildren" class="children-trace">
        <item v-for="(item, index) in data.children" :key="index" :data="item"> </item>
    </div>
  </div>

</template>
<style lang="scss" scoped>
  @for $i from 0 through 20 {
    .method.level#{$i} {
      text-indent: #{$i * 10}px;
    }
  }

  .trace-item.level0{
      background: #DFF0D8;
      color: #1469EB;
      &:hover {
        background: #DFF0D8;
        color: #1469EB;
      }
  }

  .trace-table-toggle {
    cursor: pointer;
    height: 12px;
    width: 12px;
    display: inline-block;
    &.collapse {
      background: url('./collapse.gif') no-repeat;
      background-size: 12px 12px;
    }

    &.expand {
      background: url('./expand.gif') no-repeat;
      background-size: 12px 12px;
    }
  }  

  .trace-item {
    display: flex;
    /* justify-content: space-between; */
    position: relative;
    &::before{
      position: absolute;
      content: '';
      width: 5px;
      height: 100%;
      background: #cb7686;
      left: 0;
    }
  }
  .trace-item.selected {
    background: beige;
  }

  .trace-item:not(.level0):hover {
    background: beige;
    border-top: 1px solid white;
  }

  // .trace-item div.method {
  //   // border-left:  5px solid #cb7686;

  // }

  .trace-item>div {
    padding: 0 4px;
    padding-left: 10px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    /* float:left; */
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap
  }
  .method {
    /* border-right: 1px dashed black; */
    width: 45%;
  }
  .argument {
    /* border-right: 1px dashed black; */
    width: 15%;
  }
  .start-time {
    /* border-right: 1px dashed black; */
    width: 5%;
    min-width: 100px;
  }
  .gap {
    /* border-right: 1px dashed black; */
    width: 5%;
  }
  .exec-ms {
    /* border-right: 1px dashed black; */
    width: 6%;
  }
  .trace-item div.exec-percent {
    width: 10%;
    padding-left: 8px;
    padding-right: 8px;
    .outer-progress_bar {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #5bc0de;
      position: relative;
      margin-top: 11px;
      border: none;
    }
    .inner-progress_bar {
      position: absolute;
      background: #4343C8;
      height: 4px;
      border-radius: 2px;
      left: 0;
      border:none;
      top: 1px;
    }
  }
  .self {
    /* border-right: 1px dashed black; */
    width: 5%;
  }
  // .class {
  //   /* border-right: 1px dashed black; */
  //   width: 10%;
  // }
  .api {
    /* border-right: 1px dashed black; */
    width: 10%;
  }
  .agent {
    /* border-right: 1px dashed black; */
    width: 15%;
  }
  .application {
    /* border-right: 1px dashed black; */
    width: 15%;
  }

</style>
<script type="text/javascript">
import moment from 'dayjs'
import Popper from 'popper.js';

export default {
  name: 'item',
  props: ['data'],
  data() {
    return {
      displayChildren: true
    }
  },
  computed: {
    selfTime() {
      const {data} = this
      return  data.dur ? data.dur : 0
    },
    execTime() {
      const {data} = this
      return  (data.endTime - data.startTime)?(data.endTime - data.startTime) : 0
    },
    outterPercent() {
      if (this.data.level == 1) {
        return '100%'
      } else {
        let data = this.data
        // let exec = ((data.endTime - data.startTime) && data.children && data.children.length > 0 ) ? (data.endTime - data.startTime) : 0
        let exec = (data.endTime - data.startTime) ? (data.endTime - data.startTime) : 0
        console.log(exec, data.totalExec, 'aaaaa')
        const result = (exec/data.totalExec * 100).toFixed(4) + '%'
        return result == '0.0000%' ? '0.9%' : result
      }
    },
    innerPercent() {
      const result = (this.selfTime/this.execTime) * 100 .toFixed(4) + '%'
      return result == '0.0000%' ? '0.9%' : result
    }
  },
  methods: {
    toggle() {
      this.displayChildren = ! this.displayChildren
    },
    formatTime(timestamp) {
      return moment(timestamp).format('HH:mm:ss SSS')
    }
  },
  mounted() {
    this.$nextTick(()=>{       
    })
  }
}
</script>
