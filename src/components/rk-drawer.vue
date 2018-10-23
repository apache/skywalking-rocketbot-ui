/** <microPanel :show="true">  show是否显示面板 true:false
  *  <div slot="outer" class="micro-panel-outer">...</div>
  *  <div slot="inner" class="micro-panel-inner">...</div>
  * </microPanel>
**/

<template>
<div class="micro-panel">
  <div class="micro-panel-outer" :style="`height:${100-this.height}%`">
    <slot name="outer"></slot>
  </div>
  <div class="micro-panel-board" :style="`height:${this.height}%`">
    <header class="micro-panel-header">
      <Icon class="icon" type="md-close"  @click="()=>{this.height=0;this.$emit('update:show', false)}"/>
      <Icon class="icon" type="md-expand"  @click="()=>{this.height=100;}"/>
      <Icon class="icon" type="md-contract"  @click="()=>{this.height=38.2;}"/>
    </header>
    <div class="micro-panel-warpper">
      <div class="micro-panel-inner">
        <slot name="inner"></slot>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="js">
export default {
  name: 'MicroPanel',
  props: ['show'],
  data() {
    return {
      height: 38.2,
      y: '',
    };
  },
  watch: {
    show() {
      this.height = this.show ? 38.2 : 0;
    },
  },
  methods: {
    showPanel() {
      this.height = 38.2;
    },
    hidePanel() {
      this.height = 0;
    },
  },
  created() {
    this.height = this.show ? 38.2 : 0;
  },
};
</script>
<style lang="scss">
.micro-panel {
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
}
.micro-panel-outer {
  overflow-y: auto;
  will-change: height;
  transition: height 0.4s;
  -o-transition: height 0.4s;
  -moz-transition: height 0.4s;
  -webkit-transition: height 0.4s;
}
.micro-panel-board {
  position: relative;
  border: 1px solid #dce1e9;
  border-bottom: 0;
  transition: height 0.4s;
  -o-transition: height 0.4s;
  -moz-transition: height 0.4s;
  -webkit-transition: height 0.4s;
}
.micro-panel-warpper {
  padding-top: 25px;
  background-color: #fff;
  box-sizing: border-box;
  height: 100%;
}
.micro-panel-inner {
  overflow: auto;
  height: 100%;
}
.micro-panel-header {
  width: 100%;
  position: absolute;
  background-color: #ecf0f6;
  height: 25px;
  padding-right: 10px;
  border-bottom: 1px solid #dce1e9;
  .icon {
    cursor: pointer;
    margin: 5px 5px;
    display: block;
    float: right;
    fill: #9ba3af;
    color: #9ba3af;
    &:hover {
      fill: #595f69;
      color: #595f69;
    }
  }
}
</style>
