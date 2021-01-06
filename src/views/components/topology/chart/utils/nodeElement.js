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
import icons from './icons';

icons['KAFKA-CONSUMER'] = icons.KAFKA;
export default (d3, graph, tool, funcs, tip) => {
  const nodeEnter = graph
    .append('g')
    .call(
      d3
        .drag()
        .on('start', funcs.dragstart)
        .on('drag', funcs.dragged)
        .on('end', funcs.dragended),
    )
    .on('mouseover', function(d) {
      tip.html((data) => `<div>${data.name}</div>`).show(d, this);
    })
    .on('mouseout', function() {
      tip.hide(this);
    })
    .on('click', (d) => {
      event.stopPropagation();
      event.preventDefault();
      tool.attr('style', 'display: none');
      funcs.handleNodeClick(d);
      if (d.isReal) {
        tool.attr('transform', `translate(${d.x},${d.y - 20})`).attr('style', 'display: block');
      }
    });
  nodeEnter
    .append('image')
    .attr('width', 49)
    .attr('height', 49)
    .attr('x', 2)
    .attr('y', 10)
    .attr('style', 'cursor: move;')
    .attr('xlink:href', (d) => (d.sla < 95 && d.isReal && d.cpm > 1 ? icons.CUBEERROR : icons.CUBE));
  nodeEnter
    .append('image')
    .attr('width', 32)
    .attr('height', 32)
    .attr('x', 6)
    .attr('y', -10)
    .attr('style', 'opacity: 0.5;')
    .attr('xlink:href', icons.LOCAL);
  nodeEnter
    .append('image')
    .attr('width', 18)
    .attr('height', 18)
    .attr('x', 13)
    .attr('y', -7)
    .attr('xlink:href', (d) =>
      !d.type || d.type === 'N/A' ? icons.UNDEFINED : icons[d.type.toUpperCase().replace('-', '')],
    );
  nodeEnter
    .append('text')
    .attr('class', 'topo-text')
    .attr('text-anchor', 'middle')
    .attr('x', 22)
    .attr('y', 70)
    .text((d) => (d.name.length > 20 ? `${d.name.substring(0, 20)}...` : d.name));
  return nodeEnter;
};
