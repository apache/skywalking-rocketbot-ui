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
      UNKNOWN_CLOUD: require('./assets/UNKNOWN_CLOUD.png'),
      UNDEFINED: require('./assets/UNDEFINED.png'),
      KAFKACONSUMER: require('./assets/kafka.png'),
      KAFKA: require('./assets/kafka.png'),
      H2:require('./assets/DATABASE.png'),
      REDIS:require('./assets/REDIS.png'),
      TOMCAT: require('./assets/TOMCAT.png'),
      HTTPCLIENT: require('./assets/www(1).png'),
      DUBBO: require('./assets/DUBBO_PROVIDER.png'),
      MOTAN: require('./assets/DATABASE.png'),
      RESIN: require('./assets/RESIN.png'),
      FEIGN: require('./assets/www(1).png'),
      OKHTTP: require('./assets/www(1).png'),
      SPRINGRESTTEMPLATE: require('./assets/www(1).png'),
      SPRINGMVC: require('./assets/SPRING_BOOT.png'),
      STRUTS2: require('./assets/DATABASE.png'),
      NUTZMVC: require('./assets/SPRING_BOOT.png'),
      NUTZHTTP: require('./assets/www(1).png'),
      JETTYCLIENT:require('./assets/www(1).png'),
      JETTYSERVER: require('./assets/SPRING_BOOT.png'),
      SHARDINGJDBC: require('./assets/ShardingJDBC.png'),
      GRPC: require('./assets/GRPC.png'),
      ELASTICJOB: require('./assets/ElasticJob.png'),
      HTTPASYNCCLIENT: require('./assets/www(1).png'),
      DUBBO_PROVIDER: require('./assets/DUBBO_PROVIDER.png'),
      DUBBO_PROVIDER_GROUP: require('./assets/DUBBO_PROVIDER_GROUP.png'),
      ServiceComb: require('./assets/ORACLE_GROUP.png'),
      ORACLE: require('./assets/ORACLE.png'),
      NG: require('./assets/ng.png'),
      NBASE: require('./assets/NBASE.png'),
      NBASE_T: require('./assets/NBASE_T.png'),
      NBASE_ARC: require('./assets/NBASE_ARC.png'),
      NBASE_ARC_GROUP: require('./assets/NBASE_ARC_GROUP.png'),
      MYSQL: require('./assets/MYSQL.png'),
      MYSQL_GROUP: require('./assets/MYSQL.png'),
      MSSQLSERVER: require('./assets/MSSQLSERVER.png'),
      MSSQLSERVER_GROUP: require('./assets/MSSQLSERVER_GROUP.png'),
      MONGODB: require('./assets/MONGODB.png'),
      MONGODB_GROUP: require('./assets/MONGODB_GROUP.png'),
      MEMCACHED: require('./assets/MEMCACHED.png'),
      MARIADB: require('./assets/MARIADB.png'),
      MARIADB_GROUP: require('./assets/MARIADB_GROUP.png'),
      JETTY: require('./assets/JETTY.png'),
      JBOSS: require('./assets/JBOSS.png'),
      ETC: require('./assets/ETC.png'),
      DUBBO_PROVIDER: require('./assets/DUBBO_PROVIDER.png'),
      DUBBO_PROVIDER_GROUP: require('./assets/DUBBO_PROVIDER_GROUP.png'),
      CUBRID: require('./assets/CUBRID.png'),
      CUBRID_GROUP: require('./assets/CUBRID_GROUP.png'),
      CLIENT: require('./assets/CLIENT.png'),
      CASSANDRA: require('./assets/CASSANDRA.png'),
      BLOC: require('./assets/BLOC.png'),
      BACKEND: require('./assets/BACKEND.png'),
      ARCUS: require('./assets/ARCUS.png'),
      APACHE: require('./assets/APACHE.png'),
      ACTIVEMQ_CLIENT: require('./assets/ACTIVEMQ_CLIENT.png'),
      ACTIVEMQ_CLIENT_GROUP: require('./assets/ACTIVEMQ_CLIENT_GROUP.png'),
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
      <div class="mb-5">CallType: ${d.callType}</div>
      <div class="mb-5">Cpm: ${d.cpm}</div>
      <div class="mb-5">DetectPoint: ${d.detectPoint}</div>
      <div>latency: ${d.latency}</div>
      `});
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
        .force('collide', d3.forceCollide().radius(() => 60))
        .force('yPos', d3.forceY().strength(1))
        .force('xPos', d3.forceX().strength(1))
        .force('charge', d3.forceManyBody().strength(-520))
        .force( 'link', d3.forceLink(this.datas.calls).id(d => d.id))
        .force('center', d3.forceCenter(window.innerWidth / 2 + 100, this.height / 2))
        .on('tick', this.tick)
        .stop();
      this.graph = this.svg.append('g').attr('class', 'graph');
          this.svg.call(this.tip);
      this.svg.call(this.getZoomBehavior(this.graph));
      this.graph.call(this.tip);
      this.svg.on('click', (d, i) => {
        this.$store.commit('rocketTopo/SET_NODE', {});
        that.tip.hide({}, this);
        this.toggleNode(this.node, d, false);
        this.toggleLine(this.line, d, false);
        this.toggleLine(this.lineNode, d, false);
        // this.toggleMarker(marker, currNode, true);
        // this.toggleLineText(this.linkText, d, false);
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

      // .attr("marker-end","url(#arrow)");
      // this.linkText = this.link.append('g');
      // this.linkText
      //   .append('rect')
      //   .attr('rx', 3)
      //   .attr('ry', 3)
      //   .attr('width', 6)
      //   .attr('height', 6)
      //   .attr('x', -3)
      //   .attr('y', -3)
      //   .attr('fill', '#217EF2a0');
      // this.linkText
      //   .append('text')
      //   .attr('font-size', 10)
      //   .attr('class', 'link-text')
      //   .attr('text-anchor', 'middle')
      //   .attr('y', 5)
      //   .text(d => d.cpm);
      this.arrowMarker.append('path').attr('d', arrow_path).attr('fill', '#217EF2');
      this.gnode = this.graph.append('g').selectAll('.node');
      const that = this;
      this.node = this.gnode.data(this.datas.nodes)
        .enter()
        .append('g')
        .call(d3.drag()
            .on('start', this.dragstart)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        )
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
        .attr('style', 'opacity: 0.7;')
        .attr('xlink:href',this.LOCAL);
      this.node
        .append('image')
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 12)
        .attr('y', -11)
        .attr('xlink:href',d => {
          if( !d.type || d.type === 'N/A') {
            return this['UNKNOWN_CLOUD']
          }
          return this[d.type.toUpperCase().replace('-','')];
        });
      this.glink = this.graph.append('g').selectAll('.link');
      this.link = this.glink.data(this.datas.calls).enter();
      this.line = this.link.append('path').attr('class', 'link')
        .attr('stroke-dasharray', d => d.cpm ? '15 5': '0')
        .attr('stroke', d => d.cpm ? '#217EF288' : '#6a6d7777');
      this.lineNode = this.link.append('rect').attr('class', 'link-node cp')
        .attr('width', 6)
        .attr('height', 6)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('fill', d => d.cpm ? '#217EF2aa' : '#6a6d7799')
        .on('click', function(d, i) {
          event.stopPropagation();
          that.tip.show(d, this);
        });
      // this.node
      //   .append('text')
      //   .attr('class', 'node-name')
      //   .attr('x', 50)
      //   .attr('y', 25)
      //   .text(d => d.name)
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
          g.attr(
            'transform',
            `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${
              d3.event.transform.k
            })`
          );
        });
    },
    dragstart(d) {
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
    fill:rgba(255, 255, 255, 0);
    animation: dash 1.5s linear infinite;
  }
  @keyframes dash {
    from {
      stroke-dashoffset: 20;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  .link-text {
    font-family: SimSun;
    fill: #ddd;
    font-size:11px;
  }
  .user {
    cursor: move;
    fill: #3890ff;
  }
  .user-content {
    cursor: move;
    fill: #217ef2;
  }
  .out {
    cursor: move;
    fill: #a330ec;
  }
  .out-title {
    cursor: move;
    fill: #9026d4;
  }
  .node {
    cursor: move;
    fill: #333840;
    // stroke: #E6E9EF;
    stroke-width: 0;
  }
  // .node-active {
  //   .node {
  //     // stroke-width: 1.5;
  //     // stroke: #217EF2;
  //   }
  // }
}
  .d3-tip-grey {
      line-height: 1;
      padding: 8px;
      background: #252a2fcc;
      color: #eee;
      border-radius: 4px;
      font-size: 12px;
    }
 
    /* Creates a small triangle extender for the tooltip */
    .d3-tip-grey:after {
      box-sizing: border-box;
      display: block;
      font-size: 10px;
      width: 100%;
      line-height: 0.8;
      color: #252a2fcc;
      content: "\25BC";
      position: absolute;
      text-align: center;
    }
 
    /* Style northward tooltips specifically */
    .d3-tip-grey.n:after {
      margin: -2px 0 0 0;
      top: 100%;
      left: 0;
    }
</style>
