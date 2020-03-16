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
export const simulationInit = (d3, data_nodes, data_links, ticked) => {
  const simulation = d3
    .forceSimulation(data_nodes)
    .force(
      'collide',
      d3.forceCollide().radius(() => 60),
    )
    .force('yPos', d3.forceY().strength(1))
    .force('xPos', d3.forceX().strength(1))
    .force('charge', d3.forceManyBody().strength(-520))
    .force(
      'link',
      d3.forceLink(data_links).id((d) => d.id),
    )
    .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2 - 20))
    .on('tick', ticked)
    .stop();
  simulationSkip(d3, simulation, ticked);
  return simulation;
};

export const simulationSkip = (d3, simulation, ticked) => {
  d3.timeout(() => {
    const n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
    for (let i = 0; i < n; i += 1) {
      simulation.tick();
      ticked();
    }
  });
};
