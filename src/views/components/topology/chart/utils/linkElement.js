export const linkElement = (graph) => {
  const linkEnter = graph
    .append('path').attr('class', 'topo-line')
    .attr('stroke', d => d.cpm ? '#217EF25f' : '#6a6d7777');;
  return linkEnter;
}
export const anchorElement = (graph) => {
  const linkEnter = graph
    .append('circle').attr('class', 'topo-line-anchor')
    .attr('r', 5)
    .attr('fill', d => d.cpm ? '#217EF25f' : '#6a6d7777');
  return linkEnter;
}