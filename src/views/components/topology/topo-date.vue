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
  <el-date-picker style="top: 87px;left: 40px;position: absolute;"
    v-model="date"
    type="datetimerange"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :default-time="['12:00:00']">
  </el-date-picker>
</template>
<script lang="js">
/* eslint-disable */
export default{
  computed: {
    date: {
      get() {
        return [this.$store.state.rocketbot.duration.start, this.$store.state.rocketbot.duration.end];
      },
      set(value) {
        this.$store.dispatch('SET_DURATION', value);
      },
    },
  },
};
</script>
<style lang="scss">
</style>
