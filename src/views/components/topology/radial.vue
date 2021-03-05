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
  <div class="micro-radil-chart">
    <RkEcharts height="100%" :option="responseConfig" ref="radial" />
  </div>
</template>
<script lang="js">
  import * as d3 from 'd3';
  import d3tip from 'd3-tip';

  export default {
    props: {
      datas: {
        type: Object,
        default() {
          return {
            nodes: [],
            calls: [],
          };
        },
      },
    },
    computed: {
      responseConfig() {
        const graph = this.datas;
        const categories = [...new Set(graph.nodes.map((i) => i.type))].map((i) => ({name: i}));
        const links = [];
        const nodes = [];
        graph.calls.forEach((call, index) => {
          links.push({
            index,
            source: call.source.id,
            target: call.target.id,
          });
        });
        graph.nodes.forEach((node) => {
          nodes.push({
            id: node.id,
            name: node.name,
            label: {
              normal: {
                show: true,
              },
            },
            category: node.type,
          });
        });
        return {
          tooltip: {},
           color: [
            '#6be6c1',
            '#a0a7e6',
            '#96dee8',
            '#3f96e3',
            '#3fb1e3',
            '#6be6c1',
            '#626c91',
            '#a0a7e6',
            '#c4ebad',
            '#96dee8',
          ],
           legend: {
              top: 50,
              textStyle: {
                color: '#ddd',
              },
              data: categories.map((a) => a.name),
          },
          series : [
            {
              top: '20%',
              height: '60%',
              name: this.$t('service'),
              type: 'graph',
              layout: 'circular',
              circular: {
                  rotateLabel: true,
              },
              data: nodes,
              links,
              categories,
              roam: true,
              label: {
                normal: {
                  position: 'right',
                  formatter: '{b}',
                },
              },
              lineStyle: {
                color: 'source',
                curveness: 0.3,
              },
            },
          ],
        };
      },
    },
    mounted() {
      const myChart = this.$refs.radial.myChart;
      myChart.on('click', (params) => {
        const currentNode = this.datas.nodes.find((item) => item.id === params.data.id);
        if (currentNode) {
          this.$store.commit('rocketTopo/SET_NODE', currentNode);
        } else {
          this.$store.commit('rocketTopo/SET_NODE', {});
        }
      });
    },
  };
</script>
<style lang="scss">
  .micro-radil-chart {
    height: 100%;
    position: fixed;
    top: 48px;
    background-color: #333840;
    width: 100%;
    z-index: 100;
    text-align: center;
  }
  .micro-radil-chart-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 99;
  }
</style>
