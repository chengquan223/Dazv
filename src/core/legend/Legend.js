import Palette from '../data-range/Palette';
import Choropleth from '../data-range/Choropleth';
import util from '../../tool/util';
import clear from '../../canvas/clear';

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
}

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
}

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
}

Legend.prototype.renderByPieceWise = function (context) {
    var self = this;
    self.initLevel();
    self.drawSymbol(context);
}

Legend.prototype.initLevel = function () {
    var choropleth = new Choropleth(this.options); //分段颜色连续，必需，定义变量未使用，写法有待优化
    var options = this.options;
    var levels = this.levels = [];
    var radius = 0;
    if (options.itemSymbol === 'circle') {
        radius = options.itemHeight / 2;
        options.itemWidth = 0;
    }
    for (var i = 0; i < options.splitList.length; i++) {
        var split = options.splitList[i];
        levels.push({
            x: this.start.x + radius,
            y: this.end.y - options.itemHeight * i - options.itemGap * i + radius,
            fontX: this.start.x + radius * 2 + options.itemWidth + options.wordSpaceing,
            fontY: this.end.y - options.itemHeight * i - options.itemGap * i,
            start: split.start,
            end: split.end,
            text: split.level,
            color: split.color,
            hideColor: '#ccc',
            show: true
        });
    }
}

Legend.prototype.drawSymbol = function (context) {
    var options = this.options;
    this.levels.forEach(function (level, i) {
        context.beginPath();
        context.fillStyle = level.show ? level.color : level.hideColor;
        switch (options.itemSymbol) {
            case 'circle':
                context.arc(level.x, level.y, options.itemHeight / 2, 0, Math.PI * 2);
                break;
            case 'rect':
                context.rect(level.x, level.y, options.itemWidth, options.itemHeight);
                break;
            case 'roundRect':
                var radius = 3; //圆角半径
                context.moveTo(level.x + radius, level.y);
                context.arcTo(level.x + options.itemWidth, level.y, level.x + options.itemWidth, level.y + options.itemHeight, radius);
                context.arcTo(level.x + options.itemWidth, level.y + options.itemHeight, level.x, level.y + options.itemHeight, radius);
                context.arcTo(level.x, level.y + options.itemHeight, level.x, level.y, radius);
                context.arcTo(level.x, level.y, level.x + radius, level.y, radius);
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
        level.fontWidth = context.measureText(level.text).width;
        level.fontHeight = options.textStyle.fontSize < 12 ? 12 : options.textStyle.fontSize;
        context.fillStyle = level.show ? options.textStyle.color : level.hideColor;
        context.fillText(level.text, level.fontX, level.fontY + level.fontHeight / 2);

        context.restore();
    });
}

Legend.prototype.getLevel = function (point) {
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
            return level;
        }
    }
}

Legend.prototype.move = function (point, canvas) {
    if (this.getLevel(point)) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
}

Legend.prototype.click = function (point, context) {
    var level = this.getLevel(point);
    if (level) {
        clear(context);
        if (level.show) {
            //当前true则
            level.show = false;
            this.drawSymbol(context);
        } else {
            level.show = true;
            this.drawSymbol(context);
        }
        console.log(level);
    }
}

export default Legend;