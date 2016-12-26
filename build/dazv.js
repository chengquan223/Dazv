(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Dazv = global.Dazv || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
    '[object Function]': 1,
    '[object RegExp]': 1,
    '[object Date]': 1,
    '[object Error]': 1,
    '[object CanvasGradient]': 1,
    '[object CanvasPattern]': 1,
    // For node-canvas
    '[object Image]': 1,
    '[object Canvas]': 1
};
var TYPED_ARRAY = {
    '[object Int8Array]': 1,
    '[object Uint8Array]': 1,
    '[object Uint8ClampedArray]': 1,
    '[object Int16Array]': 1,
    '[object Uint16Array]': 1,
    '[object Int32Array]': 1,
    '[object Uint32Array]': 1,
    '[object Float32Array]': 1,
    '[object Float64Array]': 1
};
var objToString = Object.prototype.toString;

function isObject(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return type === 'function' || !!value && type == 'object';
}

function isArray(value) {
    return objToString.call(value) === '[object Array]';
}

function isDom(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.nodeType === 'number' && _typeof(value.ownerDocument) === 'object';
}

function isBuildInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}

function clone(source) {
    if (source == null || (typeof source === 'undefined' ? 'undefined' : _typeof(source)) != 'object') {
        return source;
    }

    var result = source;
    var typeStr = objToString.call(source);

    if (typeStr === '[object Array]') {
        result = [];
        for (var i = 0, len = source.length; i < len; i++) {
            result[i] = clone(source[i]);
        }
    } else if (TYPED_ARRAY[typeStr]) {
        result = source.constructor.from(source);
    } else if (!BUILTIN_OBJECT[typeStr] && !isDom(source)) {
        result = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = clone(source[key]);
            }
        }
    }

    return result;
}

function merge(target, source, overwrite) {
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

function guid(id) {
    var t = {};
    id = id || 'v';
    return t[id] ? t[id] += 1 : t[id] = 1, id + t[id];
}

function createDiv() {
    return document.createElement('div');
}

var util = {
    merge: merge,
    guid: guid,
    createDiv: createDiv
};

var defaults = {
    width: 1000,
    height: 500,
    fontSize: 12,
    fontFamily: '"Helvetica Neue",Helvetica,"Hiragino Sans GB","STHeitiSC-LIght","Microsoft YaHei","微软雅黑",Arial,sans-serif',
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
        grid: {
            line: {
                lineWidth: 1,
                stroke: '#d9d9d9'
            }
        },
        gridAlign: 'start', //栅格的位置跟坐标点(tick)的对齐方式，当前仅支持 start和middle
        x: {
            type: 'date',
            name: '日期（day）',
            min: 0,
            max: 31,
            showLine: false,
            tickInterval: 1
        },
        y: {
            type: 'month',
            name: '月份（month）',
            min: 0,
            max: 12,
            showLine: false,
            tickInterval: 1
        },
        rows: 12, //行
        cols: 31, //列
        space: 0, //间距
        isIntersect: true //网格背景交叉
    },
    calendarCfg: {
        rows: 3,
        cols: 4,
        margin: [0, 10, 8, 0],
        monthStyle: {
            height: 21,
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#F4F4F4',
            color: '#3c3c3c'
        },
        weekStyle: {
            height: 21,
            fontSize: 12,
            fill: '#fff',
            color: '#666'
        },
        dayStyle: {
            fontSize: 12,
            lineWidth: 0.1,
            stroke: '#ccc',
            color: '#3c3c3c'
        },
        itemStyle: {
            stroke: '#eee',
            fill: '#f1f1f1',
            lineWidth: 1
        }
    },
    legendCfg: {
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
        left: 15, //左侧图表距离
        bottom: 5, //底部图表距离
        calculable: true, //是否启用值域漫游，当piecewise时有效，值域显示为线性渐变
        textStyle: {
            fontSize: 12,
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
        isShow: true,
        position: [5, 5],
        triggerOn: 'mousemove', //触发条件mousemove，click
        style: 'position:absolute;visibility:hidden;background-Color:rgba(0,0,0,0.7);transition:top 0.2s,left 0.2s;border-radius: 2px;color:#fff;line-height: 16px;padding:5px 10px;'
    }
};

function createContainer(options) {
    var id = options.id;
    var dom = document.getElementById(id);
    var container;
    if (!dom && !container) {
        throw new Error("please specify the canvas container Id !");
    }
    if (dom && container) {
        throw new Error('please specify the "container" or "id" property !');
    }
    if (!container) {
        var containerid = util.guid('v-chart');
        options.container = container = util.createDiv();
        container.id = containerid;
        container.style.position = 'relative';
        dom.appendChild(container);
    }
    return container;
}

function CanvasLayer(options) {
    this.width = options.width;
    this.height = options.height;
    this.containerDOM = options.container;
    this.fontFamily = options.fontFamily;
    this.init();
}

CanvasLayer.prototype.init = function () {
    var count = this.containerDOM.childNodes.length;
    var canvasDOM = document.createElement('canvas'),
        context = canvasDOM.getContext('2d');
    canvasDOM.id = 'canvas_' + (count + 1);
    canvasDOM.width = this.width;
    canvasDOM.height = this.height;
    canvasDOM.style.width = this.width + 'px';
    canvasDOM.style.height = this.height + 'px';
    this.containerDOM.appendChild(canvasDOM);
    this.canvasDOM = canvasDOM;
    context.fontFamily = this.fontFamily;
    this.context = context;
};

CanvasLayer.prototype.addTopLeft = function () {
    var el = this.canvasDOM;
    el.style.position = 'absolute';
    el.style.top = 0;
    el.style.left = 0;
};

function View(options) {
    var margin = options.margin;
    this.start = {
        x: margin[3],
        y: margin[0]
    };
    this.end = {
        x: options.width - margin[1],
        y: options.height - margin[2]
    };
    this.width = this.end.x - this.start.x;
    this.height = this.end.y - this.start.y;
}

/**
 * 调色板
 */
function Palette(options) {
    options = options || {};
    this.gradient = options.gradient || {
        0.1: '#fe0000',
        0.4: '#ffaa01',
        0.7: '#b0e000',
        1.0: '#38a702'
    };
    this.width = options.width || 1;
    this.height = options.height || 256;
    this.min = options.min || 0;
    this.max = options.max || 300;
    this.init();
}

Palette.prototype.init = function () {
    var gradient = this.gradient;
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    var context = this.context = canvas.getContext('2d');
    var lineGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }
    context.fillStyle = lineGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
};

Palette.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};

Palette.prototype.getColor = function (value) {
    var max = this.max;
    if (value > max) {
        max = value;
    }
    var index = Math.floor((max - value) / max * (this.height - 1)) * 4;
    var imageData = this.context.getImageData(0, 0, 1, this.height).data; //this.width会获取整个调色板data
    return "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + imageData[index + 2] + ", 1)";
};

/**
 * 值域
 */
function Choropleth(options) {
    this.options = options;
    this.splitList = options.splitList || {};
    this.type = options.type || 'continuous';
    this.calculable = options.calculable;
    this.init();
}

Choropleth.prototype.init = function () {
    if (this.type == 'piecewise' && this.calculable) {
        var palette = new Palette(this.options);
        var splitList = this.splitList;
        for (var i = 0; i < splitList.length; i++) {
            splitList[i].color = palette.getColor(splitList[i].start);
        }
    }
};

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;
    var split = false;
    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined || splitList[i].start !== undefined && count > splitList[i].start) && (splitList[i].end === undefined || splitList[i].end !== undefined && count <= splitList[i].end)) {
            split = splitList[i];
            break;
        }
    }
    return split;
};

function Legend(options, view) {
    this.options = options;
    this.init(view);
}

Legend.prototype.init = function (view) {
    var options = this.options;
    this.start = {
        x: view.end.x + options.left,
        y: view.end.y - options.bottom - options.height - options.textGap
    };
    this.end = {
        x: view.end.x + options.left + options.width,
        y: view.end.y - options.bottom - options.textGap
    };
};

Legend.prototype.draw = function (context) {
    if (this.options.show) {
        switch (this.options.type) {
            case 'piecewise':
                this.drawByPieceWise(context);
                break;
            default:
                this.drawByContinuous(context);
                break;
        }
    }
};

Legend.prototype.drawByContinuous = function (context) {
    var options = this.options;
    //调色板
    var palette = new Palette({
        width: options.width,
        height: options.height,
        min: options.min,
        max: options.max,
        gradient: options.gradient
    });
    context.putImageData(palette.getImageData(), this.start.x, this.start.y);
    context.save();
    context.font = options.textStyle.fontSize + 'px ' + context.fontFamily;
    context.fillStyle = options.textStyle.color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(options.max, this.start.x + options.width / 2, this.start.y - options.textGap);
    context.fillText(options.min, this.start.x + options.width / 2, this.end.y + options.textGap);
    context.restore();
};

Legend.prototype.drawByPieceWise = function (context) {
    var choropleth = new Choropleth(this.options); //分段颜色连续
    switch (this.options.itemSymbol) {
        case 'circle':
            this.drawCircle(context);
            break;
        case 'rect':
            this.drawRect(context);
            break;
        case 'roundRect':
            this.drawRoundRect(context);
            break;
        default:
            break;
    }
};

Legend.prototype.drawCircle = function (context) {
    var options = this.options;
    var radius = options.itemHeight / 2;
    for (var i = 0; i < options.splitList.length; i++) {
        var item = options.splitList[i];
        var itemX = this.start.x + radius;
        var itemY = this.end.y - options.itemHeight * i - options.itemGap * i - radius;
        context.fillStyle = item.color;
        context.beginPath();
        context.arc(itemX, itemY, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        context.save();
        context.textAlign = 'left';
        context.textBaseline = "middle";
        context.font = options.textStyle.fontSize + 'px ' + context.fontFamily;
        context.fillStyle = options.textStyle.color;
        context.fillText(item.level, itemX + radius + options.wordSpaceing, itemY);
        context.restore();
    }
};

Legend.prototype.drawRect = function (context) {
    var options = this.options;
    var radius = options.itemHeight / 2;
    for (var i = 0; i < options.splitList.length; i++) {
        var item = options.splitList[i];
        var itemX = this.start.x;
        var itemY = this.end.y - options.itemHeight * (i + 1) - options.itemGap * i;
        context.fillStyle = item.color;
        context.fillRect(itemX, itemY, options.itemWidth, options.itemHeight);

        context.save();
        context.textAlign = 'left';
        context.textBaseline = "middle";
        context.font = options.textStyle.fontSize + 'px ' + context.fontFamily;
        context.fillStyle = options.textStyle.color;
        context.fillText(item.level, itemX + options.itemWidth + options.wordSpaceing, itemY + radius);
        context.restore();
    }
};

Legend.prototype.drawRoundRect = function (context) {
    var options = this.options;
    var radius = options.itemHeight / 2;
    var r = 3;
    for (var i = 0; i < options.splitList.length; i++) {
        var item = options.splitList[i];
        var itemX = this.start.x;
        var itemY = this.end.y - options.itemHeight * (i + 1) - options.itemGap * i;
        context.fillStyle = item.color;
        context.beginPath();
        context.moveTo(itemX + r, itemY);
        context.arcTo(itemX + options.itemWidth, itemY, itemX + options.itemWidth, itemY + options.itemHeight, r);
        context.arcTo(itemX + options.itemWidth, itemY + options.itemHeight, itemX, itemY + options.itemHeight, r);
        context.arcTo(itemX, itemY + options.itemHeight, itemX, itemY, r);
        context.arcTo(itemX, itemY, itemX + r, itemY, r);
        context.closePath();
        context.fill();

        context.save();
        context.textAlign = 'left';
        context.textBaseline = "middle";
        context.font = options.textStyle.fontSize + 'px ' + context.fontFamily;
        context.fillStyle = options.textStyle.color;
        context.fillText(item.level, itemX + options.itemWidth + options.wordSpaceing, itemY + radius);
        context.restore();
    }
};

/**
 * 单元格
 */
function Grid(i, x, y, w, h) {
    this.i = i;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function Axis(opts, view) {
    this.opts = opts;
    this.width = view.width;
    this.height = view.height;
    this.start = view.start;
    this.end = view.end;
    this.gridWidth = (this.width - opts.cols * opts.space) / opts.cols;
    this.gridHeight = (this.height - opts.rows * opts.space) / opts.rows;
    this.createAxisData();
}

//坐标轴数据
Axis.prototype.createAxisData = function () {
    var data = this.axisData = [];
    for (var i = 0; i < this.opts.cols; i++) {
        var xdata = [];
        for (var j = 0; j < this.opts.rows; j++) {
            xdata.push({
                x: this.start.x + this.gridWidth * i + this.opts.space * (i + 1),
                y: this.start.y + this.gridHeight * j + this.opts.space * j
            });
        }
        data.push(xdata);
    }
    return data;
};

Axis.prototype.draw = function (ctxBack) {
    this.drawAxis(ctxBack);
    this.drawTickLine(ctxBack);
    this.opts.isIntersect ? this.drawRectIntersect(ctxBack) : this.drawGridRect(ctxBack);
    this.drawTitle(ctxBack);
};

//画x,y轴
Axis.prototype.drawAxis = function (ctxBack) {
    ctxBack.beginPath();
    ctxBack.lineWidth = this.opts.line.lineWidth;
    ctxBack.strokeStyle = this.opts.line.stroke;
    ctxBack.moveTo(this.start.x, this.start.y);
    ctxBack.lineTo(this.start.x, this.end.y);
    ctxBack.lineTo(this.end.x, this.end.y);
    ctxBack.stroke();
};

//画坐标轴刻度尺
Axis.prototype.drawTickLine = function (ctxBack) {
    var opts = this.opts,
        axisData = this.axisData,
        halfWidth = this.gridWidth / 2,
        halfHeight = this.gridHeight / 2;
    ctxBack.save();
    ctxBack.beginPath();
    ctxBack.lineWidth = opts.tickLine.lineWidth;
    ctxBack.strokeStyle = opts.tickLine.stroke;
    for (var i = 1; i <= axisData.length; i++) {
        var _day = axisData[i - 1][axisData[i - 1].length - 1],
            _x = _day.x + halfWidth,
            _y = this.end.y;
        ctxBack.moveTo(_x, _y);
        ctxBack.lineTo(_x, _y + opts.tickLine.value);
        this.drawLabel(ctxBack, i, _x, _y + opts.lableOffset, true);
    }
    for (var j = axisData[0].length; j > 0; j--) {
        var _month = axisData[0][axisData[0].length - j],
            _x = this.start.x,
            _y = _month.y + halfHeight;
        ctxBack.moveTo(_x, _y);
        ctxBack.lineTo(_x - opts.tickLine.value, _y);
        this.drawLabel(ctxBack, j + '月', _x - opts.lableOffset, _y, false);
    }
    ctxBack.stroke();
    ctxBack.restore();
};

//画坐标轴文本
Axis.prototype.drawLabel = function (ctxBack, title, x, y, isX) {
    ctxBack.save();
    ctxBack.font = this.opts.labels.fontSize + 'px ' + ctxBack.fontFamily;
    ctxBack.fillStyle = this.opts.labels.fill;
    if (isX) {
        ctxBack.textAlign = 'center';
        ctxBack.textBaseline = 'top';
        ctxBack.fillText(title, x, y);
    } else {
        ctxBack.textAlign = 'right';
        ctxBack.textBaseline = 'middle';
        ctxBack.fillText(title, x, y);
    }
    ctxBack.restore();
};

//画坐标轴标题
Axis.prototype.drawTitle = function (ctxBack) {
    var opts = this.opts;
    ctxBack.save();
    ctxBack.font = opts.title.fontSize + 'px ' + ctxBack.fontFamily;
    ctxBack.fillStyle = opts.title.fill;
    ctxBack.save();
    ctxBack.textAlign = 'center';
    ctxBack.textBaseline = 'top';
    ctxBack.fillText('日期（day）', this.start.x + this.width / 2, this.end.y + opts.titleOffset);
    ctxBack.restore();
    ctxBack.translate(this.start.x - opts.titleOffset, this.end.y - this.height / 2);
    ctxBack.rotate(-Math.PI / 2);
    ctxBack.fillText('月份（month）', 0, 0);
    ctxBack.restore();
};

//填充网格背景
Axis.prototype.drawGridRect = function (ctxBack) {
    var axisData = this.axisData;
    ctxBack.beginPath();
    ctxBack.save();
    ctxBack.fillStyle = this.opts.line.fill;
    for (var i = 0; i < axisData.length; i++) {
        for (var j = 0; j < axisData[i].length; j++) {
            var grid = axisData[i][j];
            ctxBack.rect(grid.x, grid.y, this.gridWidth, this.gridHeight);
        }
    }
    ctxBack.fill();
    ctxBack.restore();
};

//填充网格背景(交叉)
Axis.prototype.drawRectIntersect = function (ctxBack) {
    var axisData = this.axisData;
    ctxBack.beginPath();
    ctxBack.save();
    for (var i = 0; i < axisData.length; i++) {
        for (var j = 0; j < axisData[i].length; j++) {
            if (i % 2 == 0 && j % 2 == 0 || i % 2 != 0 && j % 2 != 0) {
                ctxBack.fillStyle = '#f9f9f9';
            } else {
                ctxBack.fillStyle = this.opts.line.fill;
            }
            var grid = axisData[i][j];
            ctxBack.fillRect(grid.x, grid.y, this.gridWidth, this.gridHeight);
        }
    }
    ctxBack.restore();
};

//获取单元格
Axis.prototype.getGrid = function (x, y) {
    var dataList = this.gridData;
    for (var i = 0, len = dataList.length; i < len; i++) {
        var grid = dataList[i];
        if (x >= grid.x && x < grid.x + this.gridWidth && y >= grid.y && y < grid.y + this.gridHeight) {
            return grid;
        }
    }
    return false;
};

Axis.prototype.convertGridData = function (originData, legendOptions) {
    var self = this;
    var legendOpts = legendOptions;
    originData = originData.length > self.opts.cols * self.opts.rows ? originData.slice(0, self.opts.cols * self.opts.rows) : originData;
    var axisData = self.axisData;
    var gridData = self.gridData = [];
    var palette = new Palette({
        width: legendOpts.width,
        height: legendOpts.height,
        min: legendOpts.min,
        max: legendOpts.max,
        gradient: legendOpts.gradient
    });
    var choropleth = new Choropleth(legendOpts);

    originData.forEach(function (data, i) {
        if (data.date == undefined || data.date == '') {
            return;
        }
        var reg = new RegExp("^[0-9]*$"),
            value = data.value,
            color = self.opts.line.fill,
            level = '—';

        if (!reg.test(value) || value < 0) {
            value = '—';
        } else {
            if (legendOpts.type === 'continuous') {
                color = palette.getColor(value);
                level = choropleth.get(value).level;
            } else {
                var split = choropleth.get(value);
                color = split.color;
                level = split.level;
            }
        }
        var dateArray = data.date.split('-');
        if (dateArray.length == 0) return;
        if (dateArray[1] > self.opts.rows) return;
        var m = dateArray[1],
            d = dateArray[2],
            x = axisData[d - 1][self.opts.rows - m].x,
            y = axisData[d - 1][self.opts.rows - m].y;
        var grid = new Grid(i, x, y, self.gridWidth, self.gridHeight);
        grid.centerx = x + self.gridWidth / 2;
        grid.centery = y + self.gridWidth / 2;
        grid.value = value;
        grid.color = color;
        grid.level = level;
        grid.date = data.date;
        gridData.push(grid);
    });
    return gridData;
};

//渲染中间层canvas网格
Axis.prototype.renderRect = function (ctxMiddle, originData, legendType) {
    var self = this;
    var gridData = self.convertGridData(originData, legendType);
    var opts = self.opts,
        halfWidth = self.gridWidth / 2,
        halfHeight = self.gridHeight / 2;
    ctxMiddle.save();
    ctxMiddle.textAlign = 'center';
    ctxMiddle.textBaseline = "middle";
    for (var i = 0, len = gridData.length; i < len; i++) {
        var grid = gridData[i];
        ctxMiddle.fillStyle = grid.color == null ? opts.line.fill : grid.color;
        ctxMiddle.fillRect(grid.x, grid.y, self.gridWidth, self.gridHeight);
        ctxMiddle.save();
        ctxMiddle.font = opts.labels.fontSize + 'px ' + ctxMiddle.fontFamily;
        ctxMiddle.fillStyle = opts.labels.fill;
        ctxMiddle.fillText(grid.value, grid.x + parseInt(halfWidth), grid.y + parseInt(halfHeight));
        ctxMiddle.restore();
    }
    ctxMiddle.restore();
};

/**
 * ToolTip消息框
 */
function ToolTip(container, options) {
    this.opts = options;
    this.container = container;
    this.style = options.style;
    this.isShow = options.isShow;
    this.triggerOn = options.triggerOn;
    this.create();
}

ToolTip.prototype.create = function () {
    var toolTip = document.createElement('div');
    toolTip.style.cssText = this.style;
    this.dom = toolTip;
    this.container.appendChild(toolTip);
};

ToolTip.prototype.setPosition = function (x, y) {
    var dom = this.dom;
    var left = x - dom.offsetWidth - this.opts.position[0];
    var top = y - dom.offsetHeight - this.opts.position[1];
    dom.style.left = left + 'px';
    dom.style.top = top + 'px';
};

ToolTip.prototype.setContent = function (content) {
    this.dom.innerHTML = content;
};

ToolTip.prototype.show = function () {
    this.dom.style.visibility = 'visible';
};

ToolTip.prototype.hide = function () {
    this.dom.style.visibility = 'hidden';
};

function Chart(options) {
    options = options || {};
    this.options = util.merge(defaults, options, true);
    this.init();
}

Chart.prototype.init = function () {
    var self = this;
    var options = self.options;
    self.container = createContainer(options);
    var backCanvas = self.backCanvas = createCanvasLayer(options, false);
    var middleCanvas = self.midCanvas = createCanvasLayer(options, true);
    var frontCanvas = self.foreCanvas = createCanvasLayer(options, true);
    var view = self.view = new View({
        width: options.width,
        height: options.height,
        margin: options.viewCfg.margin
    });

    //图例
    var legend = self.legend = new Legend(options.legendCfg, view);
    legend.draw(frontCanvas.context);

    //坐标系
    var axis = new Axis(options.axisCfg, view);
    axis.draw(backCanvas.context);

    //渲染中间层，文字、颜色
    axis.renderRect(middleCanvas.context, this.options.data, legend.options);

    //提示信息框
    var toolTip = new ToolTip(self.container, options.toolTip);

    //渲染最上层
    (function () {
        var index = -1;
        var bbox = frontCanvas.canvasDOM.getBoundingClientRect();
        var ctxFront = frontCanvas.context;

        function addEventListener() {
            if (toolTip.triggerOn === 'click') {
                frontCanvas.canvasDOM.addEventListener('click', move, false);
                toolTip.dom.addEventListener('click', move, false);
            } else {
                frontCanvas.canvasDOM.addEventListener('mousemove', move, false);
                toolTip.dom.addEventListener('mousemove', move, false);
            }
        }

        //鼠标进入，添加遮罩层
        function addMask(grid) {
            ctxFront.clearRect(axis.start.x, axis.start.y, axis.width, axis.height);
            ctxFront.save();
            ctxFront.fillStyle = 'rgba(255,255,255,0.2)';
            ctxFront.fillRect(grid.x, grid.y, grid.w, grid.h);
            ctxFront.restore();
        }

        //鼠标进入，添加边框
        function addBorder(grid) {
            ctxFront.save();
            ctxFront.clearRect(axis.start.x, axis.start.y, axis.width, axis.height);
            var offset = 1;
            ctxFront.lineWidth = 1;
            ctxFront.strokeStyle = "#3c3c3c";
            ctxFront.strokeRect(Math.floor(grid.x + offset), Math.floor(grid.y + offset), Math.floor(grid.w - 1.1), Math.floor(grid.h - 1.1));
            ctxFront.restore();
        }

        function move(e) {
            var x = e.clientX - bbox.left;
            var y = e.clientY - bbox.top;
            var grid = axis.getGrid(x, y);
            if (grid) {
                if (index == grid.i) {
                    return;
                }
                index = grid.i;
                // addMask(grid);
                addBorder(grid);
                if (toolTip.isShow) {
                    var content = grid.date + '<br>AQI : ' + grid.value + '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + grid.color + ';"></span>' + grid.level;
                    toolTip.setContent(content);
                    toolTip.setPosition(grid.x, grid.y);
                    toolTip.show();
                }
            } else {
                ctxFront.clearRect(axis.start.x, axis.start.y, axis.width, axis.height);
                toolTip.hide();
                index = -1;
            }
        }

        addEventListener();
    })();
};

function createCanvasLayer(options, capture) {
    var canvasLayer = new CanvasLayer({
        width: options.width,
        height: options.height,
        container: options.container,
        fontFamily: options.fontFamily
    });
    if (capture) {
        canvasLayer.addTopLeft();
    }
    return canvasLayer;
}

//日历-色块图


// 日历-色块图（逐月）
// export{default as Calendar}from'./src/main/Calendar';

exports.Chart = Chart;

Object.defineProperty(exports, '__esModule', { value: true });

})));
