/**
 * 值域
 */
import Palette from './Palette';

function Choropleth(options) {
    this.options = options;
    this.splitList = options.splitList || {};
    this.type = options.type || 'continuous';
    this.calculable = options.calculable;
    this.init();
}

Choropleth.prototype.init = function () {
    if (this.type == 'piecewise' && this.calculable) {
        var palette = new Palette(this.options);
        var splitList = this.splitList;
        for (var i = 0; i < splitList.length; i++) {
            splitList[i].color = palette.getColor(splitList[i].start);
        }
    }
}

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;
    var split = false;
    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined || splitList[i].start !== undefined && count > splitList[i].start) &&
            (splitList[i].end === undefined || splitList[i].end !== undefined && count <= splitList[i].end)) {
            split = splitList[i];
            break;
        }
    }
    return split;
}

export default Choropleth;