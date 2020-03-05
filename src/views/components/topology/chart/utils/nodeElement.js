import icons from './icons';

icons['KAFKA-CONSUMER'] = icons.KAFKA;
export default (d3, graph, tool, funcs, tip) => {
  const nodeEnter = graph
  .append('g').call(d3.drag()
  .on('start', funcs.dragstart)
  .on('drag', funcs.dragged)
  .on('end', funcs.dragended))
  .on('mouseover', function(d) { tip.html((data) => `<div>${data.name}</div>`).show(d, this)})
  .on('mouseout', function() { tip.hide(this)})
  .on('click', (d) => {
    event.stopPropagation();
    event.preventDefault();
    tool.attr('style', 'display: none');
    funcs.handleNodeClick(d);
    if(d.isReal){
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
    .attr('xlink:href', (d) => d.sla < 98 ? icons.CUBEERROR : icons.CUBE);
  nodeEnter
    .append('image')
    .attr('width',32)
    .attr('height', 32)
    .attr('x', 6)
    .attr('y', -10)
    .attr('style', 'opacity: 0.5;')
    .attr('xlink:href',icons.LOCAL);
  nodeEnter
    .append('image')
    .attr('width', 18)
    .attr('height', 18)
    .attr('x', 13)
    .attr('y', -7)
    .attr('xlink:href', (d) => (!d.type || d.type === 'N/A') ? icons.UNDEFINED : icons[d.type.toUpperCase().replace('-','')]);
  nodeEnter
    .append('text')
    .attr('class', 'topo-text')
    .attr('text-anchor', 'middle')
    .attr('x', 22)
    .attr('y', 70)
    .text(d => d.name.length > 20 ? `${d.name.substring(0, 20)}...`: d.name);
  return nodeEnter;
}