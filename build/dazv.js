(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Dazv = global.Dazv || {})));
}(this, (function (exports) { 'use strict';

var version = "1.0.0";

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

function guid(id) {
    var t = {};
    id = id || 'v';
    return t[id] ? t[id] += 1 : t[id] = 1, id + t[id];
}

function createDiv() {
    return document.createElement('div');
}

function toArray(obj) {
    return obj && obj.length ? Array.prototype.slice.call(obj) : [];
}

function mix() {
    var t = this.toArray(arguments),
        newObj = t[0];
    if (newObj === !0) {
        newObj = t[1];
        for (var i = 2; i < t.length; i++) {
            var item = t[i];
            combine(newObj, item);
        }
    } else {
        for (var i = 1; i < t.length; i++) {
            var item = t[i];
            for (var a in item) {
                item.hasOwnProperty(a) && "constructor" !== a && (newObj[a] = item[a]);
            }
        }
        return newObj;
    }
}

function combine(dest, source, r) {
    var a = 5;
    r = r || 0;
    for (var i in source) {
        if (source.hasOwnProperty(i)) {
            var o = source[i];
            null !== o && s.isObject(o) ? (s.isObject(dest[i]) || (dest[i] = {}), r < a ? n(dest[i], source[i], r + 1) : dest[i] = source[i]) : s.isArray(o) ? (dest[i] = [], dest[i] = dest[i].concat(o)) : void 0 !== o && (dest[i] = source[i]);
        }
    }
}

var util = {
    clone: clone,
    merge: merge,
    inherits: inherits,
    guid: guid,
    createDiv: createDiv,
    mix: mix,
    toArray: toArray
};

var defaults = {
    width: 1000,
    height: 500,
    fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", SimSun, "sans-serif"',
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
    },
    legend: {
        show: true,
        type: 'piecewise', //continuous,piecewise 连续,分段
        min: 0,
        max: 300,
        width: 13,
        height: 180,
        textGap: 10, //两端文字间距离
        selectedMode: 'multiple', //multiple,single 多选,单选
        itemSymbol: 'circle', //circle,rect,roundRect
        itemWidth: 20,
        itemHeight: 10,
        itemGap: 14,
        wordSpaceing: 8, //marker与文字间距离
        left: 16, //左侧图表距离
        bottom: 5, //右侧图表距离
        calculable: true, //是否启用值域漫游，当piecewise时有效，值域显示为线性渐变
        textStyle: {
            fontSize: 12,
            fontFamily: '"Microsoft YaHei", "微软雅黑", SimSun, "sans-serif"',
            color: '#3c3c3c'
        },
        gradient: {
            0.1: '#fe0000',
            0.2: '#ff3801',
            0.3: '#ff7300',
            0.4: '#ffaa01',
            0.5: '#fae200',
            0.6: '#e5f500',
            0.7: '#b0e000',
            0.8: '#84cf00',
            0.9: '#5aba00',
            1.0: '#38a702'
        },
        splitList: [{
            start: 0,
            end: 50,
            color: '#00E400',
            level: '优'
        }, {
            start: 50,
            end: 100,
            color: '#FFFF00',
            level: '良'
        }, {
            start: 100,
            end: 150,
            color: '#FF7E00',
            level: '轻度污染'
        }, {
            start: 150,
            end: 200,
            color: '#FF0000',
            level: '中度污染'
        }, {
            start: 200,
            end: 300,
            color: '#99004C',
            level: '重度污染'
        }, {
            start: 300,
            color: '#7E0023',
            level: '严重污染'
        }]
    },
    toolTip: {
        show: true,
        position: [5, 5],
        triggerOn: 'mousemove', //触发条件mousemove，click
        style: 'position:absolute;background-Color:rgba(0,0,0,0.7);transition:top 0.2s,left 0.2s;border-radius: 2px;color:#fff;line-height: 16px;padding:5px 10px;'
    }
};

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
};

CanvasLayer.prototype.addTopLeft = function () {
    var el = this.canvasDOM;
    el.style.position = 'absolute';
    el.style.top = 0;
    el.style.left = 0;
};

/**
 * 调色板
 */

/**
 * 值域
 var splitList = [{
        start: 0,
        end: 50,
        color: '#00E400',
        level: '优'
    }];
 */

function Chart(options) {
    initContainer(options);
}

Chart.prototype.init = function () {};

function initContainer(options) {
    var viewCfg = util.mix({}, defaults.viewCfg, options.viewCfg);
    var container = createContainer(options);
    options.viewCfg = viewCfg;
    options.container = container;
    initOptions(options);
    console.log(options);
}

function createContainer(options) {
    var id = options.id,
        dom = document.getElementById(id),
        container = options.container;
    if (!dom && !container) {
        throw new Error("please specify the canvas container Id !");
    }
    if (dom && container) {
        throw new Error('please specify the "container" or "id" property !');
    }
    if (!container) {
        var containerid = util.guid('v-chart');
        container = util.createDiv();
        container.id = containerid;
        container.style.position = 'relative';
        dom.appendChild(container);
    }
    return container;
}

function createCanvasLayer(options, capture) {
    var canvasLayer = new CanvasLayer(options);
    if (capture) {
        canvasLayer.addTopLeft();
    }
    canvasLayer['fontFamily'] = defaults.fontFamily;
    return canvasLayer;
}

function initOptions(options) {
    var w = options.width,
        h = options.height,
        c = options.container,
        canvasOpt = {
        width: w,
        height: h,
        containerDOM: c,
        capture: false
    },
        c1 = createCanvasLayer(canvasOpt, false),
        c2 = createCanvasLayer(canvasOpt, true),
        c3 = createCanvasLayer(canvasOpt, true);
    options.backCanvas = c1, options.midCanvas = c1, options.foreCanvas = c3;
    return options;
}

exports.version = version;
exports.Chart = Chart;

Object.defineProperty(exports, '__esModule', { value: true });

})));
