const api = {
  "nodes": [
      {
          "id": 1,
          "name": "刘琪",
          "ntype": "Human"
      },
      {
          "id": 3,
          "name": "许开辰",
          "ntype": "Human"
      },
      {
          "id": 4,
          "name": "便利蜂企业管理咨询（上海）有限公司",
          "ntype": "Company"
      },
      {
          "id": 2,
          "name": "邻久企业管理服务（天津）有限公司",
          "ntype": "Company"
      }
  ],
  "relations": [
      {
          "id": 10,
          "startNode": 1,
          "endNode": 2,
          "label": "法人",
          "type": "OWN"
      },
      {
          "id": 11,
          "startNode": 1,
          "endNode": 4,
          "label": "法人",
          "type": "OWN"
      },
      {
          "id": 12,
          "startNode": 1,
          "endNode": 4,
          "label": "执行董事",
          "type": "SERVE"
      },
      {
          "id": 13,
          "startNode": 1,
          "endNode": 4,
          "label": "监事",
          "type": "SERVE"
      },
      {
          "id": 14,
          "startNode": 1,
          "endNode": 4,
          "label": "总经理",
          "type": "SERVE"
      },
      {
          "id": 25, 
          "startNode": 3,
          "endNode": 4,
          "label": "总经理",
          "type": "SERVE"
      },
      {
          "id": 26, 
          "startNode": 3,
          "endNode": 4,
          "label": "执行董事",
          "type": "SERVE"
      },
      {
          "id": 27, 
          "startNode": 2,
          "endNode": 4,
          "label": "参股",
          "type": "INVEST_C"
      },{
          "id": 22, 
          "startNode": 3,
          "endNode": 2,
          "label": "总经理",
          "type": "SERVE"
      },
      {
          "id": 23, 
          "startNode": 3,
          "endNode": 2,
          "label": "执行董事",
          "type": "SERVE"
      },
      {
          "id": 24, 
          "startNode": 3,
          "endNode": 4,
          "label": "监事",
          "type": "SERVE"
      }
  ]
}

const width = 800;
const height = 600;
const initScale = 0.6;
let draging = false;

const nodeConf = {
    fillColor: {
        Human: 'rgb(255, 76, 10)',
        Company: 'rgb(35, 148, 206)'
    },
    strokeColor: {
        Human: 'rgb(244,56,0)',
        Company: 'rgb(35, 148, 206)'
    },
    strokeWidth: {
        Human: 3,
        Company: 0
    },
    textFillColor: {
        Human: '#fff',
        Company: '#fff'
    },
    radius: {
        Human: 36,
        Company: 56
    }
};

const lineConf = {
    strokeColor: {
        SERVE: 'rgb(128, 194, 216)',
        OWN: 'rgb(204, 225, 152)',
        INVEST_C: 'rgb(242, 90, 41)'
    }
};

const nodeTextFontSize = 16;
const lineTextFontSize = 12;

let nodesMap = {};
let linkMap = {};

// 力导向图
const force = d3.layout.force()
    .size([width, height]) // 画布的大小
    .linkDistance(400) // 连线长度
    .charge(-2000); // 排斥/吸引，值越小越排斥

// 全图缩放器
const zoom = d3.behavior.zoom()
    .scaleExtent([0.25, 2])
    .on('zoom', zoomFn);

// 节点拖拽器（使用 d3.behavior.drag 节点拖动失效）
const drag = force.drag()
    .origin(d => d)
    .on('dragstart', dragstartFn)
    .on('drag', dragFn)
    .on('dragend', dragendFn);

// SVG
const svg = d3.select('#canvas').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .call(zoom)
    .on('dblclick.zoom', null);

// 缩放层（位置必须在 container 之前）
const zoomOverlay = svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all');

const container = svg.append('g')
    .attr('transform', 'scale(' + initScale + ')')
    .attr('class', 'container');

    setTimeout(function() {
      initialize(api);
  }, 10);
  
// 初始化
function initialize(resp) {
    let {
        nodes,
        relations
    } = resp;

    const nodesLength = nodes.length;

    // 生成 nodes map
    nodesMap = genNodesMap(nodes);

    // 构建 nodes（不能直接使用 api 中的 nodes）
    nodes = d3.values(nodesMap);

    // 起点和终点相同的关系映射
    linkMap = genLinkMap(relations);

    // 构建 links（source 属性必须从 0 开始）
    const links = genLinks(relations);

    // 绑定力导向图数据
    force
        .nodes(nodes) // 设定节点数组
        .links(links); // 设定连线数组

    // 开启力导向布局
    force.start();

    // 手动快速布局
    for (let i = 0, n = 1000; i < n; ++i) {
        force.tick();
    }

    // 停止力布局
    force.stop();

    // 固定所有节点
    nodes.forEach(node => {
        node.fixed = true;
    });

    // 箭头
    const marker = container.append('svg:defs').selectAll('marker')
        .data(force.links())
        .enter().append('svg:marker')
        .attr('id', link => 'marker-' + link.id)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', nodeConf.radius.Company)
        .attr('refY', 0)
        .attr('markerWidth', 12)
        .attr('markerHeight', 12)
        .attr('orient', 'auto')
        .attr('stroke-width', 2)
        .append('svg:path')
        .attr('d', 'M2,0 L0,-3 L9,0 L0,3 M2,0 L0,-3')
        .attr('fill', link => lineConf.strokeColor[link.type]);

    // 节点连线    
    const linkLine = container.selectAll('.link')
        .data(force.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr({
            'marker-end': link => 'url(#' + 'marker-' + link.id + ')', // 标记箭头
            'd': link => genLinkPath(link),
            'id': link => 'link-' + link.id,
        })
        .style('stroke', link => lineConf.strokeColor[link.type]);

    // 连线的文字
    const lineText = container.append('g').selectAll('.linetext')
        .data(force.links())
        .enter()
        .append('text')
        .style('font-size', lineTextFontSize)
        .attr({
            'class': 'linetext',
            'id': link => 'linktext' + link.id,
            'dx': link => getLineTextDx(link),
            'dy': 5
        });

    lineText.append('textPath')
        .attr('xlink:href', link => '#link-' + link.id)
        // .text(link => link.label);
        .text(link => link.labels);

    // 节点（圆）
    const nodeCircle = container.append('g')
        .selectAll('.node')
        .data(force.nodes())
        .enter()
        .append('g')
        .style('cursor', 'pointer')
        .attr('class', 'node')
        .attr('cx', node => node.x)
        .attr('cy', node => node.y)
        .call(drag); // 节点可拖动

    nodeCircle.append('circle')
        // .style('fill-opacity', .3)
        .style('fill', node => nodeConf.fillColor[node.ntype])
        .style('stroke', node => nodeConf.strokeColor[node.ntype])
        .style('stroke-width', node => nodeConf.strokeWidth[node.ntype])
        .attr('class', 'node-circle')
        .attr('id', node => 'node-circle-' + node.id)
        .attr('r', node => nodeConf.radius[node.ntype]);

    // 鼠标交互
    nodeCircle.on('mouseenter', function (currNode) {
            if (draging) {
                return;
            }
            toggleNode(nodeCircle, currNode, true);
            toggleLine(linkLine, currNode, true);
            toggleMarker(marker, currNode, true);
            toggleLineText(lineText, currNode, true);
        })
        .on('mouseleave', function (currNode) {
            if (draging) {
                return;
            }
            toggleNode(nodeCircle, currNode, false);
            toggleLine(linkLine, currNode, false);
            toggleMarker(marker, currNode, false);
            toggleLineText(lineText, currNode, false);
        });

    // 节点文字
    const nodeText = nodeCircle.append('text')
        .attr('class', 'nodetext')
        .attr('id', node => 'node-text-' + node.id)
        .style('font-size', nodeTextFontSize)
        .style('font-weight', 400)
        .style('fill', ({
            ntype
        }) => nodeConf.textFillColor[ntype])
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('x', function ({
            name
        }) {
            return textBreaking(d3.select(this), name);
        });

    // 更新力导向图
    function tick() {
        // 节点位置
        nodeCircle.attr('transform', node => 'translate(' + node.x + ',' + node.y + ')');
        // 连线路径
        linkLine.attr('d', link => genLinkPath(link));
        // 连线文字位置
        lineText.attr('dx', link => getLineTextDx(link));
        // 连线文字角度 
        lineText.attr('transform', function (link) {
            return getLineTextAngle(link, this.getBBox());
        });
    }

    // 更新力导向图
    // 注意1：必须调用一次 tick （否则，节点会堆积在左上角）
    // 注意2：调用位置必须在 nodeCircle, nodeText, linkLine, lineText 后
    setTimeout(function() {
        tick();
    }, 10);

    // 监听力学图运动事件，更新坐标
    force.on('tick', tick);

}

function genLinks(relations) {
    const indexHash = {};

    return relations.map(function ({
        id,
        startNode,
        endNode,
        label,
        type
    }, i) {
        const linkKey = startNode + '-' + endNode;
        const count = linkMap[linkKey];
        if (indexHash[linkKey]) {
            indexHash[linkKey] -= 1;
        } else {
            indexHash[linkKey] = count - 1;
        }

        return {
            id,
            source: nodesMap[startNode],
            target: nodesMap[endNode],
            label,
            type,
            labels: linkMap[linkKey + '-label'],
            count: linkMap[linkKey],
            index: indexHash[linkKey]
        }
    })
}

function genLinkMap(relations) {
    const hash = {};
    relations.map(function ({
        startNode,
        endNode,
        label
    }) {
        const key = startNode + '-' + endNode;
        if (hash[key]) {
            hash[key] += 1;
            hash[key + '-label'] += '、' + label;
        } else {
            hash[key] = 1;
            hash[key + '-label'] = label;
        }
    });
    return hash;
}

function genNodesMap(nodes) {
    const hash = {};
    nodes.map(function ({
        id,
        name,
        ntype
    }) {
        hash[id] = {
            id,
            name,
            ntype
        };
    });
    return hash;
}

// 生成关系连线路径
function genLinkPath(link) {
    const sr = nodeConf.radius.Human;
    const tr = nodeConf.radius.Company;

    const count = link.count;
    const index = link.index;

    let sx = link.source.x;
    let tx = link.target.x;
    let sy = link.source.y;
    let ty = link.target.y;

    return 'M' + sx + ',' + sy + ' L' + tx + ',' + ty;
}

function getLineAngle(sx, sy, tx, ty) {
    // 两点 x, y 坐标偏移值
    const x = tx - sx;
    const y = ty - sy;
    // 斜边长度
    const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) | 1;
    // 求出弧度
    const cos = x / hypotenuse;
    const radian = Math.acos(cos);
    // 用弧度算出角度   
    let angle = 180 / (Math.PI / radian);
    if (y < 0) {
        angle = -angle;
    } else if ((y == 0) && (x < 0)) {
        angle = 180;
    }
    return angle;
}

function zoomFn() {
    const {
        translate,
        scale
    } = d3.event;
    container.attr('transform', 'translate(' + translate + ')scale(' + scale * initScale + ')');
}

function dragstartFn(d) {
    draging = true;
    d3.event.sourceEvent.stopPropagation();
    force.start();
}

function dragFn(d) {
    draging = true;
    d3.select(this)
        .attr('cx', d.x = d3.event.x)
        .attr('cy', d.y = d3.event.y);
}

function dragendFn(d) {
    draging = false;
    force.stop();  
}

function isLinkLine(node, link) {
    return link.source.id == node.id || link.target.id == node.id;
}

function isLinkNode(currNode, node) {
    if (currNode.id === node.id) {
        return true;
    }
    return linkMap[currNode.id + '-' + node.id] || linkMap[node.id + '-' + currNode.id];
}

function textBreaking(d3text, text) {
    const len = text.length;
    if (len <= 4) {
        d3text.append('tspan')
            .attr('x', 0)
            .attr('y', 2)
            .text(text);
    } else {
        const topText = text.substring(0, 4);
        const midText = text.substring(4, 9);
        let botText = text.substring(9, len);
        let topY = -22;
        let midY = 8;
        let botY = 34;
        if (len <= 10) {
            topY += 10;
            midY += 10;
        } else {
            botText = text.substring(9, 11) + '...';
        }

        d3text.text('');
        d3text.append('tspan')
            .attr('x', 0)
            .attr('y', topY)
            .text(function () {
                return topText;
            });
        d3text.append('tspan')
            .attr('x', 0)
            .attr('y', midY)
            .text(function () {
                return midText;
            });
        d3text.append('tspan')
            .attr('x', 0)
            .attr('y', botY)
            .text(function () {
                return botText;
            });
    }
}

function getLineTextDx(d) {

    const sr = nodeConf.radius[d.source.ntype];
    const sx = d.source.x;
    const sy = d.source.y;
    const tx = d.target.x;
    const ty = d.target.y;

    const distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

    // const textLength = d.label.length;
    const textLength = d.labels.length;
    const deviation = 8; // 调整误差
    const dx = (distance - sr - textLength * lineTextFontSize) / 2 + deviation;

    return dx;
}

function getLineTextAngle(d, bbox) {
    if (d.target.x < d.source.x) {
        const {
            x,
            y,
            width,
            height
        } = bbox;
        const rx = x + width / 2;
        const ry = y + height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
    } else {
        return 'rotate(0)';
    }
}

function toggleNode(nodeCircle, currNode, isHover) {
    if (isHover) {
        // 提升节点层级 
        nodeCircle.sort((a, b) => a.id === currNode.id ? 1 : -1);
        // this.parentNode.appendChild(this);
        nodeCircle
            .style('opacity', .1)
            .filter(node => isLinkNode(currNode, node))
            .style('opacity', 1);

    } else {
        nodeCircle.style('opacity', 1);
    }

}

function toggleLine(linkLine, currNode, isHover) {
    if (isHover) {
        // 加重连线样式
        linkLine
            .style('opacity', .1)
            .filter(link => isLinkLine(currNode, link))
            .style('opacity', 1)
            .classed('link-active', true);
    } else {
        // 连线恢复样式
        linkLine
            .style('opacity', 1)
            .classed('link-active', false);
    }
}

function toggleLineText(lineText, currNode, isHover) {
    if (isHover) {
        // 只显示相连连线文字
        lineText
            .style('fill-opacity', link => isLinkLine(currNode, link) ? 1.0 : 0.0);
    } else {
        // 显示所有连线文字
        lineText
            .style('fill-opacity', '1.0');
    }
}

function toggleMarker(marker, currNode, isHover) {
    if (isHover) {
        // 放大箭头
        marker.filter(link => isLinkLine(currNode, link))
            .style('transform', 'scale(1.5)');
    } else {
        // 恢复箭头
        marker
            .attr('refX', nodeConf.radius.Company)
            .style('transform', 'scale(1)');
    }
}