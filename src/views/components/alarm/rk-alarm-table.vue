<template>
<div class="rk-alarm-table-wrapper">
  <table class="rk-alarm-table">
    <col width="20%">
    <col width="40%">
    <col width="40%">
    <tr v-for="i in data" @click="selectalarm(i)">
      <td>
        # {{i.key}}
      </td>
      <td>{{i.message}}</td>
      <td>
        {{parseInt(i.startTime) | dateformat('HH:mm:ss YY/MM/DD')}}
      </td>
    </tr>
  </table>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';


@Component
export default class AlarmTable extends Vue {
  @Prop({default: () => []}) private data: any;
}
</script>

<style lang="scss" scoped>

</style>
