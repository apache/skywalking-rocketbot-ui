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

/* eslint-disable */
import * as d3 from 'd3';
// import d3tip from 'd3-tip';
export default class TraceMap {
  constructor(el) {
    this.type = {
      MQ: '#bf99f8',
      Http: '#72a5fd',
      Database: '#ff6732',
      Unknown: '#ffc107',
      Cache: '#00bcd4',
      RPCFramework: '#ee4395',
    };
    this.el = el;
    this.i = 0;
    this.width = el.clientWidth;
    this.height = el.clientHeight;
    this.body = d3
      .select(this.el)
      .style('height', this.height + 'px')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }
  init(data, row) {
    this.treemap = d3.tree().size([row.length * 40, this.width]);
    this.row = row;
    this.data = data;
    this.list = Array.from(new Set(this.row.map(i => i.serviceCode)));
    this.sequentialScale = d3
      .scaleSequential()
      .domain([0, this.list.length])
      .interpolator(d3.interpolateCool);
    this.svg = this.body.append('g').attr('transform', d => `translate(0, ${this.row.length * 14 + 20})`).append('g');
    this.body.call(this.getZoomBehavior(this.svg));
    this.root = d3.hierarchy(this.data, d => d.children);
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;
    this.nodes = this.treemap(this.root).descendants();
    this.nodes.forEach(function(d) {
      d.y = d.depth * 200;
      d.x0 = d.x;
      d.y0 = d.y;
    });
    this.update(this.root);
  }
  update(source) {
    const that = this;
    const links = this.nodes.slice(1);
    const node = this.svg.selectAll('g.node').data(this.nodes, d => {
      return d.id|| (d.id = ++this.i);
    });
    // node
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', `translate(${source.y0},${source.x0})`)
    nodeEnter
      .append('rect')
      .attr('class', 'block')
      .attr('y', '-20')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', 140)
      .attr('height', 50)
      .attr('stroke', d => (d.data.isError ? '#ff5722aa' : '#e4e4e4aa'));
    nodeEnter
      .append('rect')
      .attr('width', 7)
      .attr('height', 7)
      .attr('x', '5')
      .attr('y', '-8')
      .attr('rx', 3)
      .attr('ry', 3)
      .style('stroke-width', 2)
      .style('stroke', d => `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`);
    nodeEnter
      .append('text')
      .attr('dx', 17)
      .attr('fill', '#333')
      .attr('text-anchor', 'start')
      .text(d => d.data.label.length > 15 ? d.data.label.slice(0, 15)+ '...' : d.data.label);
    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 4)
      .attr('cx', '140')
      .style('fill', d => d._children ? '#8543e0aa' : '#eee')
      .on('click', click);

    this.nodeUpdate = nodeEnter.merge(node);

    this.nodeUpdate
      .transition()
      .duration(600)
      .attr('transform', function(d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    this.nodeUpdate
      .select('circle.node')
      .attr('r', 4)
      .attr('cx', '140')
      .style('fill', d => d._children ? '#8543e0aa' : '#eee')
      .attr('cursor', 'pointer');

    const nodeExit = node
      .exit()
      .transition()
      .duration(600)
      .attr('transform', function(d) {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    // link
    const link = this.svg.selectAll('path.link').data(links, d => d.id);

    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('stroke', '#0000002a')
      .attr('d', function(d) {
        const o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    const linkUpdate = linkEnter.merge(link);

    linkUpdate
      .transition()
      .duration(600)
      .attr('d', function(d) {
        return diagonal(d, d.parent);
      });

    link
      .exit()
      .transition()
      .duration(600)
      .attr('d', function(d) {
        var o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    function diagonal(s, d) {
      return `M ${s.y} ${s.x}
      C ${s.y - 30} ${s.x}, ${d.y + 170} ${d.x},
      ${d.y + 140} ${d.x}`;
    }
    function click(d, i) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      that.update(d);
      that.updatexAxis(d);
      d3.event.stopPropagation();
    }
  }
  updatexAxis(source) {
    // time
    const that = this;
    this.nodes = this.treemap(this.root).descendants();
    let index = -1;
    this.nodes.forEach(function(d) {
      d.y = d.depth * 200;
      d.timeX = ++index * 12;
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  getZoomBehavior(g) {
    return d3
      .zoom()
      .scaleExtent([0.3, 10])
      .on('zoom', () => {
        g.attr(
          'transform',
          `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${d3.event.transform.k})`
        );
      });
  }
}
