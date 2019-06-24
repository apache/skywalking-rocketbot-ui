<template>
<div class="rk-chart-num b">
  <span>{{(avg || 0).toFixed(2)}}</span>
  <span class="rk-chart-num-unit">{{unit}}</span>
</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Request extends Vue {
  @Prop() private data!: any;
  @Prop() private i!: any;
  @Prop() private intervalTime!: any;
  get avg() {
    const data = this.data[Object.keys(this.data)[0]].filter((i: number) => i > 0 );
    return data.reduce((acc: number, val: number) => acc + val, 0) / data.length;
  }
  get unit() {
    let unit = 'ms';
    if (
      this.i.d === 'databaseThroughput' ||
      this.i.d === 'serviceThroughput' ||
      this.i.d === 'instanceThroughput' ||
      this.i.d === 'endpointThroughput'
    ) {
      unit = 'cpm';
    }
    if (
      this.i.d === 'databaseSLA' ||
      this.i.d === 'serviceSLA' ||
      this.i.d === 'instanceSLA' ||
      this.i.d === 'endpointSLA'
    ) {
      unit = '%';
    }
    return unit;
  }
}
</script>
<style lang="scss">
.rk-chart-num{
  font-size: 24px;
}
.rk-chart-num-unit{
  font-size: 16px;
}
</style>


