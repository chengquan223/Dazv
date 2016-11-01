import Palette from '../utils/data-range/Palette';
import Choropleth from '../utils/data-range/Choropleth';


function CanvasLayer(options) {
    var self = this;
    options = options || {};
    self.options = options;
    self.init();

    //创建canvas,将canvas添加到div中,去参考echart,https://github.com/ecomfe/echarts
    var canvas = slef.canvas = document.createElement('canvas');
}

CanvasLayer.prototype.init = function () {
    var self = this;
    var legendCfg = self.options.legend;
    self.palette = new Choropleth({
        width: legendCfg.width,
        height: legendCfg.height,
        min: legendCfg.min,
        max: legendCfg.max,
        gradient: legendCfg.gradient
    });
    self.choropleth = new Choropleth(legendCfg.splitList);
}

CanvasLayer.prototype.