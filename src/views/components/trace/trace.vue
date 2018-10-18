<template>
  <div id="svg"></div>
</template>
<script lang="js">
import * as d3 from 'd3';
/* eslint-disable */
/* tslint:disable */
export default {
  props: ['data', 'row'],
  data() {
    return {
      width: 0,
      type: {
        MQ: '#bf99f8',
        Http: '#72a5fd',
        Database: '#ff6732',
        Unknown: '#ffc107',
      },
      margin:{ top: 30, right: 20, bottom: 30, left: 20 },
      root: '',
    }
  },
  mounted() {
    this.width = this.$el.offsetWidth;
    this.draw();
  },
  methods: {
    draw() {
      d3.select('svg').remove();
      let i = 0;
      const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

      const svg = d3.select('#svg').append('svg').attr('width', this.width - this.margin.right).append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      const min = d3.min(this.row.map(i => i.startTime));
      const max = d3.max(this.row.map(i => i.endTime - min));
      const list = Array.from(new Set(this.row.map(i => i.applicationCode)));
      const sequentialScale = d3.scaleSequential()
      .domain([0, list.length])
      .interpolator(d3.interpolateWarm);
      const xScale = d3.scaleLinear().range([0,this.width*0.387]).domain([0, max]);
      const xAxis = d3.axisTop(xScale).tickFormat(d => {
        if(d === 0) return 0;
        if(d>=1000) return d/1000 + 's'; 
        return d + ' ms'
        });
      d3.select('svg').append('g').attr('transform',`translate(${this.width*0.618 - this.margin.right - this.margin.right},30)`).call(xAxis);

      this.root = d3.hierarchy(this.data);
      this.root.x0 = 0;
      this.root.y0 = 0;
      this.update(this.root);
    },
    update(source) {
        const nodes = this.root.descendants();
        const height = Math.max( 500, nodes.length * 48 + this.margin.top + this.margin.bottom);

        d3.select('svg').transition().duration(400).attr('height', height);

        d3.select(self.frameElement).transition().duration(400).style('height', height + 'px');

        let index = -1;
        this.root.eachBefore(n => {
          n.x = ++index * 48;
          n.y = n.depth * 20;
        });

        const node = svg.selectAll('.trace-node').data(nodes, d => d.id || (d.id = ++i));

        const nodeEnter = node.enter().append('g').attr('class', 'trace-node')
          .attr('transform',d => 'translate(' + source.y0 + ',' + source.x0 + ')')
          .style('opacity', 0);

        nodeEnter.append('rect').attr('class', 'trace-node-container').attr('rx',4).attr('ry',4).attr('y', -18).attr('height', 48).attr('width', '100%');
        nodeEnter.append('text').attr('dy', 2).attr('dx', 25)
          .text(d => d.data.label.length > 45 ? `${d.data.label.slice(0, 45)}...` : `${d.data.label}`);
        nodeEnter.append('text').style('fill', d => type[d.data.layer]).style('stroke', d => type[d.data.layer]).style('stroke-width', '0.8').style('font-size', '11px').attr('dy', 2)
          .attr('dx', d => d.data.label.length > 50 ? 320 : 40 + d.data.label.length * 6.9)
          .text(d => d.data.layer);
        nodeEnter.append('text').attr('dy', 20).attr('dx', 30).style('fill', '#acacac').style('font-size', '11px')
          .text(d => `${d.data.applicationCode? d.data.applicationCode : ''} ${d.data.component? `> ${d.data.component}` : ''}`);
        nodeEnter.append('rect').attr('height', 4)
          .attr('width', (d) => {
            if ( !d.data.endTime || !d.data.startTime) return 0
            return xScale(d.data.endTime-d.data.startTime)+1;
          })
          .attr('rx', 2).attr('ry', 2)
          .attr('x', d => ( !d.data.endTime || !d.data.startTime) ? 0: this.width*0.618 - this.margin.right - this.margin.left - this.margin.right - d.y + xScale(d.data.startTime-min))
          .attr('y', -3)
          .style('fill', d => `${sequentialScale(list.indexOf(d.data.applicationCode))}`);
        nodeEnter.append('text')
          .style('font-size', '10px')
          .style('fill', '#888')
          .attr('x', d => ( !d.data.endTime || !d.data.startTime) ? 0: this.width * 0.618 - this.margin.right - this.margin.left - this.margin.right - d.y + xScale(d.data.startTime-min))
          .attr('y', 15)  
          .text(d => `${d.data.endTime - d.data.startTime} ms`);
        nodeEnter.transition().duration(400).attr('transform', d => 'translate(' + d.y + ',' + d.x + ')').style('opacity', 1);

        node.transition().duration(400)
          .attr('transform', d =>  'translate(' + d.y + ',' + d.x + ')')
          .style('opacity', 1)
          .select('rect');

        node
          .exit()
          .transition()
          .duration(400)
          .attr('transform', function(d) {
            return 'translate(' + source.y + ',' + source.x + ')';
          })
          .style('opacity', 0)
          .remove();
        // Update the links…
        var link = svg.selectAll('.trace-link').data(this.root.links(), function(d) {
          return d.target.id;
        });

        link.enter().insert('path', 'g').attr('class', 'trace-link')
          .attr('d', d => {
            const o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
          })
          .transition()
          .duration(400)
          .attr('d', diagonal);

        link.transition().duration(400).attr('d', diagonal);

        link.exit().transition().duration(400)
          .attr('d', d => {
            const o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
          })
          .remove();
        this.root.each(d => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }
  },
};
</script>
<style lang="scss">
</style>
