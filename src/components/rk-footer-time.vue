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
  <RkDate class="mr-10" v-model="time" position="top" format="YYYY-MM-DD HH:mm:ss"/>
</template>

<script lang="ts">
import timeFormat from '@/utils/timeFormat';

export default {
  computed: {
    time: {
      get() {
        const that: any = this;
        return [that.$store.state.rocketbot.durationRow.start, that.$store.state.rocketbot.durationRow.end];
      },
      set(val: Date[]) {
        const that: any = this;
        that.$store.dispatch('SET_DURATION', timeFormat(val));
      },
    },
  },
};
</script>

<style scoped>
</style>
