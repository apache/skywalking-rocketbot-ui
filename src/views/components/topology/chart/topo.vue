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
  <div class="micro-topo-chart"></div>
</template>
<script lang="js">
  import * as d3 from 'd3';
  import d3tip from 'd3-tip';
  import zoom from './utils/zoom';
  import { simulationInit, simulationSkip } from './utils/simulation';
  import nodeElement from './utils/nodeElement';
  import { linkElement, anchorElement } from './utils/linkElement';
  import tool from './utils/tool';
  import topoLegend from './utils/legend';
  export default {
    props: {
      current: {
        type: Object,
        default: () => ({}),
      },
      nodes: {
        type: Array,
        default: () => [],
      },
      links: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        height: 600,
        simulation: '',
      };
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    mounted() {
      window.addEventListener('resize', this.resize);
      this.svg = d3
        .select(this.$el)
        .append('svg')
        .attr('class', 'topo-svg')
        .attr('height', this.$el.clientHeight);
      this.tip = d3tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0]);
      this.graph = this.svg.append('g').attr('class', 'topo-svg_graph');
      this.graph.call(this.tip);
      this.simulation = simulationInit(d3, this.nodes, this.links, this.ticked);
      this.svg.call(zoom(d3, this.graph));
      this.node = this.graph.append('g').selectAll('.topo-node');
      this.link = this.graph.append('g').selectAll('.topo-line');
      this.anchor = this.graph.append('g').selectAll('.topo-line-anchor');
      this.tool = tool(this.graph, [
        {icon: 'API', click: this.handleGoEndpoint},
        {icon: 'INSTANCE', click: this.handleGoInstance},
        {icon: 'TRACE', click: this.handleGoTrace},
        {icon: 'ALARM', click: this.handleGoAlarm},
        {icon: 'ENDPOINT', click: this.handleGoEndpointDependency},
        {icon: ''},
      ]);
      // legend
      this.legend = this.graph.append('g').attr('class', 'topo-legend');
      topoLegend(this.legend, this.$el.clientHeight, this.$el.clientWidth);
      this.svg.on('click', (d, i) => {
        event.stopPropagation();
        event.preventDefault();
        this.$store.commit('rocketTopo/SET_NODE', {});
        this.$store.commit('rocketTopo/SET_LINK', {});
        this.$store.dispatch('rocketTopo/CLEAR_TOPO_INFO');
        this.tool.attr('style', 'display: none');
      });
    },
    watch: {
      nodes: 'update',
      links: 'update',
    },
    methods: {
      // alarm hexagon
      handleGoAlarm() {
        this.$emit('setDialog', 'alarm');
      },
      // trace hexagon
      handleGoTrace() {
        this.$emit('setDialog', 'trace');
      },
      // instace hexagon
      handleGoInstance() {
        this.$emit('setDialog', 'instance');
      },
      // endpoint hexagon
      handleGoEndpoint() {
        this.$store.dispatch('SELECT_SERVICE', {
          service: { key: this.current.id, label: this.current.name },
          duration: this.$store.getters.durationTime,
        });
        this.$emit('setDialog', 'endpoint');
      },
      // endpoint dependency hexagon
      handleGoEndpointDependency() {
        this.$emit('setDialog', 'endpoint_dependency');
      },
      handleNodeClick(d) {
        this.$emit('setCurrent', { key: d.id, label: d.name });
        const {x, y, vx, vy, fx, fy, index, ...rest} = d;
        this.$store.dispatch('rocketTopo/CLEAR_TOPO_INFO');
        this.$store.commit('rocketTopo/SET_NODE', rest);
        this.$store.commit('rocketTopo/SET_LINK', {});
      },
      handleLinkClick(d) {
        event.stopPropagation();
        this.$store.commit('rocketTopo/SET_NODE', {});
        this.$store.commit('rocketTopo/SET_LINK', d);
        this.$store.dispatch('rocketTopo/CLEAR_TOPO_INFO');
        this.$store.commit('rocketTopo/SET_MODE', d.detectPoints);
        this.$store.dispatch(this.$store.state.rocketTopo.mode ? 'rocketTopo/GET_TOPO_SERVICE_INFO' :
            'rocketTopo/GET_TOPO_CLIENT_INFO', { ...d, duration: this.$store.getters.durationTime });
        this.$store.commit('rocketTopo/SET_CALLBACK', () => {
          this.$store.dispatch(this.$store.state.rocketTopo.mode ? 'rocketTopo/GET_TOPO_SERVICE_INFO' :
            'rocketTopo/GET_TOPO_CLIENT_INFO', { ...d, duration: this.$store.getters.durationTime });
        });
      },
      resize() {
        this.svg.attr('height', this.$el.clientHeight);
      },
      update() {
        // node element
        this.node = this.node.data(this.nodes, (d) => d.id);
        this.node.exit().remove();
        this.node = nodeElement(d3, this.node.enter(), this.tool, {
          dragstart: this.dragstart,
          dragged: this.dragged,
          dragended: this.dragended,
          handleNodeClick: this.handleNodeClick,
        }, this.tip).merge(this.node);
        // line element
        this.link = this.link.data(this.links, (d) => d.id);
        this.link.exit().remove();
        this.link = linkElement(this.link.enter()).merge(this.link);
        // anchorElement
        this.anchor = this.anchor.data(this.links, (d) => d.id);
        this.anchor.exit().remove();
        this.anchor = anchorElement(this.anchor.enter(), {
          handleLinkClick: this.handleLinkClick,
          $tip: (data) =>
          `
            <div class="mb-5"><span class="grey">${this.$t('cpm')}: </span>${data.cpm}</div>
            <div class="mb-5"><span class="grey">${this.$t('latency')}: </span>${data.latency}</div>
            <div><span class="grey">${this.$t('detectPoint')}:</span>${data.detectPoints.join(' | ')}</div>
          `,
        }, this.tip).merge(this.anchor);
        // force element
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.links).id((d) => d.id);
        simulationSkip(d3, this.simulation, this.ticked);
        const loopMap = {};
        for (let i = 0; i < this.links.length; i++) {
          const link = this.links[i];
          link.loopFactor = 1;
          for (let j = 0; j < this.links.length; j++) {
            if (i === j || loopMap[i]) {
              continue;
            }
            const otherLink = this.links[j];
            if (link.source.id === otherLink.target.id && link.target.id === otherLink.source.id) {
              link.loopFactor = -1;
              loopMap[j] = 1;
              break;
            }
          }
        }
      },
      ticked() {
        this.link.attr('d', (d) => `M${d.source.x} ${d.source.y} Q ${(d.source.x
        + d.target.x) / 2} ${(d.target.y + d.source.y) / 2 - d.loopFactor * 90} ${d.target.x} ${d.target.y}`);
        this.anchor.attr('transform', (d) => `translate(${(d.source.x +
        d.target.x) / 2}, ${(d.target.y + d.source.y) / 2 - d.loopFactor * 45})`);
        this.node.attr('transform', (d) => `translate(${d.x - 22},${d.y - 22})`);
      },
      dragstart(d) {
        this.node._groups[0].forEach((g) => {
          g.__data__.fx = g.__data__.x;
          g.__data__.fy = g.__data__.y;
        });
        if (!d3.event.active) {
          this.simulation.alphaTarget(0.1).restart();
        }
        d3.event.sourceEvent.stopPropagation();
      },
      dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        d.x = d.fx;
        d.y = d.fy;
      },
      dragended() {
        if (!d3.event.active) {
          this.simulation.alphaTarget(0);
        }
      },
    },
  };
</script>
<style lang="scss">
  .micro-topo-chart {
    height: 100%;
    width: 100%;
    .topo-svg {
      display: block;
      width: 100%;
    }
    .topo-line {
      stroke-linecap: round;
      stroke-width: 1.3px !important;
      stroke-dasharray: 13 7;
      fill: none;
      animation: topo-dash 1s linear infinite !important;
    }
    .topo-line-anchor {
      cursor: pointer;
    }
    .topo-text {
      font-family: 'Lato', 'Source Han Sans CN', 'Microsoft YaHei', sans-serif;
      fill: #ddd;
      font-size: 11px;
      opacity: 0.8;
    }
    .topo-tool {
      display: none;
    }
    .topo-tool-i {
      cursor: pointer;
      .tool-hexagon {
        fill: #3f4450;
        stroke: #217ef2;
        stroke-width: 2;
        stroke-opacity: 0.5;
      }
      &:hover {
        .tool-hexagon {
          stroke-opacity: 1;
        }
      }
    }
  }
  @keyframes topo-dash {
    from {
      stroke-dashoffset: 20;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
</style>
