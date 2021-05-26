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

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import { Span, StatisticsSpan, StatisticsGroupRef } from '@/types/trace';
  import TraceContainer from './trace-chart-table/trace-container.vue';
  import TraceUtil from '../trace/trace-util';

  @Component({
    components: {
      TraceContainer,
    },
  })

  export default class TraceDetailStatisticsTable extends Vue {

    @Prop() public data!: Span[];
    @Prop() public traceId!: string;
    @Prop() public showBtnDetail!: boolean;
    @Prop() public HeaderType!: string;

    public tableData: StatisticsSpan[] = [];
    public diaplay: boolean = true;
    public list: any[] = [];
    public loading: boolean = true;

    @Watch('data')
    public onDataChanged(val: any, oldVal: any) {
      if ( !this.data.length ) {
        this.tableData = [];
        return;
      }
      this.tableData = this.calculationDataforStatistics(this.data);
      this.loading = false;
    }

    private calculationDataforStatistics(data: Span[]): StatisticsSpan[] {
      this.list = TraceUtil.buildTraceDataList(data);
      const result: StatisticsSpan[] = [];
      const map = TraceUtil.changeStatisticsTree(data, this.traceId);
      map.forEach( (nodes, nodeKey) => {
        const nodeKeyData = nodeKey.split(':');
        result.push( this.getSpanGroupData( nodes, { endpointName: nodeKeyData[0], type: nodeKeyData[1] }));
      });
      return result;
    }

    private getSpanGroupData(groupspans: Span[], groupRef: StatisticsGroupRef): StatisticsSpan {
      let maxTime = 0;
      let minTime = 0;
      let sumTime = 0;
      const count = groupspans.length;
      groupspans.forEach( (groupspan: Span) => {
        const duration = groupspan.dur || 0;
        if ( duration > maxTime) {
          maxTime = duration;
        }
        if (duration < minTime) {
          minTime = duration;
        }
        sumTime = sumTime + duration;
      });
      const avgTime = count === 0 ? 0 : (sumTime / count);
      return {
        groupRef,
        maxTime,
        minTime,
        sumTime,
        avgTime,
        count,
      };
    }


    private created(): void {
      this.loading = true;
    }

    private mounted(): void {
      this.tableData = this.calculationDataforStatistics(this.data);
      this.loading = false;
      this.$eventBus.$on('TRACE-TABLE-LOADING', this, () => { this.loading = true; });
    }
  }
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