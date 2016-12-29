import util from '../tool/util';
import defaults from '../config';
import createContainer from '../core/container';
import CanvasLayer from '../core/layer/CanvasLayer';
import View from '../core/coord/View';
import Legend from '../core/legend/Legend';
import Axis from '../core/coord/Axis';
import ToolTip from '../core/tooltip/ToolTip';
import clear from '../canvas/clear';

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
    axis.render(middleCanvas.context, this.options.data, legend.options);

    //提示信息框
    var toolTip = new ToolTip(self.container, options.toolTip);

    //渲染最上层
    (function () {
        var index = -1;
        var bbox = frontCanvas.canvasDOM.getBoundingClientRect();
        var ctxFront = frontCanvas.context;

        function addEventListener() {
            frontCanvas.canvasDOM.addEventListener('mousemove', move, false);
            frontCanvas.canvasDOM.addEventListener('click', legendClick, false);
            toolTip.dom.addEventListener('mousemove', move, false);
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
        };

        function move(e) {
            e.stopPropagation();
            var point = {
                x: e.clientX - bbox.left,
                y: e.clientY - bbox.top
            };
            legendMove(point);
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
                ctxFront.clearRect(axis.start.x, axis.start.y, axis.width, axis.height);
                toolTip.hide();
                index = -1;
            }
        }

        function legendMove(point) {
            if (legend.options.type === 'piecewise') {
                legend.move(point, frontCanvas.canvasDOM);
            }
        }

        function legendClick(e) {
            e.stopPropagation();
            var point = {
                x: e.clientX - bbox.left,
                y: e.clientY - bbox.top
            };
            if (legend.options.type === 'piecewise') {
                var level = legend.getLevel(point);
                if (level) {
                    clear(ctxFront);
                    level.show = level.show ? false : true;
                    legend.drawSymbol(ctxFront);
                    var selectedList = legend.updateSelectedList(level); //更新要剔除的等级
                    var data = axis.removeData(selectedList);
                    axis.drawRect(middleCanvas.context, data);
                }
            }
        }

        addEventListener();
    })();
}

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

export default Chart;