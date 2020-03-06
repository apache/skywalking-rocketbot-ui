export const simulationInit = (d3, data_nodes, data_links, ticked) => {
  const simulation = d3
  .forceSimulation(data_nodes)
  .force('collide', d3.forceCollide().radius(() => 60))
  .force('yPos', d3.forceY().strength(1))
  .force('xPos', d3.forceX().strength(1))
  .force('charge', d3.forceManyBody().strength(-520))
  .force( 'link', d3.forceLink(data_links).id((d) => d.id))
  .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2 - 20))
  .on('tick', ticked)
  .stop();
  simulationSkip(d3, simulation, ticked)
  return simulation;
}

export const simulationSkip = (d3, simulation, ticked) => {
  d3.timeout(() => {
    const n = Math.ceil( Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
    for ( let i = 0; i < n; i += 1 ) {
      simulation.tick();
      ticked();
    }
  });
}
