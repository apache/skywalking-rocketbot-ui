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
  <div>
    <span class="rk-time-tips" v-show="timeRange">{{ $t('timeTips') }}</span>
    <RkDate class="mr-10" v-model="time" position="top" format="YYYY-MM-DD HH:mm" />
  </div>
</template>

<script lang="ts">
  import timeFormat from '@/utils/timeFormat';

  export default {
    data() {
      return {
        timeRange: 0,
      };
    },
    computed: {
      time: {
        get() {
          return [
            (this as any).$store.state.rocketbot.durationRow.start,
            (this as any).$store.state.rocketbot.durationRow.end,
          ];
        },
        set(val: Date[]) {
          (this as any).timeRange = val[1].getTime() - val[0].getTime() > 60 * 24 * 60 * 60 * 1000 ? 1 : 0;
          if ((this as any).timeRange) {
            return;
          }
          (this as any).$store.dispatch('SET_DURATION', timeFormat(val));
        },
      },
    },
  };
</script>

<style scoped>
  .rk-time-tips {
    color: red;
  }
</style>
