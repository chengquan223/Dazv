/**
 * 调色板
 */
function Palette(options) {
    options = options || {};
    this.gradient = options.gradient || {
        0.1: '#DF5A5A',
        0.2: '#DF775A',
        0.3: '#DF945A',
        0.4: '#DFB05A',
        0.5: '#DFCD5A',
        0.6: '#D4DF5A',
        0.7: '#B7DF5A',
        0.8: '#9ADF5A',
        0.9: '#7DDF5A',
        1.0: '#61DF5A'
    };
    this.width = options.width || 1;
    this.height = options.height || 256;
    this.min = options.min || 0;
    this.max = options.max || 300;
    this.init();
}

Palette.prototype.init = function () {
    var gradient = this.gradient;
    var paletteCanvas = document.createElement('canvas');
    paletteCanvas.width = this.width;
    paletteCanvas.height = this.height;
    var paletteCtx = this.paletteCtx = paletteCanvas.getContext('2d');
    var lineGradient = paletteCtx.createLinearGradient(0, 0, paletteCanvas.width, paletteCanvas.height);
    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }
    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, paletteCanvas.width, paletteCanvas.height);
}

Palette.prototype.getImageData = function () {
    return this.paletteCtx.getImageData(0, 0, this.width, this.height);
}

Palette.prototype.getColor = function (value) {
    var max = this.max;
    if (value > max) {
        max = value;
    }
    var index = Math.floor(value / max * (this.height)) * 4;
    var imageData = this.getImageData();
    return "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + imageData[index + 2] + ", " + imageData[index + 3] / 256 + ")";
}

export default Palette;