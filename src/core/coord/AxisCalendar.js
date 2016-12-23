import Choropleth from '../data-range/Choropleth';
import Palette from '../data-range/Palette';

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
}

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
}

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
}

//middleCanvas渲染
AxisCalendar.prototype.renderRect = function (ctx, originData, legendType) {
    var self = this;
    var gridData = this.convertGridData(originData, legendType);
}

export default AxisCalendar;