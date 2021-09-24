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
    <rk-alert
      :show.sync="stateDashboardOption.serviceErrors"
      type="error"
      message="Fetch service errors"
      :description="stateDashboardOption.serviceErrors"
    />
    <rk-alert
      :show.sync="stateDashboardOption.instanceErrors"
      type="error"
      message="Fetch service instance errors"
      :description="stateDashboardOption.instanceErrors"
    />
    <rk-alert
      :show.sync="stateDashboardOption.endpointErrors"
      type="error"
      message="Fetch endpoint errors"
      :description="stateDashboardOption.endpointErrors"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import { State as optionState } from '@/store/modules/global/selectors';

  @Component
  export default class SelectorAlerts extends Vue {
    @State('rocketOption') private stateDashboardOption!: optionState;
  }
</script>
