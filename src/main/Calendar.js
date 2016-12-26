import util from '../tool/util';
import defaults from '../config';
import createContainer from '../core/container';
import CanvasLayer from '../core/layer/CanvasLayer';
import View from '../core/coord/View';
import Legend from '../core/legend/Legend';
import AxisCalendar from '../core/coord/AxisCalendar';
import ToolTip from '../core/tooltip/ToolTip';

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
        };

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
                ctxFront.clearRect(axis.start.x, axis.start.y, axis.viewWidth, axis.viewHeight);
                toolTip.hide();
                index = -1;
            }
        }

        addEventListener();
    })();
}

export default Calendar;