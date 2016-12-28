import Choropleth from '../data-range/Choropleth';
import Palette from '../data-range/Palette';
import Grid from '../coord/Grid';

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
}

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
}

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
}

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
}

AxisCalendar.prototype.convertGridData = function (originData, legendOpts) {
    var self = this;
    var axisData = self.axisData;
    var gridData = [];
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
}

AxisCalendar.prototype.render = function (context, originData, legendOpts) {
    this.gridData = this.convertGridData(originData, legendOpts);
    this.drawRect(context, this.gridData);
}

//middleCanvas渲染
AxisCalendar.prototype.drawRect = function (context, data) {
    var self = this;
    var options = self.opts;
    var width = self.dayWidth / 2;
    var height = self.dayHeight / 2;
    context.save();
    context.font = options.dayStyle.fontSize + 'px ' + context.fontFamily;
    data.forEach(function (grid, i) {
        context.fillStyle = grid.color == null ? options.itemStyle.fill : grid.color;
        context.fillRect(grid.x, grid.y, grid.w, grid.h);

        context.save();
        context.fillStyle = options.dayStyle.color;
        context.fillText(grid.day, grid.x + width, grid.y + height);
        context.restore();
    });
    context.restore();
}

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
}

export default AxisCalendar;