import util from '../tool/util';
import defaults from '../config';
import CanvasLayer from '../core/layer/CanvasLayer';
import Palette from '../core/data-range/Palette';
import Choropleth from '../core/data-range/Choropleth';


function Chart(options) {
    initContainer(options);
}

Chart.prototype.init = function () {

}

function initContainer(options) {
    var viewCfg = util.mix({}, defaults.viewCfg, options.viewCfg);
    var container = createContainer(options);
    options.viewCfg = viewCfg;
    options.container = container;
    initOptions(options);
    console.log(options);
}

function createContainer(options) {
    var id = options.id,
        dom = document.getElementById(id),
        container = options.container;
    if (!dom && !container) {
        throw new Error("please specify the canvas container Id !");
    }
    if (dom && container) {
        throw new Error('please specify the "container" or "id" property !');
    }
    if (!container) {
        var containerid = util.guid('v-chart');
        container = util.createDiv();
        container.id = containerid;
        container.style.position = 'relative';
        dom.appendChild(container);
    }
    return container;
}

function createCanvasLayer(options, capture) {
    var canvasLayer = new CanvasLayer(options);
    if (capture) {
        canvasLayer.addTopLeft();
    }
    canvasLayer['fontFamily'] = defaults.fontFamily;
    return canvasLayer;
}

function initOptions(options) {
    var w = options.width,
        h = options.height,
        c = options.container,
        canvasOpt = {
            width: w,
            height: h,
            containerDOM: c,
            capture: false,
        },
        c1 = createCanvasLayer(canvasOpt, false),
        c2 = createCanvasLayer(canvasOpt, true),
        c3 = createCanvasLayer(canvasOpt, true);
    options.backCanvas = c1, options.midCanvas = c1, options.foreCanvas = c3;
    return options;
}

export default Chart;