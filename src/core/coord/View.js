function View(options) {
    var margin = options.margin;
    this.start = {
        x: margin[3],
        y: margin[0]
    };
    this.end = {
        x: options.width - margin[1],
        y: options.height - margin[2]
    };
    this.width = this.end.x - this.start.x;
    this.height = this.end.y - this.start.y;
}

View.prototype.drawLine = function (context) {
    var offset = .5;
    context.strokeStyle = '#eee';
    context.beginPath();
    context.moveTo(this.start.x + offset, this.start.y + offset);
    context.lineTo(this.end.x + offset, this.start.y + offset);
    context.lineTo(this.end.x + offset, this.end.y + offset);
    context.lineTo(this.start.x + offset, this.end.y + offset);
    context.lineTo(this.start.x + offset, this.start.y + offset);
    context.stroke();
}

export default View;