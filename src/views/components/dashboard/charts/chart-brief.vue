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
  <div style="overflow: auto;height: 100%;" class="scroll_hide">
    <div class="rk-chart-brief">
      <div class="rk-chart-brief-i">
        <svg class="icon lg mr-15 vm">
          <use :xlink:href="`#package`"></use>
        </svg>
        <span class="vm">{{ $t('service') }}</span>
        <span class="r b">{{ data.numOfService }}</span>
      </div>
      <div class="rk-chart-brief-i">
        <svg class="icon lg mr-15 vm">
          <use :xlink:href="`#code`"></use>
        </svg>
        <span class="vm">{{ $t('endpoint') }}</span>
        <span class="r b">{{ data.numOfEndpoint }}</span>
      </div>
      <div class="rk-chart-brief-i">
        <svg class="icon lg mr-15 vm">
          <use :xlink:href="`#epic`"></use>
        </svg>
        <span class="vm">{{ $t('database') }}</span>
        <span class="r b">{{ data.numOfDatabase }}</span>
      </div>
      <div class="rk-chart-brief-i">
        <svg class="icon lg mr-15 vm">
          <use :xlink:href="`#token`"></use>
        </svg>
        <span class="vm">{{ $t('cache') }}</span>
        <span class="r b">{{ data.numOfCache }}</span>
      </div>
      <div class="rk-chart-brief-i">
        <svg class="icon lg mr-15 vm">
          <use :xlink:href="`#soft-unwrap`"></use>
        </svg>
        <span class="vm">MQ</span>
        <span class="r b">{{ data.numOfMQ }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import moment from 'dayjs';
  @Component
  export default class ChartBrief extends Vue {
    @Prop() private data!: any;
    @Prop() private intervalTime!: any;
  }
</script>
<style lang="scss">
  .rk-chart-brief {
    // height: 215px;
  }
  .rk-chart-brief-i {
    padding: 5px 0px;
  }
</style>
