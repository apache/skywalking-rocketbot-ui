<template>
  <div class="rk-box" :style="width?`width: ${width};`:''">
    <div class="rk-box-title">{{title}}</div>
    <div class="rk-box-container"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class RkPanel extends Vue {
  @Prop() private title!: string;
  @Prop({ default: '' }) private width!: string;
}
</script>
<style lang="scss" scoped>
.rk-box{
  padding-left: 5px;
  padding-right: 5px;
}
.rk-box-title{
  padding: 5px 15px;
  border-radius: 4px;
  background-color: rgba(196, 200, 225, .2);
  // color: rgba(61, 68, 79, 0.6);
  color: #9da5b2;
}
.rk-box-container{
  padding: 7px 10px;
  // min-height: 220px;
}
</style>
