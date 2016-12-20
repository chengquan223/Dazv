import Choropleth from '../data-range/Choropleth';
import Palette from '../data-range/Palette';

function AxisCalendar(opts, view) {
    this.opts = opts;
    this.width = view.width;
    this.height = view.height;
    this.start = view.start;
    this.end = view.end;
    this.CalculateGridWidthHeight();
}

AxisCalendar.prototype.CalculateGridWidthHeight = function () {
    this.gridWidth = this.width / this.opts.cols;
    this.gridHeight = this.height / this.opts.rows;
}

AxisCalendar.prototype.draw = function (ctx) {
    var opts = this.opts;
    var index = 0,
        left = opts.margin[1],
        bottom = opts.margin[2],
        basicData = createBasicData();
    for (var i = 0; i < opts.rows; i++) {
        for (var j = 0; j < opts.cols; j++) {
            var startPoint = {
                x: this.start.x + this.gridWidth * j,
                y: this.start.y + this.gridHeight * i
            };
            drawCalendarBorder(startPoint, this);
            drawMonth(startPoint, index, basicData, this);
            drawWeek(startPoint, basicData, this);
            drawDay(startPoint, this);
        }
    }

    function createBasicData() {
        return {
            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weeks: ['日', '一', '二', '三', '四', '五', '六']
        };
    }

    function drawCalendarBorder(point, _this) {
        ctx.beginPath();
        ctx.strokeStyle = opts.itemStyle.stroke;
        ctx.lineWidth = opts.itemStyle.lineWidth;
        ctx.rect(point.x, point.y, _this.gridWidth - left, _this.gridHeight - bottom);
        ctx.stroke();
        ctx.closePath();
    }

    function drawMonth(point, index, basicData, _this) {
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = opts.monthStyle.fill;
        ctx.fillRect(point.x, point.y, _this.gridWidth - left, opts.monthStyle.height);
        ctx.restore();
        ctx.closePath();

        ctx.save();
        ctx.font = "bold 12px " + ctx.fontFamily;
        ctx.fillStyle = opts.monthStyle.color;
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillText('2016年' + basicData.months[index], point.x + _this.gridWidth / 2, point.y + 12);
        ctx.restore();
    }

    function drawWeek(point, basicData, _this) {
        var weeks = basicData.weeks;
        ctx.save();
        ctx.font = "10px " + ctx.fontFamily;
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        var monthWidth = _this.gridWidth - left,
            monthHeight = opts.monthStyle.height,
            weekWidth = monthWidth / 7,
            weekHeight = opts.weekStyle.height,
            color = opts.weekStyle.color;
        ctx.save();
        ctx.fillStyle = opts.weekStyle.fill;
        ctx.fillRect(point.x, point.y + monthHeight, monthWidth, weekHeight);
        ctx.restore();
        for (var i = 0, len = weeks.length; i < len; i++) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.fillText(weeks[i], point.x + weekWidth * i + weekWidth / 2, point.y + 12 + weekHeight);
            ctx.restore();
        }
        ctx.stroke();
        ctx.restore();
    }

    function drawDay(point, _this) {
        var day = 1,
            monthWidth = _this.gridWidth - left,
            monthHeight = opts.monthStyle.height,
            weekHeight = opts.weekStyle.height,
            dayWidth = Math.round(monthWidth / 7 * 10) / 10,
            dayHeight = Math.round((_this.gridHeight - bottom - monthHeight - weekHeight) / 6 * 10) / 10,
            sy = point.y + monthHeight + weekHeight;
        ctx.save();
        ctx.font = "10px " + ctx.fontFamily;
        ctx.fillStyle = opts.dayStyle.color;
        ctx.textAlign = "center";
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                var day = Math.floor(Math.random() * 100);
                var color = '#fefefe';
                if (day > 0) {
                    // color = _opts._opts.legend.events.getColor(day);
                }
                ctx.save();
                ctx.fillStyle = '#eee';
                ctx.fillRect(point.x + dayWidth * j, sy + dayHeight * i, dayWidth, dayHeight);
                ctx.restore();
                ctx.fillText(day, point.x + dayWidth * j + dayWidth / 2, sy + dayHeight * i + dayHeight / 2 + dayHeight / 5);
            }
        }
        ctx.restore();
    }
}

export default AxisCalendar;