<template>
  <div class="rk-alarm-item">
    <div class="icon"><ion-icon name="information-circle-outline"></ion-icon></div>
    <div class="content">
      <div>192.168.2.96:8761应用 成功率告警</div>
      <div class="sm">Type: <span class="blue">LOW_SUCCESS_RATE</span></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({})
export default class RkAlarmItem extends Vue {
}
</script>
<style lang="scss">
.rk-alarm-item{
  overflow: hidden;
  border-radius: 4px;
  background-color: #f6f7fb;
  display: flex;
  margin-bottom: 5px;
  .content{
    padding: 5px 15px;
  }
  .icon{
    text-align: center;
    width: 45px;
    height: 50px;
    line-height: 58px;
    font-size: 26px;
    background-color: #dadada;
    color: #f6f7fb;
  }
}
</style>
