/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
  <div class="rk-num-box">
    <div class="grey">{{title}}</div>
    <div class="mb-10">
      <span class="title b">{{data.length ? content.toFixed(2) : 0}} <span class="unit">{{unit}}</span></span>
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

interface NumBoxData {
  value: number;
}

@Component({})
export default class RkChartBox extends Vue {
  @Prop() private precent!: boolean;
  @Prop({ type: String, default: '' }) private title!: string;
  @Prop({ default: [] }) private data!: NumBoxData[];
  @Prop({ type: String, default: '' }) private unit!: string;
  get content() {
    const temp = this.data.map((i: NumBoxData) => i.value);
    const sum = temp.reduce((preValue: number, curValue: number, index: number, array: number[]) => preValue + curValue)
    / this.data.length;
    return this.precent ? sum / 100 : sum;
  }
}
</script>
<style lang="scss">
.rk-num-box{
  padding-left: 10px;
  .unit{
    font-size: 16px;
  }
  .title{
    font-size: 24px;
  }
}
</style>
