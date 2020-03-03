export default (d3, graph) =>
  d3
    .zoom()
    .scaleExtent([0.3, 10])
    .on('zoom', () => {
      graph.attr(
        'transform',
        `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${d3.event.transform.k})`,
      );
    });
