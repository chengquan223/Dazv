/**
 * 值域
 var splitList = [{
        start: 0,
        end: 50,
        color: '#00E400',
        level: '优'
    }, {
        start: 50,
        end: 100,
        color: '#FFFF00',
        level: '良'
 }];
 */
function Choropleth(splitList) {
    this.splitList = splitList || {};
}

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;
    var split = false;
    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined || splitList[i].start !== undefined && count >= splitList[i].start) &&
            (splitList[i].end === undefined || splitList[i].end !== undefined && count < splitList[i].end)) {
            split = splitList[i];
            break;
        }
    }
    return split;
}

export default Choropleth;