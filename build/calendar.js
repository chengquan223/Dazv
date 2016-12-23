(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Dazv = global.Dazv || {})));
}(this, (function (exports) { 'use strict';

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
    guid: guid,
    createDiv: createDiv,
    mix: mix,
    toArray: toArray
};

var defaults = {
    width: 1000,
    height: 500,
    fontSize: 12,
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
            height: 18,
            fontSize: 12,
            fill: '#fff',
            lineWidth: 0.5,
            color: '#999'
        },
        dayStyle: {
            fontSize: 12,
            lineWidth: 0.1,
            stroke: '#ccc',
            color: '#666'
        },
        itemStyle: {
            stroke: '#eee',
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
    context.font = options.textStyle.fontSize + 'px ' + options.textStyle.fontFamily;
    context.fillStyle = options.textStyle.color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(options.max, this.start.x + options.width / 2, this.start.y - options.textGap);
    context.fillText(options.min, this.start.x + options.width / 2, this.end.y + options.textGap);
    context.restore();
};

Legend.prototype.drawByPieceWise = function (context) {
    var choropleth = new Choropleth(this.options);
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
        context.font = options.textStyle.fontSize + 'px ' + options.textStyle.fontFamily;
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
        context.font = options.textStyle.fontSize + 'px ' + options.textStyle.fontFamily;
        context.fillStyle = options.textStyle.color;
        context.fillText(item.level, itemX + options.itemWidth + options.wordSpaceing, itemY + radius);
        context.restore();
        // this.getTextWidthHeight(item.level);
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
        context.font = options.textStyle.fontSize + 'px ' + options.textStyle.fontFamily;
        context.fillStyle = options.textStyle.color;
        context.fillText(item.level, itemX + options.itemWidth + options.wordSpaceing, itemY + radius);
        context.restore();
    }
};

Legend.prototype.getTextWidthHeight = function (text) {
    var span = document.createElement('span');
    var options = this.options;
    span.style.font = options.textStyle.fontSize + 'px ' + options.textStyle.fontFamily;
    span.innerText = text;
    document.body.appendChild(span);
    var widthHeight = {
        width: span.offsetWidth,
        height: span.offsetHeight
    };
    document.body.removeChild(span);
    return widthHeight;
};

function AxisCalendar(opts, view) {
    this.opts = opts;
    this.width = view.width;
    this.height = view.height;
    this.start = view.start;
    this.end = view.end;
    this.init();
}

AxisCalendar.prototype.init = function () {
    this.gridWidth = this.width / this.opts.cols;
    this.gridHeight = this.height / this.opts.rows;
    this.weeks = ['日', '一', '二', '三', '四', '五', '六'];
};

AxisCalendar.prototype.drawCalendar = function (ctx, year, month, start) {
    var options = this.opts;
    var width = this.gridWidth - options.margin[1];
    var height = this.gridHeight - options.margin[2];
    var monthHeight = options.monthStyle.height;
    var weekWidth = width / this.weeks.length;
    var weekHeight = options.weekStyle.height;
    var dayHeight = (height - monthHeight - weekHeight) / 6;
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';

    //月份
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = options.monthStyle.fill;
    ctx.fillRect(start.x, start.y, width, monthHeight);
    ctx.restore();
    ctx.save();
    ctx.font = options.monthStyle.fontWeight + ' ' + options.monthStyle.fontSize + 'px ' + ctx.fontFamily;
    ctx.fillStyle = options.monthStyle.color;
    ctx.fillText(year + '年' + month + '月', start.x + this.gridWidth / 2, start.y + monthHeight / 2);
    ctx.restore();
    ctx.closePath();

    //周
    ctx.save();
    ctx.fillStyle = options.weekStyle.fill;
    ctx.fillRect(start.x, start.y + monthHeight, width, weekHeight);
    ctx.restore();
    this.weeks.forEach(function (week, i) {
        ctx.save();
        ctx.font = options.weekStyle.fontWeight || '' + ' ' + options.weekStyle.fontSize + 'px ' + ctx.fontFamily;
        ctx.fillStyle = options.weekStyle.color;
        ctx.fillText(week, start.x + weekWidth * i + weekWidth / 2, start.y + monthHeight + weekHeight / 2);
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
    for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 7; col++) {
            var index = row * 7 + col;
            if (index >= allDays + firstWeekDay) continue;
            if (index >= firstWeekDay) {
                ctx.fillText(index - firstWeekDay + 1, start.x + weekWidth * col + weekWidth / 2, start.y + monthHeight + weekHeight + dayHeight * row + dayHeight / 2);
            }
        }
    }
    ctx.restore();

    //边框
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = options.itemStyle.stroke;
    ctx.lineWidth = options.itemStyle.lineWidth;
    for (var r = 0; r < 7; r++) {
        ctx.moveTo(start.x, start.y + monthHeight + weekHeight + dayHeight * r);
        ctx.lineTo(start.x + width, start.y + monthHeight + weekHeight + dayHeight * r);
    }

    for (var c = 0; c < 8; c++) {
        ctx.moveTo(start.x + weekWidth * c, start.y + monthHeight + weekHeight);
        ctx.lineTo(start.x + weekWidth * c, start.y + height);
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
                x: this.start.x + this.gridWidth * j,
                y: this.start.y + this.gridHeight * i
            };

            this.drawCalendar(ctx, year, month, start);
        }
    }
};

//middleCanvas渲染
AxisCalendar.prototype.renderRect = function (ctx, originData, legendType) {
    var self = this;
    var gridData = this.convertGridData(originData, legendType);
};

/**
 * ToolTip消息框
 */

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
    var self = this;
    options = options || {};
    self.options = util.mix({}, defaults, options);
    self.init();
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
    // axis.render(backCanvas.context, self.data);
    axis.draw(backCanvas.context, options.data.year);
};

//日历-色块图
// export{default as Chart}from'./src/main/Chart';


// 日历-色块图（逐月）

exports.Calendar = Calendar;

Object.defineProperty(exports, '__esModule', { value: true });

})));
