<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->

<template>
  <div class="rk-chart-num">
    <div v-for="(item, index) in data" :key="index" class="rk-num-detail">
      <span class="b">{{
        typeof item.avgNum === 'string' ? item.avgNum : isNaN(item.avgNum) ? null : item.avgNum.toFixed(2)
      }}</span>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartNum extends Vue {
    @Prop() private data!: any;
    @Prop() private item!: any;
  }
</script>
<style lang="scss" scoped>
  .rk-chart-num {
    font-size: 14px;
    color: #333;
  }
  .rk-num-detail {
    span:first-child {
      padding-right: 8px;
      box-sizing: border-box;
      color: #666;
    }
  }
</style>
