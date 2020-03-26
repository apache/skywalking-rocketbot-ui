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
export const linkElement = (graph) => {
  const linkEnter = graph
    .append('path')
    .attr('class', 'topo-line')
    .attr('stroke', (d) => (d.cpm ? '#217EF25f' : '#6a6d7777'));
  return linkEnter;
};
export const anchorElement = (graph, funcs, tip) => {
  const linkEnter = graph
    .append('circle')
    .attr('class', 'topo-line-anchor')
    .attr('r', 5)
    .attr('fill', (d) => (d.cpm ? '#217EF25f' : '#6a6d7777'))
    .on('mouseover', function(d) {
      tip.html(funcs.$tip).show(d, this);
    })
    .on('mouseout', function() {
      tip.hide(this);
    })
    .on('click', (d) => {
      funcs.handleLinkClick(d);
    });
  return linkEnter;
};
