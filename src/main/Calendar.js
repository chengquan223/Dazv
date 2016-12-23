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
}

export default Calendar;