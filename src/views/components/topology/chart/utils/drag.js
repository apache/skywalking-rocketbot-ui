class Drag {
  constructor(d3, elements, force) {
    this.d3 = d3;
    this.elements = elements;
    this.force = force;
  }
  start(callback) {
    if(callback) callback();
    this.elements.forEach((d) => {
      d.__data__.fx = d.__data__.x;
      d.__data__.fy = d.__data__.y;
    });
    if (!this.d3.event.active) {
      this.force.alphaTarget(0.01).restart();
    }
    this.d3.event.sourceEvent.stopPropagation();
  }
  dragged(d, callback) {
    if(callback) callback();
    d.fx = this.d3.event.x;
    d.fy = this.d3.event.y;
  }
  end() {
    if (!this.d3.event.active) {
      this.force.alphaTarget(0);
    }
  }
};

export default Drag;