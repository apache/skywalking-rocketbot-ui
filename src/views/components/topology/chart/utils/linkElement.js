export const linkElement = (graph) => {
  const linkEnter = graph
    .append('path').attr('class', 'topo-line')
    .attr('stroke', d => d.cpm ? '#217EF25f' : '#6a6d7777');;
  return linkEnter;
}
export const anchorElement = (graph, funcs, tip) => {
  const linkEnter = graph
    .append('circle').attr('class', 'topo-line-anchor')
    .attr('r', 5)
    .attr('fill', d => d.cpm ? '#217EF25f' : '#6a6d7777')
    .on('mouseover', function(d) { tip.html(funcs.$tip).show(d, this)})
    .on('mouseout', function() { tip.hide(this)})
    .on('click', d => {
      funcs.handleLinkClick(d);
    });
  return linkEnter;
}