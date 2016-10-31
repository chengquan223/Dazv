import Palette from './Palette';

var dataRange = {
    drawDataRange: function () {
        var canvasFore = document.getElementById('canvas_3');
        var ctxFore = canvasFore.getContext('2d');
        var palette = new Palette();
        ctxFore.putImageData(palette.getImageData(), 10, 10);
    }
}

export default dataRange;