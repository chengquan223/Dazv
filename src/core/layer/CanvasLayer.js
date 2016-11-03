function CanvasLayer(options) {
    this.width = options.width;
    this.height = options.height;
    this.containerDOM = options.containerDOM;
    this.capture = options.capture;
    this.init();
}

CanvasLayer.prototype.init = function () {
    var count = this.containerDOM.childNodes.length;
    var canvasDOM = document.createElement('canvas'),
        context = canvasDOM.getContext('2d');
    canvasDOM.width = this.width;
    canvasDOM.height = this.height;
    canvasDOM.style.width = this.width + 'px';
    canvasDOM.style.height = this.height + 'px';
    canvasDOM.id = 'canvas_' + (count + 1);
    this.containerDOM.appendChild(canvasDOM);
    this.canvasDOM = canvasDOM;
    this.context = context;
}

CanvasLayer.prototype.addTopLeft = function () {
    var el = this.canvasDOM;
    el.style.position = 'absolute';
    el.style.top = 0;
    el.style.left = 0;
}

export default CanvasLayer;