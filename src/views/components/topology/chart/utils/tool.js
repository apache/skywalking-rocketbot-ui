const requireComponent = require.context('./tool', false, /\.png$/);

const icons = {};
function capitalizeFirstLetter(str) {
  return str.toUpperCase();
}
function validateFileName(str) {
  return /^\S+\.png$/.test(str) && str.replace(/^\S+\/(\w+)\.png$/, (rs, $1) => capitalizeFirstLetter($1));
}
requireComponent.keys().forEach((filePath) => {
  const componentConfig = requireComponent(filePath);
  const fileName = validateFileName(filePath);
  icons[fileName] = componentConfig;
});


const Hexagon = (side, r, cx, cy) => {
  let path = '';
  for (let i = 0; i < side; i += 1) {
    let x = Math.cos((2 / side * i + 1 / side) * Math.PI) * r + cx;
    let y = -Math.sin((2 / side * i + 1 / side) * Math.PI) * r + cy;
    path += !i ? `M${x},${y} ` : `L${x},${y} `;
    if (i == side -1 ) path += 'Z';
  }
  return path
};

export default (graph, data) => { 
  const tool = graph.append('g').attr('class', 'topo-tool');
  const side = 6;
  for (let i = 0; i < data.length; i += 1) {
    let x = Math.cos((2 / side * i) * Math.PI) * 34;
    let y = -Math.sin((2 / side * i) * Math.PI) * 34;
    const tool_g = tool.append('g').attr('class', 'topo-tool-i').on('click', data[i].click);
    tool_g.append('path').attr('class', 'tool-hexagon').attr('d', Hexagon(6, 17, x, y));
    tool_g.append('svg:image')
    .attr('width', 14)
    .attr('height', 14)
    .attr('x', x - 7)
    .attr('y', y - 7)
    .attr('style', 'opacity: 0.8')
    .attr('xlink:href',icons[data[i].icon]);
  }
  return tool;
};
