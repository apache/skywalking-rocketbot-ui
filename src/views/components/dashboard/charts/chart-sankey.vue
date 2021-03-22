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
  <RkEcharts ref="chart" :option="option" :autoResize="true" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartSankey extends Vue {
    @Prop() private title!: string;
    @Prop() private data!: any;
    @Prop() private intervalTime!: any;
    get option() {
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          backgroundColor: 'rgb(50,50,50)',
          textStyle: {
            fontSize: 13,
            color: '#ccc',
          },
          formatter: (a: any) => a.data.tip,
        },
        series: [
          {
            type: 'sankey',
            left: '30px',
            top: '20px',
            bottom: '20px',
            label: {
              formatter: (a: any) => a.data.content,
            },
            animation: false,
            color: ['#bf99f8', '#3fe1da', '#6be6c1', '#3fcfdc', '#626c91', '#3fbcde', '#a0a7e6', '#3fa9e1', '#96dee8'],
            data: this.data.nodes,
            links: this.data.calls,
            itemStyle: {
              borderWidth: 0,
            },
            lineStyle: {
              color: 'source',
              opacity: 0.12,
            },
          },
        ],
        visualMap: this.data.visualMap,
      };
    }
  }
</script>
