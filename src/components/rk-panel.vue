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
  @Prop() title: String;
  @Prop({
    type: String,
    default: '',
  }) width: String;
}
</script>
<style lang="scss" scoped>
.rk-box{
  width: 100%;
}
.rk-box-title{
  padding: 5px 15px;
  border-radius: 4px;
  background-color: #ecf0f6;
  color: rgba(10, 10, 10, .6);
}
.rk-box-container{
  padding:10px;
  min-height: 220px;
}
</style>
