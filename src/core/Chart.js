import util from '../tool/util';
import defaults from '../config';
import createContainer from './container';
import CanvasLayer from '../core/layer/CanvasLayer';
import View from '../core/coord/View';
import Legend from '../core/legend/Legend';

function Chart(options) {
    var self = this;
    options = options || {};
    self.options = util.mix({}, defaults, options);
    self.init();
}

Chart.prototype.init = function () {
    var self = this;
    var options = self.options;
    self.container = createContainer(options);
    var backCanvas = self.backCanvas = createCanvasLayer(options, false);
    self.midCanvas = createCanvasLayer(options, true);
    self.foreCanvas = createCanvasLayer(options, true);
    var view = self.view = new View({
        width: options.width,
        height: options.height,
        margin: options.viewCfg.margin
    });
    var legend = self.legend = new Legend(options.legendCfg, view);
    view.drawLine(self.backCanvas.context); //测试
    legend.draw(backCanvas.context);
}

Chart.prototype.get = function (name) {
    return this[name];
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