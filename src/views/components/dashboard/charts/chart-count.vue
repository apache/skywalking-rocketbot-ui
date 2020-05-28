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
  <div class="rk-chart-count">
    <div class="mb-10 pt-10 b">
      <span class="mr-10">YoungGC Count</span>
      <span class="count r">
        {{
          (data.instance_jvm_young_gc_count || []).reduce(function(preValue, curValue, index, array) {
            return preValue + curValue;
          }, 0)
        }}
      </span>
    </div>
    <div class="mb-10 pt-10 b">
      <span class="mr-10">OldGC Count</span>
      <span class="count r">
        {{
          (data.instance_jvm_old_gc_count || []).reduce(function(preValue, curValue, index, array) {
            return preValue + curValue;
          }, 0)
        }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartCount extends Vue {
    @Prop() private data!: any;
  }
</script>
<style lang="scss">
  .rk-chart-count {
    padding-top: 15px;
    .count {
      padding: 0 5px;
      display: inline-block;
      background-color: #40454e;
      color: #eee;
      border-radius: 4px;
    }
  }
</style>
