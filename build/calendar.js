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

//是否在矩形内
function isPointInRect(point, bound) {
    var wn = bound.wn; //西北
    var es = bound.es; //东南
    return point.x >= wn.x && point.x <= es.x && point.y >= wn.y && point.y <= es.y;
}

//是否在园内
function isPointInCircle(point, center, radius) {
    var dis = utilLib.getDistance(point, center);
    return dis <= radius;
}

//两点间距离
function getDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

var util = {
    merge: merge,
    guid: guid,
    createDiv: createDiv,
    isPointInRect: isPointInRect,
    isPointInCircle: isPointInCircle,
    getDistance: getDistance
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
            fill: '#f7f7f7',
            color: '#666'
        },
        weekStyle: {
            height: 21,
            fontSize: 12,
            fill: '#fff',
            color: '#999'
        },
        dayStyle: {
            fontSize: 12,
            stroke: '#ccc',
            color: '#3c3c3c'
        },
        itemStyle: {
            stroke: '#eee',
            fill: '#ddd',
            lineWidth: .5
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
                this.renderByPieceWise(context);
                break;
            default:
                this.renderByContinuous(context);
                break;
        }
    }
};

Legend.prototype.renderByContinuous = function (context) {
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

Legend.prototype.renderByPieceWise = function (context) {
    this.addLevel();
    this.drawSymbol(context, this.options.itemSymbol);
};

Legend.prototype.addLevel = function () {
    var choropleth = new Choropleth(this.options); //分段颜色连续，必需，定义变量未使用，写法有待优化
    var options = this.options;
    var levels = this.levels = [];
    var radius = options.itemSymbol === 'circle' ? options.itemHeight / 2 : 0;
    for (var i = 0; i < options.splitList.length; i++) {
        var split = options.splitList[i];
        levels.push({
            x: this.start.x + radius,
            y: this.end.y - options.itemHeight * i - options.itemGap * i + radius,
            fontX: this.start.x + options.itemWidth - radius + options.wordSpaceing,
            fontY: this.end.y - options.itemHeight * i - options.itemGap * i + radius,
            start: split.start,
            end: split.end,
            text: split.level,
            color: split.color
        });
    }
};

Legend.prototype.drawSymbol = function (context, type) {
    var options = this.options;
    this.levels.forEach(function (level, i) {
        var fontX, fontY;
        context.beginPath();
        context.fillStyle = level.color;
        switch (type) {
            case 'circle':
                context.arc(level.x, level.y, options.itemHeight / 2, 0, Math.PI * 2);
                fontX = level.x + options.itemHeight / 2 + options.wordSpaceing;
                fontY = level.y;
                break;
            case 'rect':
                context.rect(level.x, level.y, options.itemWidth, options.itemHeight);
                fontX = level.x + options.itemWidth + options.wordSpaceing;
                fontY = level.y + options.itemHeight / 2;
                break;
            case 'roundRect':
                var radius = 3; //圆角半径
                context.moveTo(level.x + radius, level.y);
                context.arcTo(level.x + options.itemWidth, level.y, level.x + options.itemWidth, level.y + options.itemHeight, radius);
                context.arcTo(level.x + options.itemWidth, level.y + options.itemHeight, level.x, level.y + options.itemHeight, radius);
                context.arcTo(level.x, level.y + options.itemHeight, level.x, level.y, radius);
                context.arcTo(level.x, level.y, level.x + radius, level.y, radius);
                fontX = level.x + options.itemWidth + options.wordSpaceing;
                fontY = level.y + options.itemHeight / 2;
                break;
            default:
                break;
        }
        context.fill();
        context.closePath();

        context.save();
        context.textAlign = 'left';
        context.textBaseline = "middle";
        context.font = options.textStyle.fontSize + 'px ' + context.fontFamily;
        context.fillStyle = options.textStyle.color;
        context.fillText(level.text, fontX, fontY);
        level.fontWidth = context.measureText(level.text).width;
        level.fontHeight = options.textStyle.fontSize < 12 ? 12 : options.textStyle.fontSize;
        context.restore();
    });
};

Legend.prototype.move = function (point, canvas) {
    var options = this.options;
    var levels = this.levels;
    var flag1, flag2;

    for (var i = 0, l = levels.length; i < l; i++) {
        var level = levels[i];
        //圆、矩形、圆角矩形
        switch (options.itemSymbol) {
            case 'circle':
                var point2 = {
                    x: level.x,
                    y: level.y
                };
                flag1 = util.isPointInCircle(point, point2, options.itemHeight / 2);
                break;
            default:
                var bound = {
                    wn: {
                        x: level.x,
                        y: level.y
                    },
                    es: {
                        x: level.x + options.itemWidth,
                        y: level.y + options.itemHeight
                    }
                };
                flag1 = util.isPointInRect(point, bound);
                break;
        }

        flag2 = util.isPointInRect(point, {
            wn: {
                x: level.fontX,
                y: level.fontY
            },
            es: {
                x: level.fontX + level.fontWidth,
                y: level.fontY + level.fontHeight
            }
        });

        if (flag1 || flag2) {
            canvas.style.cursor = 'pointer';
            break;
        }
        canvas.style.cursor = 'default';
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

function AxisCalendar(opts, view) {
    this.opts = opts;
    this.viewWidth = view.width;
    this.viewHeight = view.height;
    this.start = view.start;
    this.end = view.end;
    this.init();
}

AxisCalendar.prototype.init = function () {
    var options = this.opts;
    this.weeks = ['日', '一', '二', '三', '四', '五', '六'];
    this.boxWidth = this.viewWidth / this.opts.cols;
    this.boxHeight = this.viewHeight / this.opts.rows;
    this.width = this.boxWidth - options.margin[1];
    this.height = this.boxHeight - options.margin[2];
    this.monthHeight = options.monthStyle.height;
    this.weekWidth = this.dayWidth = this.width / this.weeks.length;
    this.weekHeight = options.weekStyle.height;
    this.dayHeight = (this.height - this.monthHeight - this.weekHeight) / 6; //6行
    this.axisData = [];
};

AxisCalendar.prototype.drawCalendar = function (ctx, year, month, start) {
    var self = this;
    var options = self.opts;
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';

    //月份
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = options.monthStyle.fill;
    ctx.fillRect(start.x, start.y, self.width, self.monthHeight);
    ctx.restore();
    ctx.save();
    ctx.font = options.monthStyle.fontWeight + ' ' + options.monthStyle.fontSize + 'px ' + ctx.fontFamily;
    ctx.fillStyle = options.monthStyle.color;
    ctx.fillText(year + '年' + month + '月', start.x + self.width / 2, start.y + self.monthHeight / 2);
    ctx.restore();
    ctx.closePath();

    //周
    ctx.save();
    ctx.fillStyle = options.weekStyle.fill;
    ctx.fillRect(start.x, start.y + self.monthHeight, self.width, self.weekHeight);
    ctx.restore();
    self.weeks.forEach(function (week, i) {
        ctx.save();
        ctx.font = options.weekStyle.fontWeight || '' + ' ' + options.weekStyle.fontSize + 'px ' + ctx.fontFamily;
        ctx.fillStyle = options.weekStyle.color;
        ctx.fillText(week, start.x + self.weekWidth * i + self.weekWidth / 2, start.y + self.monthHeight + self.weekHeight / 2);
        ctx.restore();
    });

    //日
    ctx.save();
    ctx.font = options.dayStyle.fontWeight || '' + ' ' + options.dayStyle.fontSize + 'px ' + ctx.fontFamily;
    ctx.fillStyle = options.dayStyle.color;

    var firstDay = new Date(year, month - 1, 1); //这月第一天
    var firstWeekDay = firstDay.getDay(); //这月第一天星期几
    firstDay.setMonth(month, 0);
    var allDays = firstDay.getDate(); //这月有多少天
    var dayDatas = [];
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 7; col++) {
            var index = row * 7 + col;
            if (index >= allDays + firstWeekDay) continue;
            if (index >= firstWeekDay) {
                var x = start.x + self.weekWidth * col;
                var y = start.y + self.monthHeight + self.weekHeight + self.dayHeight * row;
                ctx.fillText(index - firstWeekDay + 1, x + self.weekWidth / 2, y + self.dayHeight / 2);
                dayDatas.push({
                    x: x,
                    y: y
                });
            }
        }
    }
    self.axisData.push(dayDatas);
    ctx.restore();

    //边框
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = options.itemStyle.stroke;
    ctx.lineWidth = options.itemStyle.lineWidth;
    ctx.strokeRect(start.x, start.y, self.width, self.monthHeight); //月份边框
    for (var r = 0; r < 7; r++) {
        ctx.moveTo(start.x, start.y + self.monthHeight + self.weekHeight + self.dayHeight * r);
        ctx.lineTo(start.x + self.width, start.y + self.monthHeight + self.weekHeight + self.dayHeight * r);
    }

    for (var c = 0; c < 8; c++) {
        ctx.moveTo(start.x + self.weekWidth * c, start.y + self.monthHeight);
        ctx.lineTo(start.x + self.weekWidth * c, start.y + self.height);
    }

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
};

//backCanvas渲染
AxisCalendar.prototype.draw = function (ctx, year) {
    var options = this.opts;
    for (var i = 0; i < options.rows; i++) {
        for (var j = 0; j < options.cols; j++) {
            var month = i * options.cols + j + 1;
            var start = {
                x: this.start.x + this.boxWidth * j,
                y: this.start.y + this.boxHeight * i
            };

            this.drawCalendar(ctx, year, month, start);
        }
    }
};

//获取单元格
AxisCalendar.prototype.getGrid = function (point) {
    var dataList = this.gridData;
    for (var i = 0, len = dataList.length; i < len; i++) {
        var grid = dataList[i];
        if (point.x >= grid.x && point.x < grid.x + grid.w && point.y >= grid.y && point.y < grid.y + grid.h) {
            return grid;
        }
    }
    return false;
};

AxisCalendar.prototype.convertGridData = function (originData, legendOpts) {
    var self = this;
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
            color = self.opts.itemStyle.fill,
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
        var m = dateArray[1],
            d = dateArray[2],
            x = axisData[m - 1][d - 1].x,
            y = axisData[m - 1][d - 1].y;
        var grid = new Grid(i, x, y, self.dayWidth, self.dayHeight);
        grid.centerx = x + self.dayWidth / 2;
        grid.centery = y + self.dayWidth / 2;
        grid.value = value;
        grid.color = color;
        grid.level = level;
        grid.date = data.date;
        grid.day = d;
        gridData.push(grid);
    });
    return gridData;
};

//middleCanvas渲染
AxisCalendar.prototype.renderRect = function (ctxMiddle, originData, legendOpts) {
    var self = this;
    var gridData = self.convertGridData(originData, legendOpts);

    var opts = self.opts,
        halfWidth = self.dayWidth / 2,
        halfHeight = self.dayHeight / 2;
    ctxMiddle.save();
    ctxMiddle.textAlign = 'center';
    ctxMiddle.textBaseline = "middle";
    ctxMiddle.font = opts.dayStyle.fontSize + 'px ' + ctxMiddle.fontFamily;
    for (var i = 0, len = gridData.length; i < len; i++) {
        var grid = gridData[i];
        ctxMiddle.fillStyle = grid.color == null ? opts.itemStyle.fill : grid.color;
        ctxMiddle.fillRect(grid.x, grid.y, grid.w, grid.h);
        ctxMiddle.save();
        ctxMiddle.fillStyle = opts.dayStyle.color;
        ctxMiddle.fillText(grid.day, grid.x + parseInt(halfWidth), grid.y + parseInt(halfHeight));
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

function Calendar(options) {
    options = options || {};
    this.options = util.merge(defaults, options, true);
    this.init();
}

Calendar.prototype.init = function () {
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
    var axis = new AxisCalendar(options.calendarCfg, view);
    axis.draw(backCanvas.context, options.data.year);

    //渲染中间层，文字、颜色
    axis.renderRect(middleCanvas.context, this.options.data.days, legend.options);

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
            ctxFront.clearRect(axis.start.x, axis.start.y, axis.viewWidth, axis.viewHeight);
            var offset = 1;
            ctxFront.lineWidth = 1;
            ctxFront.strokeStyle = "#3c3c3c";
            ctxFront.strokeRect(Math.floor(grid.x + offset), Math.floor(grid.y + offset), Math.floor(grid.w - 1.1), Math.floor(grid.h - 1.1));
            ctxFront.restore();
        }

        function move(e) {
            e.stopPropagation();
            var point = {
                x: e.clientX - bbox.left,
                y: e.clientY - bbox.top
            };
            legend.move(point, frontCanvas.canvasDOM);
            var grid = axis.getGrid(point);
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
                ctxFront.clearRect(axis.start.x, axis.start.y, axis.viewWidth, axis.viewHeight);
                toolTip.hide();
                index = -1;
            }
        }

        addEventListener();
    })();
};

//日历-色块图
// export{default as Chart}from'./src/main/Chart';

// 日历-色块图（逐月）

exports.Calendar = Calendar;

Object.defineProperty(exports, '__esModule', { value: true });

})));
