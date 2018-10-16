import * as d3 from 'd3';

const arrow_path = 'M2,2 L10,6 L2,10 L6,6 L2,2';

export default class TopoChart {
  constructor(dom) {
    this.nodes = [],
    this.calls = [],
    this.d3 = d3;
    this.dom = dom;
    this.width = dom.offsetWidth;
    this.height = dom.offsetHeight;
    this.svg = {};
    this.graph = {};
  }
  draw(data) {
    this.nodes = data.nodes;
    this.calls = data.calls;
    this.dom.remove();
    this.force = d3
      .forceSimulation(this.nodes)
      .force('collide', d3.forceCollide().radius(() => 90))
      .force('yPos', d3.forceY().strength(1))
      .force('xPos', d3.forceX().strength(1))
      .force('charge', d3.forceManyBody().strength(-500))
      .force(
        'link',
        d3.forceLink(this.calls).id(d => d.id)
      )
      .force('center', d3.forceCenter(this.width / 2, this.height / 2 + 10))
      .on('tick', this.tick)
      .stop();
    this.graph = this.svg.append('g').attr('class', 'graph');
    this.svg.call(this.getZoomBehavior(this.graph));
    this.defs = this.graph.append('defs');
    this.arrowMarker = this.defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', '12')
      .attr('markerHeight', '12')
      .attr('viewBox', '0 0 12 12')
      .attr('refX', '44.5')
      .attr('refY', '6')
      .attr('orient', 'auto');


    this.arrowMarker
      .append('path')
      .attr('d', arrow_path)
      .attr('fill', 'rgb(250, 200, 50)');
    this.glink = this.graph.append('g').selectAll('.link');
    this.link = this.glink
      .data(this.$store.state.skywalking.topo.calls)
      .enter()
      .append('g');
    this.line = this.link
      .append('path')
      .attr('stroke-linecap', 'round')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrow)');
    this.line2 = this.link
      .append('path')
      .attr('stroke-linecap', 'round')
      .attr('class', 'link2');
    this.linkText = this.link.append('g');
    this.linkText
      .append('rect')
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 20)
      .attr('height', 20)
      .attr('x', -10)
      .attr('y', -10)
      .attr('fill', '#353539');
    this.linkText
      .append('text')
      .attr('class', 'linkText')
      .attr('text-anchor', 'middle')
      .attr('y', 3)
      .text(d => d.cpm);
    this.gnode = this.graph.append('g').selectAll('.node');
    this.node = this.gnode
      .data(this.$store.state.skywalking.topo.nodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag()
          .on('start', this.dragstart)
          .on('drag', this.dragged)
          .on('end', this.dragended),
      );
    this.node
      .append('rect')
      .attr('class', d => (d.type === 'out' ? 'out' : 'node'))
      .attr('rx', 35)
      .attr('ry', 35)
      .attr('width', 70)
      .attr('height', 70);
    this.node
      .append('image')
      .attr('width', 34)
      .attr('height', 34)
      .attr('style', 'cursor: move;')
      .attr('x', 18)
      .attr('y', 18)
      .attr('xlink:href', d => this[d.type.toUpperCase().replace('-', '')]);
    this.node
      .append('text')
      .attr('font-size', 10)
      .attr('text-anchor', 'middle')
      .attr('x', 37)
      .attr('y', 63)
      .attr('font-weight', 600)
      .text(d => {
        if (!d.sla || d.sla === 100) return;
        const rate = 100 - d.sla;
        return rate + '%';
      })
      .attr('fill', 'rgb(240, 84, 20)');
    this.node
      .append('text')
      .attr('class', 'node-name')
      .attr('text-anchor', 'middle')
      .attr('x', 35)
      .attr('font-size', 13)
      .attr('y', -10)
      .text(d => d.name)
      .attr('fill', '#fafafa');
    d3.timeout(() => {
      for (
        let i = 0,
          n = Math.ceil(
            Math.log(this.force.alphaMin()) /
              Math.log(1 - this.force.alphaDecay())
          );
        i < n;
        i += 1
      ) {
        this.force.tick();
        this.tick();
      }
    });
  }
  resize() {
    this.svg.attr('width', this.$refs.topo.offsetWidth);
    this.svg.attr('height', document.body.clientHeight - 185);
  }
  tick() {
    this.line
      .attr('stroke-width', d => {
        const a = Math.pow(d.cpm, 1 / 3);
        if (a <= 5) return '1px';
        Math.pow(d.cpm, 1 / 3) + 'px';
      })
      .attr('stroke', d => {
        if (d.cpm === 0) {
          return 'rgb(80, 80, 80)';
        }
        return 'rgb(255, 199, 31)';
      })
      .attr(
        'd',
        d => `M${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`
      );
    this.line2
      .attr('stroke-width', d => {
        const a = Math.pow(d.cpm, 1 / 3);
        if (a <= 5) return '3px';
        Math.pow(d.cpm, 1 / 3) + 2 + 'px';
      })
      .attr('d', d => {
        if (d.cpm === 0) {
          return `M${d.source.x} ${d.source.y} L ${d.source.x} ${d.source.y}`;
        } else {
          let deg = Math.atan(
            (d.source.y - d.target.y) / (d.source.x - d.target.x)
          );
          if (d.source.x - d.target.x > 0) {
            return `M${d.source.x} ${d.source.y} L ${d.target.x +
              40.5 * Math.cos(deg)} ${d.target.y + 40.5 * Math.sin(deg)}`;
          } else if (d.source.x - d.target.x < 0) {
            return `M${d.source.x} ${d.source.y} L ${d.target.x -
              40.5 * Math.cos(deg)} ${d.target.y - 40.5 * Math.sin(deg)}`;
          }
        }
      });
    this.linkText.attr(
      'transform',
      d =>
        `translate(${(d.source.x + d.target.x) / 2},${(d.source.y +
          d.target.y) /
          2})`
    );
    this.node.attr('transform', d => `translate(${d.x - 35},${d.y - 35})`);
  }
  getZoomBehavior(g) {
    return d3
      .zoom()
      .scaleExtent([0.3, 10])
      .on('zoom', () => {
        g.attr(
          'transform',
          `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${
            d3.event.transform.k
          })`
        );
      });
  }
  dragstart(d) {
    // console.log(this.node)
    this.node._groups[0].forEach(d => {
      d.__data__.fx = d.__data__.x;
      d.__data__.fy = d.__data__.y;
    });
    if (!d3.event.active) {
      this.force.alphaTarget(0.01).restart();
    }
    d3.event.sourceEvent.stopPropagation();
  }
  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  dragended() {
    if (!d3.event.active) {
      this.force.alphaTarget(0);
    }
  }
}
