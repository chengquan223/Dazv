/**
 * ToolTip消息框
 */
function ToolTip(container, options) {
    this.opts = options;
    this.container = container;
    this.style = options.style;
    this.isShow = options.isShow;
    this.create();
}

ToolTip.prototype.create = function () {
    var toolTip = document.createElement('div');
    toolTip.style.cssText = this.style;
    this.dom = toolTip;
    this.container.appendChild(toolTip);
}

ToolTip.prototype.setPosition = function (x, y) {
    var dom = this.dom;
    var left = x - dom.offsetWidth - this.opts.position[0];
    var top = y - dom.offsetHeight - this.opts.position[1];
    dom.style.left = left + 'px';
    dom.style.top = top + 'px';
}

ToolTip.prototype.setContent = function (content) {
    this.dom.innerHTML = content;
}

ToolTip.prototype.show = function () {
    this.dom.style.visibility = 'visible';
}

ToolTip.prototype.hide = function () {
    this.dom.style.visibility = 'hidden';
}


export default ToolTip;