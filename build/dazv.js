(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.dazv = global.dazv || {})));
}(this, (function (exports) { 'use strict';

var version = "1.0.0";

/**
 * 调色板
 */
function Palette(options) {
    options = options || {};
    this.gradient = options.gradient || {
        0.1: '#DF5A5A',
        0.2: '#DF775A',
        0.3: '#DF945A',
        0.4: '#DFB05A',
        0.5: '#DFCD5A',
        0.6: '#D4DF5A',
        0.7: '#B7DF5A',
        0.8: '#9ADF5A',
        0.9: '#7DDF5A',
        1.0: '#61DF5A'
    };
    this.width = options.width || 1;
    this.height = options.height || 256;
    this.min = options.min || 0;
    this.max = options.max || 300;
    this.init();
}

Palette.prototype.init = function () {
    var gradient = this.gradient;
    var paletteCanvas = document.createElement('canvas');
    paletteCanvas.width = this.width;
    paletteCanvas.height = this.height;
    var paletteCtx = this.paletteCtx = paletteCanvas.getContext('2d');
    var lineGradient = paletteCtx.createLinearGradient(0, 0, paletteCanvas.width, paletteCanvas.height);
    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }
    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, paletteCanvas.width, paletteCanvas.height);
};

Palette.prototype.getImageData = function () {
    return this.paletteCtx.getImageData(0, 0, this.width, this.height);
};

Palette.prototype.getColor = function (value) {
    var max = this.max;
    if (value > max) {
        max = value;
    }
    var index = Math.floor(value / max * this.height) * 4;
    var imageData = this.getImageData();
    return "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + imageData[index + 2] + ", " + imageData[index + 3] / 256 + ")";
};

var dataRange = {
    drawDataRange: function drawDataRange() {
        var canvasFore = document.getElementById('canvas_3');
        var ctxFore = canvasFore.getContext('2d');
        var palette = new Palette();
        ctxFore.putImageData(palette.getImageData(), 10, 10);
    }
};

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
};

ToolTip.prototype.show = function () {
    var dom = this.dom;
    dom.style.cssText = this.options.style + ';left:' + this._x + 'px;top:' + this._y + 'px';
    dom.style.display = dom.innerHTML ? 'block' : 'none';
    this._show = true;
};

ToolTip.prototype.setContent = function (content) {
    var dom = this.dom;
    dom.innerHTML = content;
    dom.style.display = content ? 'block' : 'none';
};

ToolTip.prototype.moveTo = function (x, y) {
    var style = this.dom.style;
    style.left = x + 'px';
    style.top = y + 'px';
    this._x = x;
    this._y = y;
};

ToolTip.prototype.hide = function () {
    this.dom.style.display = 'none';
    this._show = false;
};

ToolTip.prototype.hideLater = function (time) {
    var self = this;
    if (self._show) {
        if (time) {
            self._hideDelay = time;
            self._show = false;
            self._hideTimeout = setTimeout(function () {
                self.hide();
            }, time);
        } else {
            self.hide();
        }
    }
};

ToolTip.prototype.isShow = function () {
    return this._show;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
    '[object Function]': 1,
    '[object RegExp]': 1,
    '[object Date]': 1,
    '[object Error]': 1,
    '[object CanvasGradient]': 1,
    '[object CanvasPattern]': 1,
    // In node-canvas Image can be Canvas.Image
    '[object Image]': 1
};

var objToString = Object.prototype.toString;

function clone(source) {
    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) == 'object' && source !== null) {
        var result = source;
        if (source instanceof Array) {
            result = [];
            for (var i = 0, len = source.length; i < len; i++) {
                result[i] = clone(source[i]);
            }
        } else if (!isBuildInObject(source)
        // 是否为 dom 对象
        && !isDom(source)) {
            result = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = clone(source[key]);
                }
            }
        }
        return result;
    }
    return source;
}

function merge(target, source, overwrite) {
    // We should escapse that source is string
    // and enter for ... in ...
    if (!isObject(source) || !isObject(target)) {
        return overwrite ? clone(source) : target;
    }
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var targetProp = target[key];
            var sourceProp = source[key];
            if (isObject(sourceProp) && isObject(targetProp) && !isArray(sourceProp) && !isArray(targetProp) && !isDom(sourceProp) && !isDom(targetProp) && !isBuildInObject(sourceProp) && !isBuildInObject(targetProp)) {
                // 如果需要递归覆盖，就递归调用merge
                merge(targetProp, sourceProp, overwrite);
            } else if (overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                // NOTE，在 target[key] 不存在的时候也是直接覆盖
                target[key] = clone(source[key], true);
            }
        }
    }
    return target;
}

/**
 * 构造类继承关系
 */
function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;

    function F() {}
    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();
    for (var prop in clazzPrototype) {
        clazz.prototype[prop] = clazzPrototype[prop];
    }
    clazz.prototype.constructor = clazz;
    clazz.superClass = baseClazz;
}

function isBuildInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}

function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return type === 'function' || !!value && type == 'object';
}

function isDom(value) {
    return value && value.nodeType === 1 && typeof value.nodeName == 'string';
}

function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

var util = {
    clone: clone,
    merge: merge,
    inherits: inherits
};

var coordOption = {
    viewCfg: {
        margin: [20, 60, 60, 60]
    },
    axisCfg: {
        line: {
            lineWidth: 1, //线的宽度
            stroke: '#ccc', //线的颜色
            fill: '#f1f1f1' },
        labels: {
            fontSize: 12, //文本大小
            fill: '#3c3c3c' },
        title: {
            fontSize: 12, //同上
            fill: '#999'
        },
        tickLine: {
            lineWidth: 1, //坐标点对应的线宽度
            stroke: '#ccc',
            value: 5 },
        titleOffset: 42, //标题距离坐标轴的距离
        lableOffset: 10, //文本距离坐标轴的距离
        rows: 12, //行
        cols: 31, //列
        space: 0, //间距
        isIntersect: true //网格背景交叉
    }
};

console.log(coordOption);
var newObj = util.clone({ a: 1 });
dataRange.drawDataRange();
var tooltipCfg = { position: [5, 5], style: 'position:absolute;background-Color:rgba(0,0,0,0.7);transition:top 0.2s,left 0.2s;border-radius: 2px;color:#fff;line-height: 16px;padding:5px 10px;' };
var toolTip = new ToolTip(document.getElementById('davz-chart'), tooltipCfg);
toolTip.moveTo(15, 0);
toolTip.setContent('消息提示框');
toolTip.show();
toolTip.hideLater(600);

exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
