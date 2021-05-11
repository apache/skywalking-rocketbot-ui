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
  <div class="trace-detail-chart-table">
    <div class="rk-trace-t-loading" v-show="loading">
      <svg class="icon loading">
        <use xlink:href="#spinner"></use>
      </svg>
    </div>
    <TraceContainer :tableData="tableData" :type="HeaderType">
      <div class="trace-tips" v-if="!tableData.length">{{ $t('noData') }}</div>
    </TraceContainer>
  </div>
</template>
<style lang="scss">
  .rk-tooltip-popper.trace-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
  .trace-detail-chart-table {
    position: relative;
    min-height: 300px;
    border-bottom: 1px solid #ccc;
  }
</style>

<script lang="js">
  import copy from '@/utils/copy';
  import TraceContainer from './trace-chart-table/trace-statistics-container';
  import _ from 'lodash';
  /* eslint-disable */
  /* tslint:disable */
  export default {
    components: {
      TraceContainer,
    },
    props: ['data', 'traceId', 'showBtnDetail', 'HeaderType'],
    watch: {
      data(val, oldVal) {
        if (!this.data.length) {
          this.tableData = [];
          return;
        }
        this.tableData = this.compute(this.data);
        this.loading = false;
      },
    },
    data() {
      return {
        tableData: [],
        diaplay: true,
        list: [],
        loading: true,
      };
    },
    methods: {
      copy,
      compute(data){
        const traceData = data[0].children;
        let map = new Map();

        for (let i=0; i<traceData.length;i++) {
          const element = traceData[i];

          if (map.has(element.endpointName)) {
            let arr =  map.get(element.endpointName);
            arr.push(element);
            map.set(element.endpointName,arr);
          }else{
            let arr = [];
            arr.push(element);
            map.set(element.endpointName,arr);
          }
        };
       const result = [];
       for(let value of map.values()){
          let maxTime = 0;
          let minTime;
          let sumTime = 0;
          let count = value.length;
          let endpointName;
          //If it only happens once,get it as value[0]
          if(count == 0){
            let element = value[0];
            count = 1;
            let a = element.endTime;
            let b = element.startTime;
            let ms = a - b;
            maxTime = ms;
            minTime = ms;
            sumTime = ms;
            endpointName = element.endpointName;

          } else {
            //get each endpointName group maxTime,minTime,sumTime
            for (let i = 0; i < value.length;i++) {
              let element = value[i];
              let a = element.endTime;
              let b = element.startTime;
              let ms = a - b;
              //set default value
              if(i == 0){
                endpointName = element.endpointName;
                maxTime = ms;
                minTime = ms;
              }else{
                if (ms > maxTime){
                  maxTime = ms;
                }
                if (ms < minTime) {
                  minTime = ms;
                }
              }
              sumTime = sumTime + ms;
            };
          }
          let avgTime = count == 0 ? 0 :(sumTime / count);
          let jsonStr = {
              'maxTime': maxTime,
              'minTime': minTime,
              'avgTime': avgTime,
              'count': count,
              'endpointName': endpointName,
              'sumTime': sumTime
              };
          result.push(jsonStr);
        };

        return result;
      },
    },
    created() {
      this.loading = true;
    },
    mounted() {
      this.tableData = this.compute(this.data);
      this.loading = false;
      this.$eventBus.$on('TRACE-TABLE-LOADING', this, ()=>{ this.loading = true });
    },
  };
</script>
<style>
  .dialog-c-text {
    white-space: pre;
    overflow: auto;
    font-family: monospace;
  }
  .trace-tips {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
</style>
