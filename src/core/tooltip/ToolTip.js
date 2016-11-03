/**
 * ToolTip消息框
 */
function ToolTip(container, options) {
    var self = this;
    var dom = document.createElement('div');
    options = options || {};
    self.dom = dom;
    this._x = 0;
    this._y = 0;
    self.options = options;
    container.appendChild(dom);
    self.container = container;
    self._show = false;
}

ToolTip.prototype.update = function () {
    var domStyle = this.container.style;
    if (domStyle.position !== 'absolute') {
        domStyle.position = 'relative';
    }
}

ToolTip.prototype.show = function () {
    var dom = this.dom;
    dom.style.cssText = this.options.style + ';left:' + this._x + 'px;top:' + this._y + 'px';
    dom.style.display = dom.innerHTML ? 'block' : 'none';
    this._show = true;
}

ToolTip.prototype.setContent = function (content) {
    var dom = this.dom;
    dom.innerHTML = content;
    dom.style.display = content ? 'block' : 'none';
}

ToolTip.prototype.moveTo = function (x, y) {
    var style = this.dom.style;
    style.left = x + 'px';
    style.top = y + 'px';
    this._x = x;
    this._y = y;
}

ToolTip.prototype.hide = function () {
    this.dom.style.display = 'none';
    this._show = false;
}

ToolTip.prototype.hideLater = function (time) {
    var self = this;
    if (self._show) {
        if (time) {
            self._hideDelay = time;
            self._show = false;
            self._hideTimeout = setTimeout(function () {
                self.hide()
            }, time);
        } else {
            self.hide();
        }
    }
}

ToolTip.prototype.isShow = function () {
    return this._show;
}

export default ToolTip;