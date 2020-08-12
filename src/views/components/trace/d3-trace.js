/**</template>
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

import * as d3 from 'd3';
import d3tip from 'd3-tip';
/* eslint-disable */
const type = {
  MQ: '#bf99f8',
  Http: '#72a5fd',
  Database: '#ff6732',
  Unknown: '#ffc107',
  Cache: '#00bcd4',
  RPCFramework: '#ee4395',
};
export default class Trace {
  constructor(el, show) {
    this.barHeight = 48;
    this.show = show;
    this.el = el;
    this.i = 0;
    this.width = el.clientWidth;
    this.height = el.clientHeight;
    this.svg = d3
      .select(this.el)
      .append('svg')
      .attr('class', 'trace-list-dowanload')
      .attr('width', this.width)
      .attr('height', this.height);
    this.treemap = d3.tree().size([this.height * 0.7, this.width]);
    this.tip = d3tip()
      .attr('class', 'd3-tip')
      .offset([-8, 0])
      .html(
        (d) => `
      <div class="mb-5">${d.data.label}</div>
      ${
        d.data.dur
          ? '<div class="sm">SelfDuration: ' + d.data.dur + 'ms</div>'
          : ''
      }
      ${
        d.data.endTime - d.data.startTime
          ? '<div class="sm">TotalDuration: ' +
            (d.data.endTime - d.data.startTime) +
            'ms</div>'
          : ''
      }
      `,
      );
    this.svg.call(this.tip);
  }
  diagonal(d) {
    return `M ${d.source.y} ${d.source.x + 5}
    L ${d.source.y} ${d.target.x - 30}
    L${d.target.y} ${d.target.x - 20}
    L${d.target.y} ${d.target.x - 5}`;
  }
  init(data, row, fixSpansSize) {
    d3.select('.trace-xaxis').remove();
    this.row = row;
    this.data = data;
    this.min = d3.min(this.row.map((i) => i.startTime));
    this.max = d3.max(this.row.map((i) => i.endTime - this.min));
    this.list = Array.from(new Set(this.row.map((i) => i.serviceCode)));
    this.xScale = d3
      .scaleLinear()
      .range([0, this.width * 0.387])
      .domain([0, this.max]);
    this.xAxis = d3.axisTop(this.xScale).tickFormat((d) => {
      if (d === 0) return 0;
      if (d >= 1000) return d / 1000 + 's';
      return d;
    });
    this.svg.attr('height', (this.row.length + fixSpansSize + 1) * this.barHeight);
    this.svg
      .append('g')
      .attr('class', 'trace-xaxis')

      .attr('transform', `translate(${this.width * 0.618 - 20},${30})`)
      .call(this.xAxis);
    this.sequentialScale = d3
      .scaleSequential()
      .domain([0, this.list.length + 1])
      .interpolator(d3.interpolateCool);
    this.root = d3.hierarchy(this.data, (d) => d.children);
    this.root.x0 = 0;
    this.root.y0 = 0;
  }
  draw(callback) {
    this.update(this.root, callback);
  }
  click(d, scope) {
    if (!d.data.type) return;
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    scope.update(d);
  }
  update(source, callback) {
    const that = this;
    const nodes = this.root.descendants();
    let index = -1;
    this.root.eachBefore((n) => {
      n.x = ++index * this.barHeight + 24;
      n.y = n.depth * 12;
    });
    const node = this.svg
      .selectAll('.trace-node')
      .data(nodes, (d) => d.id || (d.id = ++this.i));
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('transform', `translate(${source.y0},${source.x0})`)
      .attr('class', 'trace-node')
      .style('opacity', 0)
      .on('mouseover', function(d, i) {
        that.tip.show(d, this);
      })
      .on('mouseout', function(d, i) {
        that.tip.hide(d, this);
      })
      .on('click', function(d) {
        that.show.handleSelectSpan(d);
      });
    nodeEnter
      .append('rect')
      .attr('height', 42)
      .attr('ry', 2)
      .attr('rx', 2)
      .attr('y', -22)
      .attr('x', 20)
      .attr('width', '100%')
      .attr('fill', 'rgba(0,0,0,0)');
    nodeEnter
      .append('text')
      .attr('x', 13)
      .attr('y', 5)
      .attr('fill', '#E54C17')
      .html((d) => (d.data.isError ? '◉' : ''));
    nodeEnter
      .append('text')
      .attr('class', 'node-text')
      .attr('x', 35)
      .attr('y', -6)
      .attr('fill', '#333')
      .text((d) => {
        if (d.data.label === 'TRACE_ROOT') {
          return '';
        }
        return d.data.label.length > 40
          ? `${d.data.label.slice(0, 40)}...`
          : `${d.data.label}`;
      });
    nodeEnter
      .append('text')
      .attr('class', 'node-text')
      .attr('x', 35)
      .attr('y', 12)
      .attr('fill', '#ccc')
      .style('font-size', '11px')
      .text(
        (d) =>
          `${d.data.layer || ''} ${
            d.data.component ? '- ' + d.data.component : d.data.component || ''
          }`,
      );
    nodeEnter
      .append('rect')
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('height', 4)
      .attr('width', (d) => {
        if (!d.data.endTime || !d.data.startTime) return 0;
        return this.xScale(d.data.endTime - d.data.startTime) + 1 || 0;
      })
      .attr('x', (d) =>
        !d.data.endTime || !d.data.startTime
          ? 0
          : this.width * 0.618 -
              20 -
              d.y +
              this.xScale(d.data.startTime - this.min) || 0,
      )
      .attr('y', -2)
      .style(
        'fill',
        (d) => `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`,
      );
    nodeEnter
      .transition()
      .duration(400)
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .style('opacity', 1);
    nodeEnter
      .append('circle')
      .attr('r', 3)
      .style('cursor', 'pointer')
      .attr('stroke-width', 2.5)
      .attr('fill', (d) =>
        d._children
          ? `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`
          : 'rbga(0,0,0,0)',
      )
      .style('stroke', (d) =>
        d.data.label === 'TRACE_ROOT'
          ? ''
          : `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`,
      )
      .on('click', (d) => {
        this.click(d, this);
        d3.event.stopPropagation();
      });
    node
      .transition()
      .duration(400)
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .style('opacity', 1)
      .select('circle')
      .attr('fill', (d) =>
        d._children
          ? `${this.sequentialScale(this.list.indexOf(d.data.serviceCode))}`
          : '',
      );

    // Transition exiting nodes to the parent's new position.
    node
      .exit()
      .transition()
      .duration(400)
      .attr('transform', `translate(${source.y},${source.x})`)
      .style('opacity', 0)
      .remove();
    const link = this.svg
      .selectAll('.trace-link')
      .data(this.root.links(), function(d) {
        return d.target.id;
      });

    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'trace-link')
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('stroke', 'rgba(0, 0, 0, 0.1)')
      .attr('stroke-width', 2)
      .attr('d', (d) => {
        const o = { x: source.x0 + 35, y: source.y0 };
        return this.diagonal({ source: o, target: o });
      })
      .transition()
      .duration(400)
      .attr('d', this.diagonal);

    link
      .transition()
      .duration(400)
      .attr('d', this.diagonal);

    link
      .exit()
      .transition()
      .duration(400)
      .attr('d', (d) => {
        const o = { x: source.x + 35, y: source.y };
        return this.diagonal({ source: o, target: o });
      })
      .remove();
    this.root.each(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    if (callback) {
      callback();
    }
  }
}
