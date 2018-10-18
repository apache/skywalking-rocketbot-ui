var nodes = [{
    "id": 1,
    "ip": "1.1.1.1",
    "r": 20,
    "x": 200,
    "y": 300
}, {
    "id": 2,
    "ip": "1.1.1.2",
    "r": 30,
    "x": 300,
    "y": 300
}, {
    "id": 3,
    "ip": "1.1.1.3",
    "r": 15,
    "x": 450,
    "y": 200
}, {
    "id": 4,
    "ip": "1.1.1.4",
    "r": 20,
    "x": 450,
    "y": 400
}];
var links = [{
    "source": 1,
    "target": 2
}, {
    "source": 2,
    "target": 3
}, {
    "source": 2,
    "target": 4
}];

// 数据转换
links.some(function(v, i) {
    nodes.some(function(w, j) {
        if (v.source == w.id) {
            v.source = w;
        }
        if (v.target == w.id) {
            v.target = w;
        }
    });
    v.index = ++i;
});
console.log(nodes);
console.log(links);
// console.info(d3.select("body").select("svg"));



var svg = d3.select("body").select("svg");

var links = svg.selectAll("path")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
        var x1 = d.source.x;
        var y1 = d.source.y;
        var x2 = d.target.x;
        var y2 = d.target.y;

        return "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
    })
    .style("stroke", "blue")
    .style("storke-width", "1px");

var nodes = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", function(d) {
        return d.r
    })
    .attr("cx", function(d) {
        return d.x;
    })
    .attr("cy", function(d) {
        return d.y;
    })
    .style("fill", "red");

nodes.call(d3.drag()
    .on("start", dragstart)
    .on("drag", dragged)
    .on("end", dragend));

function dragstart() {

}

function dragged(d) {
    d.x = d3.event.x;
    d.y = d3.event.y;

    // 重新绘制当前节点以及相关的链路位置即可
    var node = d3.select(this);
    node.attr("cx", d.x)
        .attr("cy", d.y);
    var link = links.filter(function(v, i) {
        if (v.source.id == d.id || v.target.id == d.id) {
            return true;
        }
    });
    link.attr("d", function(d) {
        var x1 = d.source.x;
        var y1 = d.source.y;
        var x2 = d.target.x;
        var y2 = d.target.y;

        return "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
    });
}

function dragend() {

}