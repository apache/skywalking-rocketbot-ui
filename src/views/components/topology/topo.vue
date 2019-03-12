<template>
  <div class="micro-topo-chart"></div>
</template>
<script lang="js">
import * as d3 from 'd3';
import d3tip from 'd3-tip';
/* tslint:disable */
const diagonal = d3.linkHorizontal()
  .x(function (d) { return d.x })
  .y(function (d) { return d.y });
const diagonalvertical = d3.linkVertical()
  .x(function (d) { return d.x })
  .y(function (d) { return d.y });

export default {
  props: {
    datas: {
      type: Object,
      default() {
        return {
          nodes: [],
          calls: [],
        };
      },
    },
  },
  data() {
    return {
      LOCAL: require('./assets/Local2.png'),
      CUBE: require('./assets/cube22.png'),
      CUBEERROR: require('./assets/cube21.png'),
      USER: require('./assets/USER.png'),
      UNKNOWN: require('./assets/UNKNOWN.png'),
      UNKNOWNCLOUD: require('./assets/UNKNOWN_CLOUD.png'),
      UNDEFINED: require('./assets/UNDEFINED.png'),
      KAFKA: require('./assets/KAFKALOGO.png'),
      KAFKACONSUMER: require('./assets/KAFKALOGO.png'),
      H2:require('./assets/H2.png'),
      REDIS:require('./assets/REDIS.png'),
      TOMCAT: require('./assets/TOMCAT.png'),
      HTTPCLIENT: require('./assets/HTTPCLIENT.png'),
      DUBBO: require('./assets/DUBBO.png'),
      MOTAN: require('./assets/MOTAN.png'),
      RESIN: require('./assets/RESIN.png'),
      OKHTTP: require('./assets/OKHTTP.png'),
      SPRINGMVC: require('./assets/SPRINGMVC.png'),
      STRUTS2: require('./assets/STRUTS2.png'),
      NUTZMVC: require('./assets/SPRINGMVC.png'),
      NUTZHTTP: require('./assets/HTTPCLIENT.png'),
      JETTY:require('./assets/JETTY.png'),
      JETTYSERVER: require('./assets/JETTYSERVER.png'),
      GRPC: require('./assets/GRPC.png'),
      ORACLE: require('./assets/ORACLE.png'),
      MYSQL: require('./assets/MYSQL.png'),
      MYSQLGROUP: require('./assets/MYSQL.png'),
      MSSQLSERVER: require('./assets/MYSQL.png'),
      MSSQLSERVERGROUP: require('./assets/MYSQL.png'),
      MONGODB: require('./assets/MONGODB.png'),
      MONGODBGROUP: require('./assets/MONGODB.png'),
      ACTIVEMQ: require('./assets/ACTIVEMQ.png'),
      ELASTICSEARCH: require('./assets/ELASTICSEARCH.png'),
      FEIGNDEFAULTHTTP: require('./assets/FEIGNDEFAULTHTTP.png'),
      HPROSE: require('./assets/HPROSE.png'),
      HPROSE: require('./assets/POSTGRESQL.png'),
      RESIN: require('./assets/RESIN.png'),
      RABBITMQ: require('./assets/RABBITMQ.png'),
      SOFARPC: require('./assets/SOFARPC.png'),
      ROCKETMQ: require('./assets/ROCKETMQ.png'),
      HTTP: require('./assets/HTTPCLIENT.png'),
      width: 600,
      height: 600,
      force: '',
      svg: '',
      graph: '',
      link: '',
      node: '',
      zoom: '',
    };
  },
  beforeDestroy() {
    this.tip.hide({}, this);
    window.removeEventListener('resize', this.resize);
    // this.$store.commit('skywalking/setCurrentNode', []);
  },
  mounted() {
    window.addEventListener('resize', this.resize);
    this.tip = d3tip()
      .attr('class', 'd3-tip-grey')
      .offset([-8, 0])
      .html(d => {
        return `
      <div class="mb-5"><span class="grey">CallType: </span>${d.callType}</div>
      <div class="mb-5"><span class="grey">Cpm: </span>${d.cpm}</div>
      <div class="mb-5"><span class="grey">DetectPoint: </span>${this.$store.state.rocketTopo.mode?d.detectPoint:'CLIENT'}</div>
      <div><span class="grey">latency: </span>${d.latency}</div>
      `});
    this.tipName = d3tip()
      .attr('class', 'd3-tip-grey')
      .offset([-8, 0])
      .html(d => {
        return `<div>${d.name}</div>`});
    this.height = this.$el.clientHeight;
    this.svg = d3
      .select(this.$el)
      .append('svg')
      .style('display','block')
      .attr('width', '100%')
      .attr('height', this.height);
  },
  watch: {
    'datas.nodes': 'draw',
  },
  methods: {
    draw() {
      const codeId = this.datas.nodes.map(i => i.id);
      for (let i = 0; i < this.datas.calls.length; i += 1) {
        const element = this.datas.calls[i];
        if(codeId.indexOf(element.target) === -1 ) {
          this.datas.calls[i].target = this.datas.calls[i].source;
        }
      }
      this.svg.select('.graph').remove();
      this.force = d3
        .forceSimulation(this.datas.nodes)
        .force('collide', d3.forceCollide().radius(() => 65))
        .force('yPos', d3.forceY().strength(1))
        .force('xPos', d3.forceX().strength(1))
        .force('charge', d3.forceManyBody().strength(-520))
        .force( 'link', d3.forceLink(this.datas.calls).id(d => d.id))
        .force('center', d3.forceCenter(window.innerWidth / 2 + 100, this.height / 2))
        .on('tick', this.tick)
        .stop();
      this.graph = this.svg.append('g').attr('class', 'graph');
      this.svg.call(this.getZoomBehavior(this.graph));
      this.graph.call(this.tip);
      this.graph.call(this.tipName);
      this.svg.on('click', (d, i) => {
        event.stopPropagation();
        event.preventDefault();
        this.$store.commit('rocketTopo/SET_NODE', {});
        this.$store.dispatch('rocketTopo/CLEAR_TOPO_INFO');
        that.tip.hide({}, this);
        this.toggleNode(this.node, d, false);
        this.toggleLine(this.line, d, false);
        this.toggleLine(this.lineNode, d, false);
      });
      this.defs = this.graph.append('defs');
      this.arrowMarker = this.defs
        .append('marker')
        .attr('id', 'arrow')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '12')
        .attr('markerHeight', '12')
        .attr('viewBox', '0 0 12 12')
        .attr('refX', '11')
        .attr('refY', '6')
        .attr('orient', 'auto');
      const arrow_path = 'M2,2 L10,6 L2,10 L3,6 L2,2';
      this.arrowMarker.append('path').attr('d', arrow_path).attr('fill', '#217EF2');
      this.gnode = this.graph.append('g').selectAll('.node');
      const that = this;
      this.node = this.gnode.data(this.datas.nodes)
        .enter()
        .append('g')
        .call(d3.drag()
          .on('start', this.dragstart)
          .on('drag', this.dragged)
          .on('end', function(d, i) {
           that.tipName.show(d, this);
          }))
        .on('mouseover', function(d, i) {
           that.tipName.show(d, this);
        })
        .on('mouseout', function(d, i) {
          that.tipName.hide(d, this);
        })
        .on('click', function(d, i) {
          event.stopPropagation();
          that.tip.hide({}, this);
          that.node.attr('class', '');
          d3.select(this).attr('class', 'node-active');
          const copyD = JSON.parse(JSON.stringify(d));
          delete copyD.x;
          delete copyD.y;
          delete copyD.vx;
          delete copyD.vy;
          delete copyD.fx;
          delete copyD.fy;
          delete copyD.index;
          that.$store.commit('rocketTopo/SET_NODE', copyD);
          that.toggleNode(that.node, d, true);
          that.toggleLine(that.line, d, true);
          that.toggleLine(that.lineNode, d, true);
        });
      this.node
        .append('image')
        .attr('width', 49)
        .attr('height', 49)
        .attr('x', 2)
        .attr('y', 10)
        .attr('style', 'cursor: move;')
        .attr('xlink:href',d => {
          const type = d.type;
          if( d.sla < 100 ) {
            return this.CUBEERROR;
          }
          return this.CUBE;
        });
      this.node
        .append('image')
        .attr('width',40)
        .attr('height', 40)
        .attr('x', 2)
        .attr('y', -17)
        .attr('style', 'opacity: 0.5;')
        .attr('xlink:href',this.LOCAL);
      this.node
        .append('image')
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 12)
        .attr('y', -11)
        .attr('xlink:href',d => {
          if( !d.type || d.type === 'N/A') {
            return this['UNDEFINED']
          }
          return this[d.type.toUpperCase().replace('-','')];
        });
      this.node
        .append('text')
        .attr('class', 'node-text')
        .attr('text-anchor', 'middle')
        .attr('x', 22)
        .attr('y', 70)
        .text(d => d.name.length >= 12 ? `${d.name.substring(0,12)}...`: d.name)
      
      this.glink = this.graph.append('g').selectAll('.link');
      this.link = this.glink.data(this.datas.calls).enter();
      this.line = this.link.append('path').attr('class', 'link')
        .attr('stroke-dasharray', '13 7')
        .attr('stroke', d => d.cpm ? '#217EF25f' : '#6a6d7777');
      const handleSelectLine = function(d, i) {
        that.tip.hide({}, this);
      }
      this.lineNode = this.link.append('rect').attr('class', 'link-node cp')
        .attr('width', 6)
        .attr('height', 6)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('fill', d => d.cpm ? '#217EF299' : '#6a6d7799')
        .on('click', function(d, i) {
          event.stopPropagation();
          that.tip.hide({}, this);
          that.tip.show(d, this);
          that.$store.dispatch(that.$store.state.rocketTopo.mode ? 'rocketTopo/GET_TOPO_SERVICE_INFO' : 'rocketTopo/GET_TOPO_CLIENT_INFO', {id:d.id,duration: that.$store.getters.durationTime});
          that.$store.commit('rocketTopo/SET_CALLBACK', function() {
            that.tip.hide({}, this);
            that.tip.show(d, this);
            that.$store.dispatch(that.$store.state.rocketTopo.mode ? 'rocketTopo/GET_TOPO_SERVICE_INFO' : 'rocketTopo/GET_TOPO_CLIENT_INFO', {id:d.id,duration: that.$store.getters.durationTime});
          })
        });
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
    },
    isLinkNode(currNode, node) {
    if (currNode.id === node.id) {
        return true;
    }
    return this.datas.calls.filter(i => 
      (i.source.id === currNode.id || i.target.id === currNode.id) &&
      (i.source.id === node.id || i.target.id === node.id)
    ).length;
  },
    toggleNode(nodeCircle, currNode, isHover) {
    if (isHover) {
        // 提升节点层级 
      nodeCircle.sort((a, b) => a.id === currNode.id ? 1 : -1);
      nodeCircle
          .style('opacity', .2)
          .filter(node => this.isLinkNode(currNode, node))
          .style('opacity', 1);
    } else {
        nodeCircle.style('opacity', 1);
    }
},
toggleLine(linkLine, currNode, isHover) {
  if (isHover) {
    linkLine
      .style('opacity', .05)
      .style('animation', 'none')
      .filter(link => this.isLinkLine(currNode, link))
      .style('opacity', 1)
      .style('animation', 'dash 1s linear infinite');
      // .classed('link-active', true);
    } else {
      linkLine
        .style('opacity', 1)
        .style('animation', 'dash 1s linear infinite');
        // .classed('link-active', false);
    }
  },
isLinkLine(node, link) {
    return link.source.id == node.id || link.target.id == node.id;
},
toggleLineText(lineText, currNode, isHover) {
  if (isHover) {
    lineText
      .style('fill-opacity', link => this.isLinkLine(currNode, link) ? 1.0 : 0.0);
      } else {
      lineText
      .style('fill-opacity', '1.0');
    }
  },
    toggleMarker(marker, currNode, isHover) {
      if (isHover) {
        marker.filter(link => this.isLinkLine(currNode, link))
          .style('transform', 'scale(1.5)');
      } else {
        marker
          .attr('refX', nodeConf.radius.Company)
          .style('transform', 'scale(1)');
      }
    },
    resize() {
      this.svg.attr('height', document.body.clientHeight - 50);
    },
    tick() {
      this.line
        .attr('d', d => `M${d.source.x} ${d.source.y} Q ${(d.source.x + d.target.x)/2} ${(d.target.y + d.source.y)/2 - 80} ${d.target.x} ${d.target.y}`);
      this.lineNode.attr('transform', d => `translate(${(d.source.x + d.target.x)/2 - 3},${(d.target.y + d.source.y)/2 - 43})`);
      // this.linkText.attr('transform',d =>`translate(${(d.source.x + d.target.x) / 2},${(d.source.y + d.target.y) / 2})`);
      this.node.attr('transform', d => `translate(${d.x -  22},${d.y - 22})`);
    },
    getZoomBehavior(g) {
      const that = this;
      return d3
        .zoom()
        .scaleExtent([0.3, 10])
        .on('zoom', () => {
          that.tip.hide({}, this);
          that.tipName.hide({}, this);
          g.attr(
            'transform',
            `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${
              d3.event.transform.k
            })`
          );
        });
    },
    dragstart(d) {
      const that = this;
      that.tipName.hide({}, this);
      this.node._groups[0].forEach(d => {
        d.__data__.fx = d.__data__.x;
        d.__data__.fy = d.__data__.y;
      });
      if (!d3.event.active) {
        this.force.alphaTarget(0.01).restart();
      }
      d3.event.sourceEvent.stopPropagation();
    },
    dragged(d) {
      const that = this;
      that.tipName.hide({}, this);
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    dragended() {
      if (!d3.event.active) {
        this.force.alphaTarget(0);
      }
    },
  },
};
</script>
<style lang="scss">
.micro-topo-chart{
  height: 100%;
  width: 100%;
  .node-name {
    cursor: move;
    font-size:14px;
    fill: #ddd;
  }
  .link {
    stroke-linecap: round;
    stroke-width: 1.3px;
    fill: none;
    animation: dash 1s linear infinite;
  }
  @keyframes dash {
    from {
      stroke-dashoffset: 20;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  .node-text{
    font-family: SimSun;
    fill: #ddd;
    font-size:11px;
    opacity: 0.8;
  }
  .link-text {
    font-family: SimSun;
    fill: #ddd;
    font-size:11px;
    opacity: 0.8;
  }
  .node {
    cursor: move;
    fill: #333840;
    stroke-width: 0;
  }
  .link-node{
    stroke-width: 6px;
    stroke: rgba(255, 255, 255, 0);
  }
}
</style>
