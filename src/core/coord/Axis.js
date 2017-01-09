import Choropleth from '../data-range/Choropleth';
import Palette from '../data-range/Palette';
import Grid from '../coord/Grid';
import clear from '../../canvas/clear';

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
            })
        }
        data.push(xdata);
    }
    return data;
}

Axis.prototype.draw = function (ctxBack) {
    this.drawAxis(ctxBack);
    this.drawTickLine(ctxBack);
    this.opts.isIntersect ? this.drawRectIntersect(ctxBack) : this.drawGridRect(ctxBack);
    this.drawTitle(ctxBack);
}

//画x,y轴
Axis.prototype.drawAxis = function (ctxBack) {
    ctxBack.beginPath();
    ctxBack.lineWidth = this.opts.line.lineWidth;
    ctxBack.strokeStyle = this.opts.line.stroke;
    ctxBack.moveTo(this.start.x, this.start.y);
    ctxBack.lineTo(this.start.x, this.end.y);
    ctxBack.lineTo(this.end.x, this.end.y);
    ctxBack.stroke();
}

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
}

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
}

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
}

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
}

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
}

//获取单元格
Axis.prototype.getGrid = function (point) {
    var dataList = this.gridData;
    for (var i = 0, len = dataList.length; i < len; i++) {
        var grid = dataList[i];
        if (point.x >= grid.x && point.x < grid.x + grid.w && point.y >= grid.y && point.y < grid.y + grid.h) {
            return grid;
        }
    }
    return false;
}

Axis.prototype.convertGridData = function (originData, legendOpts) {
    var self = this;
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
}

//渲染中间层canvas网格
Axis.prototype.render = function (context, originData, legendOpts) {
    this.gridData = this.convertGridData(originData, legendOpts);
    this.drawRect(context, this.gridData);
}

//middleCanvas渲染
Axis.prototype.drawRect = function (context, data) {
    var self = this;
    var options = self.opts;
    var width = self.gridWidth / 2;
    var height = self.gridHeight / 2;
    clear(context);
    context.save();
    context.font = options.labels.fontSize + 'px ' + context.fontFamily;
    data.forEach(function (grid, i) {
        context.fillStyle = grid.color == null ? options.itemStyle.fill : grid.color;
        context.fillRect(grid.x, grid.y, grid.w, grid.h);

        context.save();
        context.fillStyle = options.labels.fill;
        context.fillText(grid.value, grid.x + width, grid.y + height);
        context.restore();
    });
    context.restore();
}

Axis.prototype.removeData = function (selectedList) {
    var data = [];
    this.gridData.forEach(function (grid, i) {
        selectedList.forEach(function (level, j) {
            if ((level.start === undefined || level.start !== undefined && grid.value > level.start) &&
                (level.end === undefined || level.end !== undefined && grid.value <= level.end)) {
                data.push(grid);
            }
        });
    });
    return data;
}

export default Axis;